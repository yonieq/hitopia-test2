<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth:api');
    // }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $limit = $request->input('limit', 10); // Default limit 10 jika tidak ditentukan

        $products = Product::orderByDesc('created_at')
            ->filter(['search' => $search])->paginate($limit);

        return response()->json($products);
    }

    public function show($id)
    {
        return Product::findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            // Validate input, specifying that the `image` field should be an actual image file
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'sku' => 'required|string|max:255|unique:products',
                'price' => 'required|numeric',
                'description' => 'nullable|string',
                'categories' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // Image validation rules
            ]);

            // Handle the image upload
            if ($request->hasFile('image')) {
                $validatedData['image'] = $request->file('image')->store('products', 'public');
            }

            // Create the product with validated data
            $product = Product::create($validatedData);

            return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
        } catch (\Throwable $e) {
            // Handle and log error
            return response()->json(['message' => 'Failed to create product', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|max:255|unique:products,sku,' . $id,
            'price' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'categories' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // Image validation
        ]);

        try {
            if ($request->hasFile('image')) {
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }
                $validatedData['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($validatedData);

            return response()->json([
                'message' => 'Product updated successfully.',
                'data' => $product
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update product.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        try {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $product->delete();

            return response()->json([
                'message' => 'Product deleted successfully.'
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete product.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}