<?php

use Illuminate\Support\Facades\Route;
use App\Models\Products;

Route::get('/health', fn () => [
    'status' => 'ok',
    'name' => config('app.name'),
]);


Route::get('/products', function () {
    return Products::all();
});

use App\Http\Controllers\CustomerController;

Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);