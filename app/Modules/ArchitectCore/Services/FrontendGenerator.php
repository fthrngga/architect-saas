<?php

namespace App\Modules\ArchitectCore\Services;

use App\Modules\ArchitectCore\Models\Module;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class FrontendGenerator
{
    public function generate(Module $module)
    {
        $projectSlug = $module->project->slug;
        $moduleName = $module->name; // StudlyCase already ensured by GeneratorService

        // Target Directory: resources/js/Pages/{moduleName}
        $targetDir = resource_path("js/Pages/{$moduleName}");

        if (!File::exists($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        $this->generateIndex($module, $targetDir);
        $this->generateForm($module, $targetDir);
    }

    protected function generateIndex(Module $module, $targetDir)
    {
        $stub = File::get(resource_path('stubs/architect/frontend_index.stub'));

        // Generate Headers and Columns
        $headers = "";
        $columns = "";

        foreach ($module->attributes as $attr) {
            $label = Str::title(str_replace('_', ' ', $attr['name']));
            $headers .= "<TableHead>{$label}</TableHead>\n                                ";
            $columns .= "<TableCell>{item.{$attr['name']}}</TableCell>\n                                    ";
        }

        $content = str_replace(
            ['{{ title }}', '{{ modelName }}', '{{ table }}', '{{ headers }}', '{{ columns }}', '{{ baseUrl }}'],
            [
                Str::plural($module->name),
                Str::singular($module->name),
                $module->table_name,
                $headers,
                $columns,
                "/app/{$module->project->owner->handle}/{$module->project->slug}"
            ],
            $stub
        );

        File::put("{$targetDir}/Index.tsx", $content);
    }

    protected function generateForm(Module $module, $targetDir)
    {
        $stub = File::get(resource_path('stubs/architect/frontend_form.stub'));

        // Generate Form Fields and Inputs
        $formFields = "";
        $formInputs = "";

        foreach ($module->attributes as $attr) {
            $name = $attr['name'];
            $label = Str::title(str_replace('_', ' ', $name));
            $type = $this->getInputType($attr['type']);

            // Default values for useForm
            $defaultValue = $type === 'number' ? '0' : "''";
            $formFields .= "{$name}: item?.{$name} ?? {$defaultValue},\n        ";

            // Input Component
            $formInputs .= "
                            <div className=\"grid gap-2\">
                                <Label htmlFor=\"{$name}\">{$label}</Label>
                                <Input
                                    id=\"{$name}\"
                                    type=\"{$type}\"
                                    value={data.{$name}}
                                    onChange={(e) => setData('{$name}', e.target.value)}
                                    required
                                />
                                {errors.{$name} && <p className=\"text-sm text-destructive\">{errors.{$name}}</p>}
                            </div>";
        }

        $content = str_replace(
            ['{{ modelName }}', '{{ table }}', '{{ formFields }}', '{{ formInputs }}', '{{ baseUrl }}'],
            [
                Str::singular($module->name),
                $module->table_name,
                $formFields,
                $formInputs,
                "/app/{$module->project->owner->handle}/{$module->project->slug}"
            ],
            $stub
        );

        File::put("{$targetDir}/Form.tsx", $content);
    }

    protected function getInputType($dbType)
    {
        return match ($dbType) {
            'integer', 'decimal', 'float' => 'number',
            'boolean' => 'checkbox',
            'date', 'datetime' => 'date',
            'text', 'longText' => 'textarea', // We might want a Textarea component later
            default => 'text',
        };
    }
}
