<?php

namespace App\Modules\Appointment\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'patient_name' => $this->patient_name,
            'doctor_name' => $this->doctor_name,
            'appointment_date' => $this->appointment_date,
            'complaint_summary' => $this->complaint_summary,
            'status' => $this->status,
            'id' => $this->id,
            'created_at' => $this->created_at
        ];
    }
}