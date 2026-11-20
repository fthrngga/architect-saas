<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Member\Http\Controllers\MemberController;

Route::apiResource('members', MemberController::class);
