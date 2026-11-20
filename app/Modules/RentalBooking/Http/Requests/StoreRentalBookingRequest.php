<?php

namespace App\Modules\RentalBooking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRentalBookingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'total_cost' => 'required|integer',
            'payment_status' => 'required|string|max:255'
        ];
    }
}