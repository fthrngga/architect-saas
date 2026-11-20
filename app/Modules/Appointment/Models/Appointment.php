<?php

namespace App\Modules\Appointment\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Appointment extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $table = 'appointments';

    protected $guarded = [];

    


    /**
     * Get the associated Patient model.
     */
    public function patient()
    {
        return $this->belongsTo(\App\Modules\Patient\Models\Patient::class, 'patient_id');
    }
}
