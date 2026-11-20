<?php

namespace App\Modules\ArchitectCore\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Schema extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'metadata' => 'array',
        'ui_coordinates' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
