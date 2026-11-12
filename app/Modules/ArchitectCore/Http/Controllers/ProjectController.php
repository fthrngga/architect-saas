<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->where('owner_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Architect/Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                // Ensure name is unique for this user
                \Illuminate\Validation\Rule::unique('projects')->where(function ($query) {
                    return $query->where('owner_id', auth()->id());
                }),
            ],
            'repository_url' => 'nullable|url',
        ]);

        Project::create([
            'name' => $validated['name'],
            'repository_url' => $validated['repository_url'],
            'owner_id' => auth()->id(),
            'settings' => [
                'stack' => 'laravel-react',
                'theme' => 'shadcn',
            ]
        ]);

        return redirect()->back();
    }

    public function export(Project $project, \App\Modules\ArchitectCore\Services\ProjectExportService $exporter)
    {
        if ($project->owner_id !== auth()->id()) {
            abort(403);
        }

        try {
            $zipPath = $exporter->export($project);
            return response()->download($zipPath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Export failed: ' . $e->getMessage()]);
        }
    }
}
