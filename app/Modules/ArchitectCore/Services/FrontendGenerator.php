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
            $isNullable = !empty($attr['nullable']);
            $requiredAttr = $isNullable ? '' : 'required';

            // Default values for useForm
            if ($type === 'number') {
                $defaultValue = '0';
            } elseif ($type === 'checkbox') {
                $defaultValue = 'false';
            } else {
                $defaultValue = "''";
            }
            $formFields .= "{$name}: item?.{$name} ?? {$defaultValue},\n        ";

            // Input Component
            if ($type === 'textarea') {
                $formInputs .= "
                            <div className=\"grid gap-2\">
                                <Label htmlFor=\"{$name}\">{$label}</Label>
                                <textarea
                                    id=\"{$name}\"
                                    className=\"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50\"
                                    value={data.{$name}}
                                    onChange={(e) => setData('{$name}', e.target.value)}
                                    {$requiredAttr}
                                />
                                {errors.{$name} && <p className=\"text-sm text-destructive\">{errors.{$name}}</p>}
                            </div>";
            } elseif ($type === 'checkbox') {
                $formInputs .= "
                            <div className=\"flex items-center space-x-2 py-2\">
                                <input
                                    id=\"{$name}\"
                                    type=\"checkbox\"
                                    className=\"h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary\"
                                    checked={Boolean(data.{$name})}
                                    onChange={(e) => setData('{$name}', e.target.checked)}
                                />
                                <Label htmlFor=\"{$name}\" className=\"cursor-pointer\">{$label}</Label>
                                {errors.{$name} && <p className=\"text-sm text-destructive\">{errors.{$name}}</p>}
                            </div>";
            } else {
                $formInputs .= "
                            <div className=\"grid gap-2\">
                                <Label htmlFor=\"{$name}\">{$label}</Label>
                                <Input
                                    id=\"{$name}\"
                                    type=\"{$type}\"
                                    value={data.{$name}}
                                    onChange={(e) => setData('{$name}', e.target.value)}
                                    {$requiredAttr}
                                />
                                {errors.{$name} && <p className=\"text-sm text-destructive\">{errors.{$name}}</p>}
                            </div>";
            }
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
