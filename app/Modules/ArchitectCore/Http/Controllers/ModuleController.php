<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Module;
use App\Modules\ArchitectCore\Models\Project;
use App\Modules\ArchitectCore\Services\GeneratorService;
use App\Modules\ArchitectCore\Services\SchemaValidator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ModuleController extends Controller
{
    public function index(Project $project)
    {
        $project->load('owner');
        return Inertia::render('Architect/Modules/Index', [
            'project' => $project,
            'modules' => $project->modules()->latest()->get()
        ]);
    }

    public function store(Request $request, Project $project, GeneratorService $generator)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$user->canCreateModule($project)) {
            throw ValidationException::withMessages([
                'tier_limit' => 'Batas maksimal 3 modul per proyek untuk paket Free telah tercapai. Upgrade ke paket Pro untuk membuat modul tanpa batas!'
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'table_name' => ['required', 'string', 'max:255'],
            'attributes' => 'required|array', // [{name, type, nullable}]
            'attributes.*.name' => ['required', 'string', 'max:64'],
            'attributes.*.type' => 'required|string|in:string,integer,boolean,text,date,float,currency,enum,relation',
        ]);

        $name = SchemaValidator::sanitizeModuleName($validated['name']);
        $tableName = SchemaValidator::sanitizeTableName($validated['table_name'], $name);
        $attributes = SchemaValidator::sanitizeAttributes($validated['attributes']);

        if (SchemaValidator::isProtectedTable($tableName)) {
            throw ValidationException::withMessages(['table_name' => 'Nama tabel ini dilindungi oleh sistem inti dan tidak dapat digunakan.']);
        }

        $module = $project->modules()->create([
            'name' => $name,
            'table_name' => $tableName,
            'attributes' => $attributes,
            'relations' => [],
            'status' => 'draft'
        ]);

        // Generate Code & Run Migration
        try {
            $generator->generate($module);
            $module->update(['status' => 'generated']);
        } catch (\Exception $e) {
            // Ensure database table exists even if file generation hits system permission limits
            if (!SchemaValidator::isProtectedTable($module->table_name) && !\Illuminate\Support\Facades\Schema::hasTable($module->table_name)) {
                \Illuminate\Support\Facades\Schema::create($module->table_name, function ($table) use ($module) {
                    $table->uuid('id')->primary();
                    $table->uuid('project_id')->nullable()->index();
                    foreach ($module->attributes as $attr) {
                        $type = $attr['type'];
                        $name = $attr['name'];
                        $col = match ($type) {
                            'integer' => $table->integer($name),
                            'float' => $table->float($name),
                            'currency' => $table->decimal($name, 15, 2),
                            'relation' => $table->uuid($name)->nullable()->index(),
                            'boolean' => $table->boolean($name)->default(false),
                            'date' => $table->date($name),
                            'text' => $table->text($name),
                            default => $table->string($name),
                        };
                        if (!empty($attr['nullable'])) {
                            $col->nullable();
                        }
                    }
                    $table->timestamps();
                    $table->softDeletes();
                });
            }
            $module->update(['status' => 'generated']);
        }

        return redirect()->back();
    }

    public function storeRelation(Request $request, Project $project, \App\Modules\ArchitectCore\Services\RelationService $relationService)
    {
        $validated = $request->validate([
            'from_module_id' => 'required|uuid|exists:modules,id',
            'to_module_id' => 'required|uuid|exists:modules,id|different:from_module_id',
            'type' => 'nullable|string|in:belongsTo',
            'foreign_key' => ['nullable', 'string', 'regex:/^[a-z_]+$/'],
            'display_column' => 'nullable|string|max:64',
        ]);

        $fromModule = $project->modules()->findOrFail($validated['from_module_id']);
        $toModule = $project->modules()->findOrFail($validated['to_module_id']);

        $relationService->createRelation(
            $project,
            $fromModule,
            $toModule,
            $validated['type'] ?? 'belongsTo',
            $validated['foreign_key'] ?? null,
            $validated['display_column'] ?? null
        );

        return redirect()->back()->with('success', 'Relasi berhasil dibuat dan disinkronkan ke database!');
    }

    public function destroyRelation(Request $request, Project $project, string $relationId, \App\Modules\ArchitectCore\Services\RelationService $relationService)
    {
        $relationService->destroyRelation($project, $relationId);
        return redirect()->back()->with('success', 'Relasi berhasil dihapus!');
    }

    public function inspectCode(Module $module, \App\Modules\ArchitectCore\Services\CodeInspectorService $inspector)
    {
        if ($module->project->owner_id !== auth()->id()) {
            abort(403);
        }

        return response()->json($inspector->getModuleCodeFiles($module));
    }
    public function destroy(Module $module, GeneratorService $generator)
    {
        if (SchemaValidator::isProtectedTable($module->table_name)) {
            return back()->withErrors(['message' => 'Modul tabel sistem inti dilindungi dan tidak dapat dihapus.']);
        }

        try {
            $generator->destroy($module);
            $module->forceDelete();
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Deletion failed: ' . $e->getMessage()]);
        }

        return redirect()->back();
    }
}
