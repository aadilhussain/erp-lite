<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Permission;
use App\Models\Product;
use App\Models\Proposal;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ErpModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_have_proposals(): void
    {
        $customer = Customer::create([
            'name' => 'Aarav Sharma',
            'company' => 'Northstar Retail',
            'email' => 'aarav@example.com',
            'phone' => '+91 98765 43210',
        ]);

        Proposal::create([
            'customer_id' => $customer->id,
            'title' => 'Retail furniture refresh',
            'amount' => 148500,
            'status' => 'sent',
        ]);

        $this->assertCount(1, $customer->proposals);
        $this->assertSame('Retail furniture refresh', $customer->proposals->first()->title);
    }

    public function test_product_fields_are_cast_to_useful_types(): void
    {
        $product = Product::create([
            'name' => 'Office Desk',
            'sku' => 'DESK-100',
            'description' => 'A durable work desk',
            'price' => 12999,
            'stock' => 18,
            'is_active' => true,
        ]);

        $this->assertSame('12999.00', $product->price);
        $this->assertSame(18, $product->stock);
        $this->assertTrue($product->is_active);
    }

    public function test_user_can_check_permission_through_role(): void
    {
        $role = Role::create([
            'name' => 'Sales',
            'description' => 'Sales team',
        ]);

        $permission = Permission::create([
            'name' => 'create-proposals',
            'description' => 'Create sales proposals',
        ]);

        $role->permissions()->attach($permission);

        $user = User::factory()->create([
            'role_id' => $role->id,
        ]);

        $this->assertTrue($user->hasPermission('create-proposals'));
        $this->assertFalse($user->hasPermission('delete-products'));
    }
}
