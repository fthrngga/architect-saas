<?php

namespace App\Modules\Patient\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'mr_number' => $this->mr_number,
            'full_name' => $this->full_name,
            'birth_date' => $this->birth_date,
            'phone_number' => $this->phone_number,
            'blood_type' => $this->blood_type,
            'id' => $this->id,
            'created_at' => $this->created_at
        ];
    }
}