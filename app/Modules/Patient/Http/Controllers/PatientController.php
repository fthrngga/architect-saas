<?php

namespace App\Modules\Patient\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Patient\Models\Patient;
use App\Modules\Patient\Http\Requests\StorePatientRequest;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index()
    {
        return Inertia::render('Patient/Index', [
            'items' => Patient::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Patient/Form');
    }

    public function store(StorePatientRequest $request)
    {
        Patient::create($request->validated());
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'patients'
        ]);
    }

    public function edit($id)
    {
        $item = Patient::findOrFail($id);
        return Inertia::render('Patient/Form', [
            'item' => $item
        ]);
    }

    public function update(StorePatientRequest $request, $id)
    {
        $item = Patient::findOrFail($id);
        $item->update($request->validated());
        
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'patients'
        ]);
    }

    public function destroy($id)
    {
        $item = Patient::findOrFail($id);
        $item->delete();
        
        return redirect()->back();
    }
}
