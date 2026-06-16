<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_service_creates_a_product(): void
    {
        $service = $this->app->make(ProductService::class);

        $product = $service->createProduct([
            'name' => 'Ergo Chair',
            'sku' => 'CHR-220',
            'description' => 'Comfortable office chair',
            'price' => 8999,
            'stock' => 7,
            'is_active' => true,
        ]);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertDatabaseHas('products', [
            'sku' => 'CHR-220',
            'name' => 'Ergo Chair',
        ]);
    }
}
