<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return redirect()->route('architect.projects.index');
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/projects', [App\Modules\ArchitectCore\Http\Controllers\ProjectController::class, 'index'])->name('architect.projects.index');
    Route::post('/projects', [App\Modules\ArchitectCore\Http\Controllers\ProjectController::class, 'store'])->name('architect.projects.store');
    Route::delete('/projects/{project}', [App\Modules\ArchitectCore\Http\Controllers\ProjectController::class, 'destroy'])->name('architect.projects.destroy');
    Route::get('/projects/{project}/export', [App\Modules\ArchitectCore\Http\Controllers\ProjectController::class, 'export'])->name('architect.projects.export');

    // Modules & Relations
    Route::get('/projects/{project}/modules', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'index'])->name('architect.modules.index');
    Route::post('/projects/{project}/modules', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'store'])->name('architect.modules.store');
    Route::delete('/modules/{module}', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'destroy'])->name('architect.modules.destroy');
    Route::get('/modules/{module}/inspect', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'inspectCode'])->name('architect.modules.inspect');
    Route::post('/projects/{project}/relations', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'storeRelation'])->name('architect.relations.store');
    Route::delete('/projects/{project}/relations/{relation}', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'destroyRelation'])->name('architect.relations.destroy');

    Route::get('/editor/{project}', [App\Modules\ArchitectCore\Http\Controllers\EditorController::class, 'canvas'])->name('architect.editor.canvas');

    // Theme & Styling Settings (Tweakcn integration)
    Route::get('/projects/{project}/themes', [App\Modules\ArchitectCore\Http\Controllers\ProjectThemeController::class, 'index'])->name('architect.projects.themes.index');
    Route::post('/projects/{project}/theme', [App\Modules\ArchitectCore\Http\Controllers\ProjectThemeController::class, 'update'])->name('architect.projects.theme.update');
});

// Project App Preview Routes
Route::prefix('app/{handle}/{project_slug}')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'dashboard'])->name('app.dashboard');

    // Builder Routes (Use ProjectAppController acting as proxy or specific new controller?)
    // To keep it clean, let's use ProjectAppController
    Route::get('/builder/modules', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'moduleBuilder'])->name('app.builder.modules.index');
    Route::post('/builder/modules', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'storeModule'])->name('app.builder.modules.store');
    Route::delete('/builder/modules/{module}', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'destroyModule'])->name('app.builder.modules.destroy');

    // Dynamic Module Routes
    Route::get('/{module_name}', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'handleModuleRequest'])->name('app.module.index');
    Route::post('/{module_name}', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'handleModuleRequest'])->name('app.module.store');
    Route::get('/{module_name}/create', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'handleModuleRequest'])->name('app.module.create');
    Route::get('/{module_name}/{id}/edit', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'handleModuleRequest'])->name('app.module.edit');
    Route::match(['put', 'patch'], '/{module_name}/{id}', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'handleModuleRequest'])->name('app.module.update');
    Route::delete('/{module_name}/{id}', [App\Modules\ArchitectCore\Http\Controllers\ProjectAppController::class, 'handleModuleRequest'])->name('app.module.destroy');
});

require __DIR__ . '/auth.php';
