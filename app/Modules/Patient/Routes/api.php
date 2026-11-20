<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Patient\Http\Controllers\PatientController;

Route::apiResource('patients', PatientController::class);
