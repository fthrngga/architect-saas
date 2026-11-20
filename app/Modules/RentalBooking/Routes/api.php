<?php
use Illuminate\Support\Facades\Route;
use App\Modules\RentalBooking\Http\Controllers\RentalBookingController;

Route::apiResource('rentalBookings', RentalBookingController::class);
