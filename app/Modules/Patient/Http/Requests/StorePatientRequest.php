<?php

namespace App\Modules\Patient\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'mr_number' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'phone_number' => 'required|string|max:255',
            'blood_type' => 'required|string|max:255'
        ];
    }
}