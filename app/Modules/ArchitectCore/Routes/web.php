<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('architect')->name('architect.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Architect/Dashboard');
    })->name('dashboard');

    Route::get('/projects', [App\Modules\ArchitectCore\Http\Controllers\ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [App\Modules\ArchitectCore\Http\Controllers\ProjectController::class, 'store'])->name('projects.store');

    Route::get('/projects/{project}/modules', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'index'])->name('modules.index');
    Route::post('/projects/{project}/modules', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'store'])->name('modules.store');
    Route::delete('/modules/{module}', [App\Modules\ArchitectCore\Http\Controllers\ModuleController::class, 'destroy'])->name('modules.destroy');

    Route::get('/projects/{project}/editor', function () {
        return Inertia::render('Architect/Editor/Canvas');
    })->name('editor.canvas');

    Route::get('/tools/refactorer', function () {
        return Inertia::render('Architect/Tools/Refactorer');
    })->name('tools.refactorer');
});
