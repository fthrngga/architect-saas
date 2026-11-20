<?php

namespace App\Modules\ArchitectCore\Services;

use App\Modules\ArchitectCore\Models\Module;
use App\Modules\ArchitectCore\Models\Project;
use App\Modules\CodeFactory\Services\DependencyInjectorService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class RelationService
{
    protected DependencyInjectorService $injector;

    public function __construct(DependencyInjectorService $injector)
    {
        $this->injector = $injector;
    }

    /**
     * Create an Eloquent relationship & DB foreign key between two modules.
     */
    public function createRelation(
        Project $project,
        Module $fromModule,
        Module $toModule,
        string $type = 'belongsTo',
        ?string $foreignKey = null,
        ?string $displayColumn = null
    ): array {
        // Enforce project scoping
        if ($fromModule->project_id !== $project->id || $toModule->project_id !== $project->id) {
            throw new \InvalidArgumentException('Both modules must belong to the specified project.');
        }

        // Prevent self-relation loop
        if ($fromModule->id === $toModule->id) {
            throw new \InvalidArgumentException('A module cannot create a relationship to itself.');
        }

        $rawFk = $foreignKey ?: (Str::singular($toModule->name) . '_id');
        $foreignKey = Str::snake(preg_replace('/[^a-zA-Z0-9_]/', '', $rawFk));
        if (empty($foreignKey) || is_numeric($foreignKey[0])) {
            $foreignKey = 'rel_' . ($foreignKey ?: 'parent_id');
        }
        $foreignKey = substr($foreignKey, 0, 64);

        if (in_array($foreignKey, SchemaValidator::MANAGED_COLUMNS)) {
            throw new \InvalidArgumentException("Foreign key cannot use reserved managed column name: {$foreignKey}");
        }

        $rawDisplay = $displayColumn ?: 'name';
        $displayColumn = Str::snake(preg_replace('/[^a-zA-Z0-9_]/', '', $rawDisplay));
        if (empty($displayColumn)) {
            $displayColumn = 'name';
        }
        $displayColumn = substr($displayColumn, 0, 64);

        $relationId = (string) Str::uuid();

        // 1. Ensure foreign key column exists in database table
        if (!Schema::hasColumn($fromModule->table_name, $foreignKey)) {
            Schema::table($fromModule->table_name, function (Blueprint $table) use ($foreignKey) {
                $table->uuid($foreignKey)->nullable()->index();
            });
        }

        // 2. Add attribute descriptor to fromModule if not present
        $attrs = $fromModule->attributes ?? [];
        $hasAttr = collect($attrs)->contains('name', $foreignKey);
        if (!$hasAttr) {
            $attrs[] = [
                'name' => $foreignKey,
                'type' => 'relation',
                'nullable' => true,
                'target_module' => $toModule->name,
                'target_table' => $toModule->table_name,
                'display_column' => $displayColumn,
            ];
            $fromModule->attributes = $attrs;
        }

        // 3. Register relation metadata on fromModule (belongsTo)
        $fromRelations = $fromModule->relations ?? [];
        // Prevent duplicate relation
        $fromRelations = collect($fromRelations)->reject(function ($r) use ($toModule, $foreignKey) {
            return ($r['target_module_id'] ?? null) === $toModule->id && ($r['foreign_key'] ?? null) === $foreignKey;
        })->values()->all();

        $fromRelations[] = [
            'id' => $relationId,
            'type' => 'belongsTo',
            'target_module_id' => $toModule->id,
            'target_module_name' => $toModule->name,
            'target_table' => $toModule->table_name,
            'foreign_key' => $foreignKey,
            'display_column' => $displayColumn,
            'created_at' => now()->toIso8601String(),
        ];
        $fromModule->relations = $fromRelations;
        $fromModule->save();

        // 4. Register inverse relation metadata on toModule (hasMany)
        $toRelations = $toModule->relations ?? [];
        $toRelations = collect($toRelations)->reject(function ($r) use ($fromModule, $foreignKey) {
            return ($r['target_module_id'] ?? null) === $fromModule->id && ($r['foreign_key'] ?? null) === $foreignKey;
        })->values()->all();

        $toRelations[] = [
            'id' => $relationId,
            'type' => 'hasMany',
            'target_module_id' => $fromModule->id,
            'target_module_name' => $fromModule->name,
            'target_table' => $fromModule->table_name,
            'foreign_key' => $foreignKey,
            'created_at' => now()->toIso8601String(),
        ];
        $toModule->relations = $toRelations;
        $toModule->save();

        // 5. Code Injection: Inject Eloquent relations into PHP model files if present
        $this->injectRelationMethods($fromModule, $toModule, $foreignKey);

        return [
            'relation_id' => $relationId,
            'foreign_key' => $foreignKey,
            'from' => $fromModule->name,
            'to' => $toModule->name,
        ];
    }

    /**
     * Remove a relation by ID from all modules in the project.
     */
    public function destroyRelation(Project $project, string $relationId): bool
    {
        $modules = $project->modules;
        foreach ($modules as $module) {
            $rels = $module->relations ?? [];
            $filtered = collect($rels)->reject(fn($r) => ($r['id'] ?? '') === $relationId)->values()->all();
            if (count($rels) !== count($filtered)) {
                $module->relations = $filtered;
                $module->save();
            }
        }
        return true;
    }

    /**
     * Inject Eloquent methods into Model files using DependencyInjectorService.
     */
    protected function injectRelationMethods(Module $fromModule, Module $toModule, string $foreignKey): void
    {
        try {
            // A. Inject belongsTo into fromModule Model
            $fromModelPath = app_path("Modules/{$fromModule->name}/Models/{$fromModule->name}.php");
            if (File::exists($fromModelPath) && File::isWritable($fromModelPath)) {
                $methodName = Str::camel(Str::singular($toModule->name));
                $methodCode = <<<PHP

    /**
     * Get the associated {$toModule->name} model.
     */
    public function {$methodName}()
    {
        return \$this->belongsTo(\\App\\Modules\\{$toModule->name}\\Models\\{$toModule->name}::class, '{$foreignKey}');
    }
PHP;
                $content = File::get($fromModelPath);
                if (!str_contains($content, "function {$methodName}(")) {
                    $this->injector->injectMethod($fromModelPath, $methodCode);
                }
            }

            // B. Inject hasMany into toModule Model
            $toModelPath = app_path("Modules/{$toModule->name}/Models/{$toModule->name}.php");
            if (File::exists($toModelPath) && File::isWritable($toModelPath)) {
                $inverseMethodName = Str::camel(Str::plural($fromModule->name));
                $inverseMethodCode = <<<PHP

    /**
     * Get all {$fromModule->name} records for this {$toModule->name}.
     */
    public function {$inverseMethodName}()
    {
        return \$this->hasMany(\\App\\Modules\\{$fromModule->name}\\Models\\{$fromModule->name}::class, '{$foreignKey}');
    }
PHP;
                $toContent = File::get($toModelPath);
                if (!str_contains($toContent, "function {$inverseMethodName}(")) {
                    $this->injector->injectMethod($toModelPath, $inverseMethodCode);
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Relation AST injection skipped: ' . $e->getMessage());
        }
    }
}
