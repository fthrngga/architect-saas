<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rental_bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->nullable()->index();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_cost');
            $table->string('payment_status');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_bookings');
    }
};
