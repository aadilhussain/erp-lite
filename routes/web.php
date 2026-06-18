<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use App\Models\Products;

Route::get('/api/cache-test', function () {
    $products = Cache::remember(
        'products_v1',
        3600,
        fn() => Products::all()->toArray()
    );

    return response()->json($products);
});

Route::get('/{any?}', function () {
    return response()->file(
        public_path('frontend/index.html')
    );
})->where('any', '^(?!frontend/).*$');