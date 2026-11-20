<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->string('tier'); // 'pro', 'agency'
            $table->unsignedInteger('base_amount'); // e.g. 49000
            $table->unsignedSmallInteger('unique_code'); // e.g. 215
            $table->unsignedInteger('total_amount'); // base_amount + unique_code
            $table->string('payment_method')->default('qris');
            $table->string('proof_image')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // 'pending', 'approved', 'rejected'
            $table->text('admin_notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_payments');
    }
};
