<?php

namespace App\Modules\Vehicle\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'brand_model' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255',
            'year' => 'required|integer',
            'daily_rate' => 'required|integer',
            'status' => 'required|string|max:255'
        ];
    }
}