<?php

namespace App\Modules\ArchitectCore\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Project extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected static function booted()
    {
        static::creating(function ($project) {
            $project->slug = \Illuminate\Support\Str::slug($project->name);
        });
    }

    protected $guarded = [];

    protected $casts = [
        'settings' => 'array',
    ];

    public function schemas()
    {
        return $this->hasMany(Schema::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function owner()
    {
        return $this->belongsTo(\App\Models\User::class, 'owner_id');
    }
}
