<?php

namespace App\Modules\ArchitectCore\Services;

use App\Modules\ArchitectCore\Models\Project;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use ZipArchive;

class ProjectExportService
{
    protected $baseIgnoreList = [
        '.git',
        '.idea',
        'node_modules',
        'vendor',
        'storage',
        'public/build',
        'public/storage',
        'app/Modules/ArchitectCore',
        'app/Modules/CodeFactory',
        'resources/js/Pages/Architect',
        'resources/js/Pages/Apps',
        'resources/stubs', // Explicitly ignore stubs
    ];

    public function export(Project $project)
    {
        $exportId = uniqid('export_');
        $tempDir = storage_path("app/exports/{$exportId}");
        $projectName = Str::slug($project->name);
        $zipPath = storage_path("app/exports/{$projectName}.zip");

        // 1. Create Clean Skeleton
        $this->createSkeleton($tempDir);

        // 2. Build Storage Structure
        $this->buildStorageStructure($tempDir);

        // 3. Generate Env
        $this->generateEnv($tempDir);

        // 4. Inject User Modules
        $this->injectModules($project, $tempDir);

        // 5. Inject Frontend & Refactor
        $this->injectFrontend($project, $tempDir);

        // 6. Create Standalone Routes
        $this->createRoutes($project, $tempDir);

        // 7. Apply Custom UI Theme (Tweakcn / Shadcn styling)
        $this->applyTheme($project, $tempDir);

        // 8. Cleanup SaaS Dependencies
        $this->cleanupSaaS($tempDir);

        // 9. Zip it (Wrap inside project folder)
        $this->zipDirectory($tempDir, $zipPath, $projectName);

        // Cleanup temp
        File::deleteDirectory($tempDir);

        return $zipPath;
    }

    protected function createSkeleton($targetDir)
    {
        File::makeDirectory($targetDir, 0755, true);

        $dirsToCopy = [
            'app',
            'bootstrap',
            'config',
            'database',
            'public',
            'resources',
            'routes',
            'tests',
        ];

        foreach ($dirsToCopy as $dir) {
            if (File::exists(base_path($dir))) {
                File::copyDirectory(base_path($dir), "{$targetDir}/{$dir}");
            }
        }

        $rootFiles = ['composer.json', 'package.json', 'vite.config.js', 'tsconfig.json', 'artisan', '.env.example', 'tailwind.config.js', 'postcss.config.js'];
        foreach ($rootFiles as $file) {
            if (File::exists(base_path($file))) {
                File::copy(base_path($file), "{$targetDir}/{$file}");
            }
        }

        // Strict Removal of SaaS code from skeleton
        File::deleteDirectory("{$targetDir}/app/Modules/ArchitectCore");
        File::deleteDirectory("{$targetDir}/app/Modules/CodeFactory");
        File::deleteDirectory("{$targetDir}/resources/js/Pages/Architect");
        File::deleteDirectory("{$targetDir}/resources/js/Pages/Apps");
        File::deleteDirectory("{$targetDir}/resources/stubs");
    }

    protected function buildStorageStructure($targetDir)
    {
        $storagePaths = [
            'app/public',
            'framework/cache/data',
            'framework/sessions',
            'framework/testing',
            'framework/views',
            'logs',
        ];

        foreach ($storagePaths as $path) {
            $fullPath = "{$targetDir}/storage/{$path}";
            File::makeDirectory($fullPath, 0755, true);
            File::put("{$fullPath}/.gitkeep", "");
        }
    }

    protected function generateEnv($targetDir)
    {
        $envExample = base_path('.env.example');
        if (File::exists($envExample)) {
            $content = File::get($envExample);
            // Replace APP_KEY with a fresh one
            $key = 'base64:' . base64_encode(random_bytes(32));
            $content = preg_replace('/APP_KEY=.*/', "APP_KEY={$key}", $content);
            File::put("{$targetDir}/.env", $content);
        }
    }

    protected function injectModules(Project $project, $targetDir)
    {
        $modules = $project->modules()->where('status', 'generated')->get();
        foreach ($modules as $module) {
            $source = app_path("Modules/{$module->name}");
            if (File::exists($source)) {
                $dest = "{$targetDir}/app/Modules/{$module->name}";
                File::copyDirectory($source, $dest);

                // Refactor Controller Redirections in the exported modules
                $this->refactorControllerRedirections($dest, $module);
            }
        }
    }

    protected function refactorControllerRedirections($directory, $module)
    {
        $controllersDir = "{$directory}/Http/Controllers";
        if (!File::exists($controllersDir))
            return;

        $files = File::allFiles($controllersDir);
        foreach ($files as $file) {
            $content = File::get($file->getPathname());

            // Refactor redirect()->route('app.module.index', [...])
            // to redirect()->route('{$module->table_name}.index')
            $pattern = "/redirect\(\)->route\(['\"]app\.module\.index['\"],\s*\[[^\]]+\]\)/";
            $replacement = "redirect()->route('{$module->table_name}.index')";
            $content = preg_replace($pattern, $replacement, $content);

            File::put($file->getPathname(), $content);
        }
    }

    protected function injectFrontend(Project $project, $targetDir)
    {
        $modules = $project->modules()->where('status', 'generated')->get();

        foreach ($modules as $module) {
            $source = resource_path("js/Pages/{$module->name}");
            if (File::exists($source)) {
                $dest = "{$targetDir}/resources/js/Pages/{$module->name}";
                File::copyDirectory($source, $dest);
                $this->refactorFrontendImports($dest, $project);
            }
        }

        $layoutStub = resource_path("stubs/architect/app_layout.stub");
        if (File::exists($layoutStub)) {
            $layoutContent = File::get($layoutStub);
            // Inject module links into sidebar
            $moduleLinks = "";
            foreach ($modules as $mod) {
                $modLabel = Str::plural($mod->name);
                $moduleLinks .= "
                    <div className=\"py-1\">
                        <Link
                            href=\"/{$mod->table_name}\"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors \${usePage().url.startsWith('/{$mod->table_name}') ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Box className=\"w-4 h-4\" />
                            {$modLabel}
                        </Link>
                    </div>";
            }
            $layoutContent = str_replace('{/* Modules will be injected here', $moduleLinks . "\n{/* Modules will be injected here", $layoutContent);
            File::put("{$targetDir}/resources/js/Layouts/AppLayout.tsx", $layoutContent);
        }

        // Inject Simple Dashboard
        $dashboardContent = "import React from 'react';\nimport AppLayout from '@/Layouts/AppLayout';\nimport { Head } from '@inertiajs/react';\n\nexport default function Dashboard() {\n    return (\n        <AppLayout title=\"Dashboard\">\n            <Head title=\"Dashboard\" />\n            <div className=\"py-12\">\n                <div className=\"max-w-7xl mx-auto sm:px-6 lg:px-8\">\n                    <div className=\"bg-white overflow-hidden shadow-sm sm:rounded-lg\">\n                        <div className=\"p-6 text-gray-900\">Welcome to your new app!</div>\n                    </div>\n                </div>\n            </div>\n        </AppLayout>\n    );\n}";
        File::put("{$targetDir}/resources/js/Pages/Dashboard.tsx", $dashboardContent);
    }

    protected function refactorFrontendImports($directory, Project $project)
    {
        $files = File::allFiles($directory);
        $ownerHandle = $project->owner->handle ?? '';
        $basePrefix = "/app/{$ownerHandle}/{$project->slug}";

        foreach ($files as $file) {
            $content = File::get($file->getPathname());
            $content = str_replace("import UserAppLayout from '@/Layouts/UserAppLayout';", "import AppLayout from '@/Layouts/AppLayout';", $content);
            $content = str_replace('<UserAppLayout', '<AppLayout', $content);
            $content = str_replace('</UserAppLayout>', '</AppLayout>', $content);

            // Replace SaaS app URL prefix with empty string for root-level access in exported app
            if ($basePrefix) {
                $content = str_replace($basePrefix, '', $content);
            }
            $content = str_replace('{{ baseUrl }}', '', $content);

            File::put($file->getPathname(), $content);
        }
    }

    protected function createRoutes(Project $project, $targetDir)
    {
        $modules = $project->modules()->where('status', 'generated')->get();

        $routes = "<?php\n\nuse Illuminate\Support\Facades\Route;\nuse Inertia\Inertia;\n\n";
        $routes .= "Route::get('/', function () { return Inertia::render('Welcome', ['canLogin' => Route::has('login'), 'canRegister' => Route::has('register')]); });\n\n";
        $routes .= "Route::middleware(['auth', 'verified'])->group(function () {\n";
        $routes .= "    Route::get('/dashboard', function () { return Inertia::render('Dashboard'); })->name('dashboard');\n\n";

        foreach ($modules as $module) {
            $className = $module->name . 'Controller';
            $namespace = "App\\Modules\\{$module->name}\\Http\\Controllers\\{$className}";
            $slug = $module->table_name;
            $routes .= "    Route::resource('{$slug}', \\{$namespace}::class);\n";
        }

        $routes .= "});\n\nrequire __DIR__.'/auth.php';\n";
        File::put("{$targetDir}/routes/web.php", $routes);
    }

    protected function applyTheme(Project $project, $targetDir)
    {
        $settings = $project->settings ?? [];
        $theme = $settings['theme'] ?? null;
        if (!$theme) {
            return;
        }

        $cssPath = "{$targetDir}/resources/css/app.css";
        if (File::exists($cssPath)) {
            $cssContent = ThemeRegistry::buildCssContent($theme);
            File::put($cssPath, $cssContent);
        }

        if (!empty($theme['googleFontUrl'])) {
            $bladePath = "{$targetDir}/resources/views/app.blade.php";
            if (File::exists($bladePath)) {
                $bladeContent = File::get($bladePath);
                $fontLink = '<link rel="stylesheet" href="' . e($theme['googleFontUrl']) . '">';
                $bladeContent = str_replace('</head>', "    {$fontLink}\n    </head>", $bladeContent);
                File::put($bladePath, $bladeContent);
            }
        }
    }

    protected function cleanupSaaS($targetDir)
    {
        // 1. Clean composer.json
        $composerPath = "{$targetDir}/composer.json";
        if (File::exists($composerPath)) {
            $composer = json_decode(File::get($composerPath), true);
            // Remove anything related to Architect Core if mapped in psr-4 (unlikely, but safe)
            // Main goal: ensure it boots without the SaaS modules
            File::put($composerPath, json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }

        // 2. Clean config/app.php
        $appConfigPath = "{$targetDir}/config/app.php";
        if (File::exists($appConfigPath)) {
            $content = File::get($appConfigPath);
            // Remove any SaaS specific providers if hardcoded
            $content = str_replace("App\Modules\ArchitectCore\Providers\ArchitectServiceProvider::class,", "", $content);
            File::put($appConfigPath, $content);
        }
    }

    protected function zipDirectory($source, $destination, $rootFolder = '')
    {
        if (!extension_loaded('zip') || !file_exists($source))
            return false;
        $zip = new ZipArchive();
        if (!$zip->open($destination, ZipArchive::CREATE | ZipArchive::OVERWRITE))
            return false;

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($source) + 1);
                if ($rootFolder)
                    $relativePath = $rootFolder . '/' . $relativePath;
                $zip->addFile($filePath, $relativePath);
            }
        }
        $zip->close();
        return file_exists($destination);
    }
}
