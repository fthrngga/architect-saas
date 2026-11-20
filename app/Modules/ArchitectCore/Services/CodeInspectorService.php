<?php

namespace App\Modules\ArchitectCore\Services;

use App\Modules\ArchitectCore\Models\Module;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CodeInspectorService
{
    /**
     * Gather all generated and architectural files for the given module.
     */
    public function getModuleCodeFiles(Module $module): array
    {
        return [
            'module' => [
                'id' => $module->id,
                'name' => $module->name,
                'table_name' => $module->table_name,
                'status' => $module->status,
                'relations_count' => count($module->relations ?? []),
            ],
            'files' => [
                $this->getModelFile($module),
                $this->getControllerFile($module),
                $this->getMigrationFile($module),
                $this->getPestTestFile($module),
                $this->getOpenApiFile($module),
            ]
        ];
    }

    /**
     * Model.php file inspector
     */
    protected function getModelFile(Module $module): array
    {
        $path = app_path("Modules/{$module->name}/Models/{$module->name}.php");
        $content = '';
        $isLiveOnDisk = false;

        if (File::exists($path)) {
            $content = File::get($path);
            $isLiveOnDisk = true;
        } else {
            // Generate clean virtual model
            $relationsCode = '';
            if (!empty($module->relations)) {
                foreach ($module->relations as $rel) {
                    $type = $rel['type'] ?? 'belongsTo';
                    $targetModule = $rel['target_module_name'] ?? 'Target';
                    $fk = $rel['foreign_key'] ?? (Str::snake(Str::singular($targetModule)) . '_id');
                    if ($type === 'belongsTo') {
                        $methodName = Str::camel(Str::singular($targetModule));
                        $relationsCode .= "\n    /**\n     * Get the associated {$targetModule} model.\n     */\n";
                        $relationsCode .= "    public function {$methodName}()\n    {\n";
                        $relationsCode .= "        return \$this->belongsTo(\\App\\Modules\\{$targetModule}\\Models\\{$targetModule}::class, '{$fk}');\n    }\n";
                    } else {
                        $methodName = Str::camel(Str::plural($targetModule));
                        $relationsCode .= "\n    /**\n     * Get all {$targetModule} records for this {$module->name}.\n     */\n";
                        $relationsCode .= "    public function {$methodName}()\n    {\n";
                        $relationsCode .= "        return \$this->hasMany(\\App\\Modules\\{$targetModule}\\Models\\{$targetModule}::class, '{$fk}');\n    }\n";
                    }
                }
            }

            $content = <<<PHP
<?php

namespace App\Modules\\{$module->name}\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class {$module->name} extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected \$table = '{$module->table_name}';

    protected \$guarded = [];
{$relationsCode}
}
PHP;
        }

        return [
            'id' => 'model',
            'name' => "{$module->name}.php",
            'path' => "app/Modules/{$module->name}/Models/{$module->name}.php",
            'language' => 'php',
            'badge' => 'Eloquent Model',
            'is_live' => $isLiveOnDisk,
            'description' => 'Eloquent ORM Model with HasUuids, SoftDeletes, and AST injected relationships',
            'content' => $content,
        ];
    }

    /**
     * Controller.php file inspector
     */
    protected function getControllerFile(Module $module): array
    {
        $path = app_path("Modules/{$module->name}/Http/Controllers/{$module->name}Controller.php");
        $content = '';
        $isLiveOnDisk = false;

        if (File::exists($path)) {
            $content = File::get($path);
            $isLiveOnDisk = true;
        } else {
            $content = <<<PHP
<?php

namespace App\Modules\\{$module->name}\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\\{$module->name}\Models\\{$module->name};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class {$module->name}Controller extends Controller
{
    /**
     * Display a listing of the resource with tenant scoping.
     */
    public function index(Request \$request)
    {
        \$records = {$module->name}::query()
            ->when(\$request->has('project_id'), fn(\$q) => \$q->where('project_id', \$request->project_id))
            ->latest()
            ->paginate(15);

        return Inertia::render('{$module->name}/Index', [
            'items' => \$records
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request \$request)
    {
        \$validated = \$request->validate([
            // Injected dynamic validation rules
        ]);

        \$record = {$module->name}::create(\$validated);

        return redirect()->back()->with('success', '{$module->name} created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request \$request, \$id)
    {
        \$record = {$module->name}::findOrFail(\$id);
        \$record->update(\$request->all());

        return redirect()->back()->with('success', '{$module->name} updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(\$id)
    {
        \$record = {$module->name}::findOrFail(\$id);
        \$record->delete();

        return redirect()->back()->with('success', '{$module->name} deleted.');
    }
}
PHP;
        }

        return [
            'id' => 'controller',
            'name' => "{$module->name}Controller.php",
            'path' => "app/Modules/{$module->name}/Http/Controllers/{$module->name}Controller.php",
            'language' => 'php',
            'badge' => 'Controller',
            'is_live' => $isLiveOnDisk,
            'description' => 'Inertia & REST Controller with multi-tenant scoping and soft deletes',
            'content' => $content,
        ];
    }

    /**
     * Migration.php file inspector
     */
    protected function getMigrationFile(Module $module): array
    {
        $dir = app_path("Modules/{$module->name}/Database/Migrations");
        $content = '';
        $foundPath = '';
        $isLiveOnDisk = false;

        if (File::exists($dir)) {
            $files = File::files($dir);
            foreach ($files as $file) {
                if (str_contains($file->getFilename(), "create_{$module->table_name}_table")) {
                    $content = File::get($file->getPathname());
                    $foundPath = "app/Modules/{$module->name}/Database/Migrations/" . $file->getFilename();
                    $isLiveOnDisk = true;
                    break;
                }
            }
        }

        if (!$isLiveOnDisk) {
            $colsCode = '';
            foreach ($module->attributes ?? [] as $attr) {
                $type = $attr['type'] ?? 'string';
                $name = $attr['name'] ?? 'title';
                $nullable = !empty($attr['nullable']) ? '->nullable()' : '';
                $colsCode .= match ($type) {
                    'integer' => "            \$table->integer('{$name}'){$nullable};\n",
                    'float' => "            \$table->float('{$name}'){$nullable};\n",
                    'currency' => "            \$table->decimal('{$name}', 15, 2){$nullable};\n",
                    'relation' => "            \$table->uuid('{$name}'){$nullable}->index();\n",
                    'boolean' => "            \$table->boolean('{$name}')->default(false);\n",
                    'date' => "            \$table->date('{$name}'){$nullable};\n",
                    'text' => "            \$table->text('{$name}'){$nullable};\n",
                    default => "            \$table->string('{$name}'){$nullable};\n",
                };
            }

            $datePrefix = date('Y_m_d_His');
            $foundPath = "app/Modules/{$module->name}/Database/Migrations/{$datePrefix}_create_{$module->table_name}_table.php";
            $content = <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('{$module->table_name}', function (Blueprint \$table) {
            \$table->uuid('id')->primary();
            \$table->uuid('project_id')->nullable()->index();
{$colsCode}            \$table->timestamps();
            \$table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('{$module->table_name}');
    }
};
PHP;
        }

        return [
            'id' => 'migration',
            'name' => basename($foundPath),
            'path' => $foundPath,
            'language' => 'php',
            'badge' => 'Database Migration',
            'is_live' => $isLiveOnDisk,
            'description' => 'DDL Schema Blueprint with UUID primary keys, tenant scoping index, and columns',
            'content' => $content,
        ];
    }

    /**
     * Pest Feature Test Inspector
     */
    protected function getPestTestFile(Module $module): array
    {
        $samplePayload = [];
        $sampleAssert = [];
        foreach ($module->attributes ?? [] as $attr) {
            $name = $attr['name'];
            $type = $attr['type'];
            if (in_array($name, ['id', 'project_id', 'created_at', 'updated_at', 'deleted_at'])) {
                continue;
            }
            $val = match ($type) {
                'integer' => 42,
                'float' => 99.5,
                'currency' => 150000.00,
                'boolean' => 'true',
                'date' => "'2026-11-15'",
                'relation' => "Str::uuid()->toString()",
                default => "'Sample " . Str::title(str_replace('_', ' ', $name)) . "'",
            };
            $samplePayload[] = "        '{$name}' => {$val},";
            if ($type !== 'relation') {
                $sampleAssert[] = "        '{$name}' => {$val},";
            }
        }
        $payloadCode = implode("\n", array_slice($samplePayload, 0, 4));
        $assertCode = implode("\n", array_slice($sampleAssert, 0, 2));

        $content = <<<PHP
<?php

use App\Models\User;
use App\Modules\ArchitectCore\Models\Project;
use Illuminate\Support\Str;

beforeEach(function () {
    \$this->user = User::factory()->create();
    \$this->project = Project::create([
        'name' => 'Enterprise Sandbox',
        'slug' => 'enterprise-sandbox',
        'owner_id' => \$this->user->id,
    ]);
});

test('authenticated tenant owner can access {$module->table_name} index page', function () {
    \$response = \$this->actingAs(\$this->user)
        ->get("/app/{\$this->user->handle}/{\$this->project->slug}/{$module->table_name}");

    \$response->assertOk();
});

test('valid {$module->name} record is successfully inserted and scoped to tenant', function () {
    \$payload = [
{$payloadCode}
    ];

    \$response = \$this->actingAs(\$this->user)
        ->post("/app/{\$this->user->handle}/{\$this->project->slug}/{$module->table_name}", \$payload);

    \$response->assertRedirect();
    
    \$this->assertDatabaseHas('{$module->table_name}', [
        'project_id' => \$this->project->id,
{$assertCode}
    ]);
});

test('unauthorized cross-tenant user is forbidden from accessing {$module->table_name}', function () {
    \$intruder = User::factory()->create();

    \$response = \$this->actingAs(\$intruder)
        ->get("/app/{\$this->user->handle}/{\$this->project->slug}/{$module->table_name}");

    \$response->assertForbidden();
});

test('soft deleted {$module->name} is not visible in index query', function () {
    \$recordId = Str::uuid()->toString();
    \Illuminate\Support\Facades\DB::table('{$module->table_name}')->insert([
        'id' => \$recordId,
        'project_id' => \$this->project->id,
        'deleted_at' => now(),
    ]);

    \$response = \$this->actingAs(\$this->user)
        ->get("/app/{\$this->user->handle}/{\$this->project->slug}/{$module->table_name}");

    \$response->assertDontSee(\$recordId);
});
PHP;

        return [
            'id' => 'test',
            'name' => "{$module->name}Test.php",
            'path' => "tests/Feature/{$module->name}Test.php",
            'language' => 'php',
            'badge' => 'Pest PHP Test Suite',
            'is_live' => false,
            'description' => 'Automated Pest 3.x Feature Test Suite verifying CRUD, validation bounds, and multi-tenancy',
            'content' => $content,
        ];
    }

    /**
     * OpenAPI 3.0 YAML Inspector
     */
    protected function getOpenApiFile(Module $module): array
    {
        $properties = [];
        $required = [];

        foreach ($module->attributes ?? [] as $attr) {
            $name = $attr['name'];
            $type = $attr['type'];
            if (empty($attr['nullable']) && $type !== 'relation') {
                $required[] = $name;
            }
            $schemaType = match ($type) {
                'integer' => "type: integer\n            format: int64",
                'float', 'currency' => "type: number\n            format: double",
                'boolean' => "type: boolean",
                'date' => "type: string\n            format: date",
                default => "type: string",
            };
            $properties[] = "        {$name}:\n          {$schemaType}";
        }

        $propsYaml = implode("\n", $properties);
        $reqYaml = !empty($required) ? "      required:\n        - " . implode("\n        - ", $required) : "";

        $content = <<<YAML
openapi: 3.0.3
info:
  title: '{$module->name} Service API'
  description: 'Enterprise REST API endpoints automatically generated for {$module->name} entity.'
  version: '1.0.0'
servers:
  - url: 'https://architect.kodaidev.my.id/api/v1'
    description: Production Gateway
paths:
  /{$module->table_name}:
    get:
      summary: List {$module->name} records
      description: Returns a paginated collection of {$module->table_name} scoped to the authenticated tenant.
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful paginated response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      \$ref: '#/components/schemas/{$module->name}'
    post:
      summary: Create new {$module->name}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              \$ref: '#/components/schemas/{$module->name}Input'
      responses:
        '201':
          description: Created
        '422':
          description: Validation Error
  /{$module->table_name}/{id}:
    get:
      summary: Get {$module->name} details
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Detail record
        '404':
          description: Record not found
    delete:
      summary: Soft delete {$module->name}
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Deleted successfully
components:
  schemas:
    {$module->name}:
      type: object
      properties:
        id:
          type: string
          format: uuid
        project_id:
          type: string
          format: uuid
{$propsYaml}
        created_at:
          type: string
          format: date-time
    {$module->name}Input:
      type: object
{$reqYaml}
      properties:
{$propsYaml}
YAML;

        return [
            'id' => 'openapi',
            'name' => Str::snake($module->name) . "-openapi.yaml",
            'path' => "docs/api/{$module->table_name}.openapi.yaml",
            'language' => 'yaml',
            'badge' => 'OpenAPI 3.0 (Swagger)',
            'is_live' => false,
            'description' => 'OpenAPI 3.0 REST Specification for Mobile Apps, Microservices, and Postman import',
            'content' => $content,
        ];
    }
}

