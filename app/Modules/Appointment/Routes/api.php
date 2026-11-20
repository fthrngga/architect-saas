<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Appointment\Http\Controllers\AppointmentController;

Route::apiResource('appointments', AppointmentController::class);
