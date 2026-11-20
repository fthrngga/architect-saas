<?php

namespace App\Modules\Vehicle\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Vehicle\Models\Vehicle;
use App\Modules\Vehicle\Http\Requests\StoreVehicleRequest;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('Vehicle/Index', [
            'items' => Vehicle::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Vehicle/Form');
    }

    public function store(StoreVehicleRequest $request)
    {
        Vehicle::create($request->validated());
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'vehicles'
        ]);
    }

    public function edit($id)
    {
        $item = Vehicle::findOrFail($id);
        return Inertia::render('Vehicle/Form', [
            'item' => $item
        ]);
    }

    public function update(StoreVehicleRequest $request, $id)
    {
        $item = Vehicle::findOrFail($id);
        $item->update($request->validated());
        
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'vehicles'
        ]);
    }

    public function destroy($id)
    {
        $item = Vehicle::findOrFail($id);
        $item->delete();
        
        return redirect()->back();
    }
}
