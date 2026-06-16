<?php

namespace App\Services;

use App\Repositories\ProductRepository;

class ProductService
{

    public function __construct(

        protected ProductRepository $repository) {
    }

    public function createProduct(array $data)
    {

        return $this->repository->create($data);

    }

}
