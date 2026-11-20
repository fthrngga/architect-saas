<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Project;
use App\Modules\ArchitectCore\Services\SchemaValidator;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProjectAppController extends Controller
{
    public function dashboard($handle, $project_slug)
    {
        $user = User::where('handle', $handle)->firstOrFail();

        $project = Project::where('owner_id', $user->id)
            ->where('slug', $project_slug)
            ->with([
                'modules',
                'owner'
            ])
            ->firstOrFail();

        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Apps/Dashboard', [
            'project' => $project,
            'modules' => $project->modules
        ]);
    }

    public function moduleBuilder($handle, $project_slug)
    {
        $user = User::where('handle', $handle)->firstOrFail();
        $project = Project::where('owner_id', $user->id)
            ->where('slug', $project_slug)
            ->with(['modules', 'owner'])
            ->firstOrFail();

        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Apps/Builder/Modules/Index', [
            'project' => $project,
            'modules' => $project->modules()->latest()->get()
        ]);
    }

    public function storeModule(Request $request, $handle, $project_slug, \App\Modules\ArchitectCore\Services\GeneratorService $generator)
    {
        $user = User::where('handle', $handle)->firstOrFail();
        $project = Project::where('owner_id', $user->id)
            ->where('slug', $project_slug)
            ->firstOrFail();

        if ($project->owner_id !== auth()->id()) {
            abort(403);
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
            return back()->withErrors(['table_name' => 'Nama tabel ini dilindungi oleh sistem inti.']);
        }

        $module = $project->modules()->create([
            'name' => $name,
            'table_name' => $tableName,
            'attributes' => $attributes,
            'relations' => [],
            'status' => 'draft'
        ]);

        try {
            $generator->generate($module);
            $module->update(['status' => 'generated']);
        } catch (\Exception $e) {
            // Even if file generation fails due to file permissions, we still ensure the database table is created
            if (!SchemaValidator::isProtectedTable($module->table_name) && !Schema::hasTable($module->table_name)) {
                Schema::create($module->table_name, function ($table) use ($module) {
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
                        if (!empty($attr['nullable']) && $type !== 'relation') {
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

    public function destroyModule(Request $request, $handle, $project_slug, \App\Modules\ArchitectCore\Models\Module $module, \App\Modules\ArchitectCore\Services\GeneratorService $generator)
    {
        $user = User::where('handle', $handle)->firstOrFail();
        $project = Project::where('owner_id', $user->id)
            ->where('slug', $project_slug)
            ->firstOrFail();

        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        if ($module->project_id !== $project->id) {
            abort(403, 'Unauthorized module deletion');
        }

        if (SchemaValidator::isProtectedTable($module->table_name)) {
            return back()->withErrors(['message' => 'Modul tabel sistem inti dilindungi dan tidak dapat dihapus.']);
        }

        try {
            $generator->destroy($module);
            $module->delete();
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Deletion failed: ' . $e->getMessage()]);
        }

        return redirect()->back();
    }

    public function handleModuleRequest(Request $request, $handle, $project_slug, $module_name, $id = null)
    {
        $user = User::where('handle', $handle)->firstOrFail();
        $project = Project::where('owner_id', $user->id)->where('slug', $project_slug)->firstOrFail();

        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        $module = $project->modules()->where('table_name', $module_name)->firstOrFail();
        $allModules = $project->modules()->get();

        // Share project context with Inertia
        Inertia::share('project', $project->load('owner'));
        Inertia::share('modules', $allModules);

        // Ensure table exists
        if (!Schema::hasTable($module->table_name)) {
            Schema::create($module->table_name, function ($table) use ($module) {
                $table->uuid('id')->primary();
                $table->uuid('project_id')->nullable()->index();
                foreach ($module->attributes as $attr) {
                    $type = $attr['type'];
                    $name = $attr['name'];
                    $col = match ($type) {
                        'integer' => $table->integer($name),
                        'float' => $table->float($name),
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

        $routeName = $request->route() ? $request->route()->getName() : null;
        $verb = $request->method();
        $relationLookups = $this->getRelationLookups($project, $module);

        // 1. Create Form View
        if ($routeName === 'app.module.create') {
            return Inertia::render('Apps/Dynamic/Form', [
                'project' => $project,
                'module' => $module,
                'item' => null,
                'modules' => $allModules,
                'relationLookups' => $relationLookups,
            ]);
        }

        // 2. Edit Form View
        if ($routeName === 'app.module.edit') {
            $query = DB::table($module->table_name)->where('id', $id);
            if (Schema::hasColumn($module->table_name, 'project_id')) {
                $query->where('project_id', $project->id);
            }
            $item = $query->first();
            if (!$item) {
                abort(404, 'Record not found');
            }
            return Inertia::render('Apps/Dynamic/Form', [
                'project' => $project,
                'module' => $module,
                'item' => $item,
                'modules' => $allModules,
                'relationLookups' => $relationLookups,
            ]);
        }

        // 3. Store Action (POST)
        if ($verb === 'POST') {
            if (SchemaValidator::isProtectedTable($module->table_name)) {
                abort(403, 'Aksi tidak diizinkan pada tabel sistem.');
            }

            $rules = $this->buildValidationRules($module);
            $validated = $request->validate($rules);

            $data = $validated;
            // Always generate a fresh UUID for Primary Key, ignoring any spoofed client ID
            $data['id'] = (string) Str::uuid();
            if (Schema::hasColumn($module->table_name, 'project_id')) {
                $data['project_id'] = $project->id;
            }
            if (Schema::hasColumn($module->table_name, 'created_at')) {
                $data['created_at'] = now();
                $data['updated_at'] = now();
            }

            DB::table($module->table_name)->insert($data);

            return redirect()->route('app.module.index', [
                'handle' => $handle,
                'project_slug' => $project_slug,
                'module_name' => $module_name,
            ]);
        }

        // 4. Update Action (PUT/PATCH)
        if ($verb === 'PUT' || $verb === 'PATCH') {
            if (SchemaValidator::isProtectedTable($module->table_name)) {
                abort(403, 'Aksi tidak diizinkan pada tabel sistem.');
            }

            $isPartial = ($verb === 'PATCH');
            $rules = $this->buildValidationRules($module, $isPartial);
            $validated = $request->validate($rules);

            // Strip primary key and tenant scoping key to prevent tenant spoofing or hijacking
            unset($validated['id'], $validated['project_id']);

            $query = DB::table($module->table_name)->where('id', $id);
            if (Schema::hasColumn($module->table_name, 'project_id')) {
                $query->where('project_id', $project->id);
            }

            if (Schema::hasColumn($module->table_name, 'updated_at')) {
                $validated['updated_at'] = now();
            }

            $query->update($validated);

            if ($verb === 'PATCH') {
                return redirect()->back();
            }

            return redirect()->route('app.module.index', [
                'handle' => $handle,
                'project_slug' => $project_slug,
                'module_name' => $module_name,
            ]);
        }

        // 5. Delete Action (DELETE)
        if ($verb === 'DELETE') {
            if (SchemaValidator::isProtectedTable($module->table_name)) {
                abort(403, 'Aksi tidak diizinkan pada tabel sistem.');
            }

            $query = DB::table($module->table_name)->where('id', $id);
            if (Schema::hasColumn($module->table_name, 'project_id')) {
                $query->where('project_id', $project->id);
            }

            if (Schema::hasColumn($module->table_name, 'deleted_at')) {
                $query->update(['deleted_at' => now()]);
            } else {
                $query->delete();
            }

            return redirect()->back();
        }

        // 6. Index Table View (GET)
        $query = DB::table($module->table_name);
        if (Schema::hasColumn($module->table_name, 'project_id')) {
            $query->where('project_id', $project->id);
        }
        if (Schema::hasColumn($module->table_name, 'deleted_at')) {
            $query->whereNull('deleted_at');
        }
        if (Schema::hasColumn($module->table_name, 'created_at')) {
            $query->orderBy('created_at', 'desc');
        }

        $items = $query->paginate(10);

        return Inertia::render('Apps/Dynamic/Index', [
            'project' => $project,
            'module' => $module,
            'items' => $items,
            'modules' => $allModules,
            'relationLookups' => $relationLookups,
        ]);
    }

    protected function getRelationLookups($project, $module)
    {
        $relationLookups = [];
        if (!empty($module->relations)) {
            foreach ($module->relations as $rel) {
                if (($rel['type'] ?? '') === 'belongsTo') {
                    $targetTable = $rel['target_table'] ?? '';
                    $fk = $rel['foreign_key'] ?? '';
                    $displayCol = $rel['display_column'] ?? 'name';
                    if ($targetTable && Schema::hasTable($targetTable)) {
                        $cols = Schema::getColumnListing($targetTable);
                        $candidateCols = [$displayCol, 'name', 'full_name', 'patient_name', 'doctor_name', 'title', 'code', 'id'];
                        $chosenCol = 'id';
                        foreach ($candidateCols as $c) {
                            if (in_array($c, $cols)) {
                                $chosenCol = $c;
                                break;
                            }
                        }

                        $query = DB::table($targetTable);
                        if (in_array('project_id', $cols)) {
                            $query->where('project_id', $project->id);
                        }
                        if (in_array('deleted_at', $cols)) {
                            $query->whereNull('deleted_at');
                        }
                        $records = $query->limit(100)->get(['id', $chosenCol]);
                        $relationLookups[$fk] = [
                            'target_module' => $rel['target_module_name'] ?? $targetTable,
                            'target_table' => $targetTable,
                            'options' => $records->map(function ($r) use ($chosenCol) {
                                return [
                                    'id' => $r->id,
                                    'label' => (string) ($r->{$chosenCol} ?? $r->id),
                                ];
                            })->all()
                        ];
                    }
                }
            }
        }
        return $relationLookups;
    }

    protected function buildValidationRules($module, bool $isPartial = false)
    {
        $rules = [];
        foreach ($module->attributes as $attr) {
            $fieldRules = [];
            if ($isPartial) {
                $fieldRules[] = 'sometimes';
            }
            if (empty($attr['nullable']) && $attr['type'] !== 'relation') {
                if (!$isPartial) {
                    $fieldRules[] = 'required';
                }
            } else {
                $fieldRules[] = 'nullable';
            }

            match ($attr['type']) {
                'integer' => array_push($fieldRules, 'integer', 'between:-2147483648,2147483647'),
                'float', 'currency' => array_push($fieldRules, 'numeric', 'between:-999999999999.99,999999999999.99'),
                'boolean' => array_push($fieldRules, 'boolean'),
                'date' => array_push($fieldRules, 'date'),
                'text' => array_push($fieldRules, 'string', 'max:65535'),
                'relation' => array_push($fieldRules, 'string', 'max:36'),
                default => array_push($fieldRules, 'string', 'max:255'),
            };

            $rules[$attr['name']] = implode('|', $fieldRules);
        }
        return $rules;
    }
}

