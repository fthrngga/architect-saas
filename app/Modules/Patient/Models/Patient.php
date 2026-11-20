<?php

namespace App\Modules\Patient\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Patient extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $table = 'patients';

    protected $guarded = [];

    


    /**
     * Get all Appointment records for this Patient.
     */
    public function appointments()
    {
        return $this->hasMany(\App\Modules\Appointment\Models\Appointment::class, 'patient_id');
    }
}
