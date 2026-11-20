<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Vehicle\Http\Controllers\VehicleController;

Route::apiResource('vehicles', VehicleController::class);
