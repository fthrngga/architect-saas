<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Filesystem\Filesystem;

class ModularServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $modulesPath = app_path('Modules');
        $filesystem = new Filesystem();

        if (!$filesystem->exists($modulesPath)) {
            return;
        }

        $modules = $filesystem->directories($modulesPath);

        foreach ($modules as $module) {
            $moduleName = basename($module);

            // Load Routes
            if (file_exists($module . '/Routes/web.php')) {
                Route::middleware('web')
                    ->group($module . '/Routes/web.php');
            }

            if (file_exists($module . '/Routes/api.php')) {
                Route::prefix('api')
                    ->middleware('api')
                    ->group($module . '/Routes/api.php');
            }

            // Load Migrations
            if (is_dir($module . '/Database/Migrations')) {
                $this->loadMigrationsFrom($module . '/Database/Migrations');
            }

            // Load Views
            if (is_dir($module . '/Resources/Views')) {
                $this->loadViewsFrom($module . '/Resources/Views', strtolower($moduleName));
            }
        }
    }
}
