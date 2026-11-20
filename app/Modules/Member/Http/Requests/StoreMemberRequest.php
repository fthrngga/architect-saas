<?php

namespace App\Modules\Member\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'card_id' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'package_plan' => 'required|string|max:255',
            'expiry_date' => 'required|date',
            'status' => 'required|string|max:255'
        ];
    }
}