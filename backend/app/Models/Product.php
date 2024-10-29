<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter($query, $filters)
    {
        return $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = strtolower($search); // Ubah input pencarian menjadi lowercase
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(sku) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(categories) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('CAST(price AS CHAR) LIKE ?', ["%{$search}%"]) // Jika perlu memfilter berdasarkan harga, tanpa pengaruh case
                ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
        });
    }
}