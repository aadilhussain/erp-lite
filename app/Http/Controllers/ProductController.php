<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(
        Request $request,
        ProductService $service) {

        return $service->createProduct(

            $request->all()

        );

    }
}
