<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Module;
use App\Modules\ArchitectCore\Models\Project;
use App\Modules\ArchitectCore\Services\GeneratorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function index(Project $project)
    {
        return Inertia::render('Architect/Modules/Index', [
            'project' => $project,
            'modules' => $project->modules()->latest()->get()
        ]);
    }

    public function store(Request $request, Project $project, GeneratorService $generator)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[A-Z][a-zA-Z0-9]*$/'], // StudlyCase only
            'table_name' => ['required', 'string', 'max:255', 'regex:/^[a-z_]+$/'], // snake_case only
            'attributes' => 'required|array', // [{name, type, nullable}]
            'attributes.*.name' => ['required', 'string', 'max:64', 'regex:/^[a-z0-9_]+$/'], // snake_case/alphanumeric
            'attributes.*.type' => 'required|string|in:string,integer,boolean,text,date',
        ]);

        $module = $project->modules()->create([
            'name' => $validated['name'],
            'table_name' => $validated['table_name'],
            'attributes' => $validated['attributes'],
            'status' => 'draft'
        ]);

        // Generate Code & Run Migration
        try {
            $generator->generate($module);
            $module->update(['status' => 'generated']);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Generation failed: ' . $e->getMessage()]);
        }

        return redirect()->back();
    }
    public function destroy(Module $module, GeneratorService $generator)
    {
        try {
            $generator->destroy($module);
            $module->delete(); // Soft delete or force delete? User logic implied complete removal.
            // Let's use forceDelete() if we really want it gone, or delete() if we support restore.
            // Given we deleted files, forceDelete or just delete is fine, but if we restore, files won't come back.
            // So forceDelete might be clearer that it's destructive.
            $module->forceDelete();
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Deletion failed: ' . $e->getMessage()]);
        }

        return redirect()->back();
    }
}
