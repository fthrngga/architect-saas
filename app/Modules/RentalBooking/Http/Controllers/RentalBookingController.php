<?php

namespace App\Modules\RentalBooking\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\RentalBooking\Models\RentalBooking;
use App\Modules\RentalBooking\Http\Requests\StoreRentalBookingRequest;
use Inertia\Inertia;

class RentalBookingController extends Controller
{
    public function index()
    {
        return Inertia::render('RentalBooking/Index', [
            'items' => RentalBooking::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('RentalBooking/Form');
    }

    public function store(StoreRentalBookingRequest $request)
    {
        RentalBooking::create($request->validated());
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'rental_bookings'
        ]);
    }

    public function edit($id)
    {
        $item = RentalBooking::findOrFail($id);
        return Inertia::render('RentalBooking/Form', [
            'item' => $item
        ]);
    }

    public function update(StoreRentalBookingRequest $request, $id)
    {
        $item = RentalBooking::findOrFail($id);
        $item->update($request->validated());
        
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'rental_bookings'
        ]);
    }

    public function destroy($id)
    {
        $item = RentalBooking::findOrFail($id);
        $item->delete();
        
        return redirect()->back();
    }
}
