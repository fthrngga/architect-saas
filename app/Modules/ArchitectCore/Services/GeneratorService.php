<?php

namespace App\Modules\ArchitectCore\Services;

use App\Modules\ArchitectCore\Models\Module;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Artisan;

class GeneratorService
{
    protected $frontendGenerator;

    public function __construct(FrontendGenerator $frontendGenerator)
    {
        $this->frontendGenerator = $frontendGenerator;
    }

    public function generate(Module $module)
    {
        // Enforce StudlyCase for directory structure and namespaces
        $module->name = Str::studly($module->name);

        $this->generateModuleStructure($module);
        $this->generateModel($module);
        $this->generateMigration($module);
        $this->generateController($module);
        $this->generateRequest($module);
        $this->generateResource($module);
        $this->generateRoutes($module);

        // Generate Frontend
        $this->frontendGenerator->generate($module);

        $module->update(['status' => 'generated']);

        // Run migration
        $migrationPath = "app/Modules/{$module->name}/Database/Migrations";
        Artisan::call('migrate', [
            '--path' => $migrationPath,
            '--force' => true
        ]);
    }

    public function destroy(Module $module)
    {
        // 1. Drop the table if it exists
        \Illuminate\Support\Facades\Schema::dropIfExists($module->table_name);

        // 2. Delete the module directory
        $modulePath = app_path("Modules/{$module->name}");
        if (File::exists($modulePath)) {
            File::deleteDirectory($modulePath);
        }

        // 3. Delete frontend files
        $projectSlug = $module->project->slug;
        $frontendPath = resource_path("js/Pages/Apps/{$projectSlug}/{$module->name}");
        if (File::exists($frontendPath)) {
            File::deleteDirectory($frontendPath);
        }
    }

    protected function generateModuleStructure(Module $module)
    {
        $paths = [
            app_path("Modules/{$module->name}/Models"),
            app_path("Modules/{$module->name}/Http/Controllers"),
            app_path("Modules/{$module->name}/Http/Requests"),
            app_path("Modules/{$module->name}/Http/Resources"),
            app_path("Modules/{$module->name}/Routes"),
            app_path("Modules/{$module->name}/Database/Migrations"),
        ];

        foreach ($paths as $path) {
            if (!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }
        }
    }

    protected function generateModel(Module $module)
    {
        $stub = File::get(resource_path('stubs/architect/model.stub'));

        $imports = [
            'use Illuminate\Database\Eloquent\SoftDeletes;',
            'use Illuminate\Database\Eloquent\Concerns\HasUuids;'
        ];
        $traits = ', SoftDeletes, HasUuids';

        $content = str_replace(
            ['{{ namespace }}', '{{ class }}', '{{ imports }}', '{{ traits }}', '{{ relations }}', '{{ table }}'],
            [
                "App\\Modules\\{$module->name}\\Models",
                $module->name,
                implode("\n", $imports),
                $traits,
                '', // No relations yet
                $module->table_name
            ],
            $stub
        );

        File::put(app_path("Modules/{$module->name}/Models/{$module->name}.php"), $content);
    }

    protected function generateController(Module $module)
    {
        // Use Inertia Controller Stub
        $stub = File::get(resource_path('stubs/architect/inertia_controller.stub'));
        $name = $module->name;
        $projectSlug = $module->project->slug;

        $content = str_replace(
            [
                '{{ namespace }}',
                '{{ class }}',
                '{{ modelNamespace }}',
                '{{ requestNamespace }}',
                '{{ resourceNamespace }}',
                '{{ model }}',
                '{{ resource }}',
                '{{ request }}',
                '{{ modelVariable }}',
                '{{ viewPath }}',
                '{{ table }}'
            ],
            [
                "App\\Modules\\{$name}\\Http\\Controllers",
                "{$name}Controller",
                "App\\Modules\\{$name}\\Models\\{$name}",
                "App\\Modules\\{$name}\\Http\\Requests\\Store{$name}Request",
                "App\\Modules\\{$name}\\Http\\Resources\\{$name}Resource",
                $name,
                "{$name}Resource",
                "Store{$name}Request",
                Str::camel($name),
                $name,
                $module->table_name
            ],
            $stub
        );

        File::put(app_path("Modules/{$module->name}/Http/Controllers/{$module->name}Controller.php"), $content);
    }

    // ... rest of the file (migration, request, resource, etc.)

    protected function generateMigration(Module $module)
    {
        $stub = File::get(resource_path('stubs/architect/migration.stub'));
        $tableName = $module->table_name;

        $columns = "";
        foreach ($module->attributes as $attr) {
            $type = $attr['type'];
            $name = $attr['name'];
            $nullable = isset($attr['nullable']) && $attr['nullable'] ? '->nullable()' : '';
            $columns .= "\$table->{$type}('{$name}'){$nullable};\n            ";
        }

        $softDeletes = '$table->softDeletes();';

        $content = str_replace(
            ['{{ table }}', '{{ columns }}', '{{ softDeletes }}'],
            [$tableName, $columns, $softDeletes],
            $stub
        );

        $filename = date('Y_m_d_His') . "_create_{$tableName}_table.php";
        File::put(app_path("Modules/{$module->name}/Database/Migrations/{$filename}"), $content);
    }

    protected function generateRequest(Module $module)
    {
        $rules = [];
        foreach ($module->attributes as $attr) {
            $name = $attr['name'];
            $type = $attr['type'];
            $isNullable = isset($attr['nullable']) && $attr['nullable'];

            $fieldRules = [];
            if (!$isNullable) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            switch ($type) {
                case 'integer':
                case 'bigInteger':
                    $fieldRules[] = 'integer';
                    break;
                case 'decimal':
                case 'float':
                case 'double':
                    $fieldRules[] = 'numeric';
                    break;
                case 'boolean':
                    $fieldRules[] = 'boolean';
                    break;
                case 'date':
                case 'datetime':
                    $fieldRules[] = 'date';
                    break;
                case 'string':
                default:
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:255';
                    break;
            }

            $rules[] = "'{$name}' => '" . implode('|', $fieldRules) . "'";
        }

        $rulesString = implode(",\n            ", $rules);

        $content = "<?php

namespace App\Modules\\{$module->name}\\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Store{$module->name}Request extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            {$rulesString}
        ];
    }
}";
        File::put(app_path("Modules/{$module->name}/Http/Requests/Store{$module->name}Request.php"), $content);
    }

    protected function generateResource(Module $module)
    {
        $fields = [];
        foreach ($module->attributes as $attr) {
            $name = $attr['name'];
            $fields[] = "'{$name}' => \$this->{$name}";
        }
        $fields[] = "'id' => \$this->id";
        $fields[] = "'created_at' => \$this->created_at";

        $fieldsString = implode(",\n            ", $fields);

        $content = "<?php

namespace App\Modules\\{$module->name}\\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class {$module->name}Resource extends JsonResource
{
    public function toArray(\$request)
    {
        return [
            {$fieldsString}
        ];
    }
}";
        File::put(app_path("Modules/{$module->name}/Http/Resources/{$module->name}Resource.php"), $content);
    }

    protected function generateRoutes(Module $module)
    {
        $name = $module->name;
        $controller = "{$name}Controller";
        $variable = Str::camel($name);

        $content = "<?php
use Illuminate\Support\Facades\Route;
use App\Modules\\{$name}\\Http\Controllers\\{$controller};

Route::apiResource('{$variable}s', {$controller}::class);
";
        File::put(app_path("Modules/{$module->name}/Routes/api.php"), $content);
    }
    protected function getFillable(Module $module)
    {
        $fillables = array_map(fn($attr) => "'{$attr['name']}'", $module->attributes ?? []);
        return implode(', ', $fillables);
    }
}
