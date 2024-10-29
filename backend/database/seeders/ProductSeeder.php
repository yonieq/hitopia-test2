<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $faker = Faker::create();
        foreach (range(1, 200) as $index) {
            Product::create([
                'name' => $faker->name(),
                'sku' => $faker->sentence(5),
                'image' => 'products/default.jpg',
                'price' => $faker->numberBetween(1000, 100000),
                'description' => $faker->sentence(10),
                'categories' => $faker->name(),
            ]);
        }
    }
}