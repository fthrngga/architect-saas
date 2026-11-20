<?php

namespace App\Modules\Vehicle\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'brand_model' => $this->brand_model,
            'license_plate' => $this->license_plate,
            'year' => $this->year,
            'daily_rate' => $this->daily_rate,
            'status' => $this->status,
            'id' => $this->id,
            'created_at' => $this->created_at
        ];
    }
}