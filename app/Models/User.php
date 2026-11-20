<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected static function booted()
    {
        static::creating(function ($user) {
            $user->handle = \Illuminate\Support\Str::random(10);
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'handle',
        'role',
        'tier',
        'tier_expires_at',
        'lifetime_projects_count',
        'lifetime_exports_count',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'tier_expires_at' => 'datetime',
            'password' => 'hashed',
            'lifetime_projects_count' => 'integer',
            'lifetime_exports_count' => 'integer',
        ];
    }

    public function projects()
    {
        return $this->hasMany(\App\Modules\ArchitectCore\Models\Project::class, 'owner_id');
    }

    public function subscriptionPayments()
    {
        return $this->hasMany(\App\Models\SubscriptionPayment::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function getEffectiveTier(): string
    {
        if ($this->isSuperAdmin()) {
            return 'agency';
        }
        if ($this->tier === 'free' || empty($this->tier)) {
            return 'free';
        }
        if ($this->tier_expires_at && $this->tier_expires_at->isPast()) {
            return 'free';
        }
        return $this->tier;
    }

    public function canCreateProject(): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        $tier = $this->getEffectiveTier();
        if ($tier === 'free') {
            // Free users can only create 1 project in their lifetime AND have max 1 active project
            if ($this->lifetime_projects_count >= 1 || $this->projects()->count() >= 1) {
                return false;
            }
        } elseif ($tier === 'pro') {
            if ($this->projects()->count() >= 5) {
                return false;
            }
        }
        return true;
    }

    public function canCreateModule(\App\Modules\ArchitectCore\Models\Project $project): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        $tier = $this->getEffectiveTier();
        if ($tier === 'free') {
            // Free users can only create up to 3 modules in a project
            if ($project->modules()->count() >= 3) {
                return false;
            }
        }
        return true;
    }

    public function canExportProject(\App\Modules\ArchitectCore\Models\Project $project): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        $tier = $this->getEffectiveTier();
        if ($tier === 'free') {
            // Free users can only export 1 time in their lifetime
            if ($this->lifetime_exports_count >= 1) {
                return false;
            }
        }
        return true;
    }
}
