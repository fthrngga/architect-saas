<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProjectAppController extends Controller
{
    public function dashboard($handle, $project_slug)
    {
        $user = User::where('handle', $handle)->firstOrFail();

        $project = Project::where('owner_id', $user->id)
            ->where('slug', $project_slug)
            ->with([
                'modules' => function ($q) {
                    $q->where('status', 'generated');
                },
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
            'name' => ['required', 'string', 'max:255', 'regex:/^[A-Z][a-zA-Z0-9]*$/'], // StudlyCase only
            'table_name' => ['required', 'string', 'max:255', 'regex:/^[a-z_]+$/'], // snake_case only
            'attributes' => 'required|array', // [{name, type, nullable}]
            'attributes.*.name' => ['required', 'string', 'max:64', 'regex:/^[a-z0-9_]+$/'], // snake_case/alphanumeric
            'attributes.*.type' => 'required|string|in:string,integer,boolean,text,date,float',
        ]);

        $module = $project->modules()->create([
            'name' => $validated['name'],
            'table_name' => $validated['table_name'],
            'attributes' => $validated['attributes'],
            'status' => 'draft'
        ]);

        try {
            $generator->generate($module);
            $module->update(['status' => 'generated']);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Generation failed: ' . $e->getMessage()]);
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

        // Resolve Controller Class
        // Convention: App\Modules\{ModuleName}\Http\Controllers\{ModuleName}Controller
        $studlyModule = Str::studly($module_name); // e.g. 'products' -> 'Products' ?? No, 'products' is table name usually.
        // We need to map table name to Module Name.
        // Assuming module_name in URL is the table name or slug.
        // Let's find the module by table_name or slug.
        $module = $project->modules()->where('table_name', $module_name)->firstOrFail();
        $className = Str::studly($module->name);

        $controllerClass = "App\\Modules\\{$className}\\Http\\Controllers\\{$className}Controller";

        if (!class_exists($controllerClass)) {
            abort(404, "Controller not found for module {$module_name}");
        }

        $controller = app()->make($controllerClass);

        // Determine method based on Request and Route name or HTTP Verb
        $method = 'index';
        $verb = $request->method();
        $routeName = $request->route()->getName();

        if ($routeName === 'app.module.create') {
            $method = 'create';
        } elseif ($routeName === 'app.module.edit') {
            $method = 'edit';
        } elseif ($verb === 'GET') {
            $method = 'index';
        } elseif ($verb === 'POST') {
            $method = 'store';
        } elseif ($verb === 'PUT' || $verb === 'PATCH') {
            $method = 'update';
        } elseif ($verb === 'DELETE') {
            $method = 'destroy';
        }

        // Share project context with Inertia
        Inertia::share('project', $project->load('owner'));
        Inertia::share('modules', $project->modules()->where('status', 'generated')->get());

        // Dispatch
        // We use app()->call to handle dependency injection (like StoreRequest) for all methods
        return app()->call([$controller, $method], ['id' => $id]);
    }
}
