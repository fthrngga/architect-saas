<?php

namespace App\Modules\Appointment\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'patient_name' => 'required|string|max:255',
            'doctor_name' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'complaint_summary' => 'required|string|max:255',
            'status' => 'required|string|max:255'
        ];
    }
}