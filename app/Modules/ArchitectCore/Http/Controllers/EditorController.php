<?php

namespace App\Modules\ArchitectCore\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ArchitectCore\Models\Project;
use Inertia\Inertia;

class EditorController extends Controller
{
    public function canvas(Project $project)
    {
        $project->load(['owner', 'modules']);
        return Inertia::render('Architect/Editor/Canvas', [
            'project' => $project,
            'modules' => $project->modules
        ]);
    }
}
