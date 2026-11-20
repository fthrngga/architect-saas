<?php

namespace App\Modules\RentalBooking\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RentalBookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'total_cost' => $this->total_cost,
            'payment_status' => $this->payment_status,
            'id' => $this->id,
            'created_at' => $this->created_at
        ];
    }
}