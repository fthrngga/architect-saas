<?php
use Illuminate\Support\Facades\Route;
use App\Modules\Product\Http\Controllers\ProductController;

Route::apiResource('products', ProductController::class);
