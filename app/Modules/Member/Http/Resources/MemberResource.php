<?php

namespace App\Modules\Member\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'card_id' => $this->card_id,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'package_plan' => $this->package_plan,
            'expiry_date' => $this->expiry_date,
            'status' => $this->status,
            'id' => $this->id,
            'created_at' => $this->created_at
        ];
    }
}