<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SubscriptionPayment extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'invoice_number',
        'tier',
        'base_amount',
        'unique_code',
        'total_amount',
        'payment_method',
        'proof_image',
        'notes',
        'status',
        'admin_notes',
        'approved_at',
        'approved_by',
    ];

    protected static function booted()
    {
        static::creating(function ($payment) {
            if (empty($payment->id)) {
                $payment->id = (string) Str::uuid();
            }
            if (empty($payment->invoice_number)) {
                $payment->invoice_number = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    protected function casts(): array
    {
        return [
            'base_amount' => 'integer',
            'unique_code' => 'integer',
            'total_amount' => 'integer',
            'approved_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
