<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Project;
use App\Modules\ArchitectCore\Models\Module;
use App\Modules\ArchitectCore\Services\GeneratorService;
use App\Modules\ArchitectCore\Services\SchemaValidator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->where('owner_id', auth()->id())
            ->with(['modules' => function ($q) {
                $q->latest();
            }])
            ->latest()
            ->get();

        return Inertia::render('Architect/Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function store(Request $request, GeneratorService $generator)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('projects')->where(function ($query) {
                    return $query->where('owner_id', auth()->id());
                }),
            ],
            'description' => 'nullable|string|max:1000',
            'repository_url' => 'nullable|url',
            'modules' => 'nullable|array',
            'modules.*.name' => 'required_with:modules|string',
            'modules.*.table_name' => 'required_with:modules|string',
            'modules.*.attributes' => 'required_with:modules|array',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'repository_url' => $validated['repository_url'] ?? null,
            'owner_id' => auth()->id(),
            'settings' => [
                'description' => $validated['description'] ?? null,
                'stack' => 'laravel-react',
                'theme' => 'architect',
            ]
        ]);

        // If modules are provided via synthesis or manual form, provision them immediately
        if (!empty($validated['modules'])) {
            foreach ($validated['modules'] as $modData) {
                $modName = SchemaValidator::sanitizeModuleName($modData['name'] ?? 'CustomModule');
                $tableName = SchemaValidator::sanitizeTableName($modData['table_name'] ?? '', $modName);
                $attributes = SchemaValidator::sanitizeAttributes($modData['attributes'] ?? []);

                // Skip if protected system table
                if (SchemaValidator::isProtectedTable($tableName)) {
                    continue;
                }

                $module = $project->modules()->create([
                    'name' => $modName,
                    'table_name' => $tableName,
                    'attributes' => $attributes,
                    'relations' => [],
                    'status' => 'draft'
                ]);

                try {
                    $generator->generate($module);
                    $module->update(['status' => 'generated']);
                } catch (\Throwable $e) {
                    // Fallback: Ensure table is created for instant dynamic preview
                    if (!SchemaValidator::isProtectedTable($tableName) && !\Illuminate\Support\Facades\Schema::hasTable($tableName)) {
                        \Illuminate\Support\Facades\Schema::create($tableName, function ($table) use ($module) {
                            $table->uuid('id')->primary();
                            $table->uuid('project_id')->nullable()->index();
                            foreach ($module->attributes as $attr) {
                                $type = $attr['type'] ?? 'string';
                                $name = $attr['name'] ?? 'title';
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
            }
        }

        return redirect()->route('architect.projects.index')->with('success', 'Project created successfully.');
    }

    public function destroy(Project $project, GeneratorService $generator)
    {
        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        foreach ($project->modules as $module) {
            try {
                $generator->destroy($module);
            } catch (\Throwable $e) {
                if (!SchemaValidator::isProtectedTable($module->table_name)) {
                    \Illuminate\Support\Facades\Schema::dropIfExists($module->table_name);
                }
            }
            $module->delete();
        }

        $project->delete();

        return redirect()->back()->with('success', 'Project deleted successfully.');
    }

    public function export(Project $project, \App\Modules\ArchitectCore\Services\ProjectExportService $exporter)
    {
        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        try {
            $zipPath = $exporter->export($project);
            return response()->download($zipPath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Export failed: ' . $e->getMessage()]);
        }
    }
}
