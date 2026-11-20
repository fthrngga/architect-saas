<?php

namespace App\Modules\Appointment\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Appointment\Models\Appointment;
use App\Modules\Appointment\Http\Requests\StoreAppointmentRequest;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Appointment/Index', [
            'items' => Appointment::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Appointment/Form');
    }

    public function store(StoreAppointmentRequest $request)
    {
        Appointment::create($request->validated());
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'appointments'
        ]);
    }

    public function edit($id)
    {
        $item = Appointment::findOrFail($id);
        return Inertia::render('Appointment/Form', [
            'item' => $item
        ]);
    }

    public function update(StoreAppointmentRequest $request, $id)
    {
        $item = Appointment::findOrFail($id);
        $item->update($request->validated());
        
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'appointments'
        ]);
    }

    public function destroy($id)
    {
        $item = Appointment::findOrFail($id);
        $item->delete();
        
        return redirect()->back();
    }
}
