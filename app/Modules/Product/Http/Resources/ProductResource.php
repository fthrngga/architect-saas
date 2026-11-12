<?php

namespace App\Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'nama' => $this->nama,
            'harga' => $this->harga,
            'id' => $this->id,
            'created_at' => $this->created_at
        ];
    }
}