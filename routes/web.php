<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use App\Models\Products;

Route::get('/cache-test', function () {
    logger('Fetching from database');
    $products = Cache::remember(
        'products_v1',
        3600,
        fn() => Products::all()->toArray()
    );

    return response()->json($products);
});
Route::get('/', function () {
    return view('welcome');
});
// Route::get('/cache-test', function () {

//     Cache::put('name', 'Aadil', 60);

//     return Cache::get('name');
// });

//dd($products);