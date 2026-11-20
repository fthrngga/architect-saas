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
        Schema::create('vehicles_95', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->nullable()->index();
            $table->string('brand');
            $table->string('plate');
            $table->integer('rate');
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles_95');
    }
};
