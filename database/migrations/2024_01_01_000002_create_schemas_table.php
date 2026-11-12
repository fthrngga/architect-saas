<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schemas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('name'); // Entity Name (e.g., "Order")
            $table->string('type')->default('model'); // model, enum, job, event
            $table->json('metadata'); // ATOMIC METADATA ENGINE: Columns, Relations, Traits, Rules
            $table->json('ui_coordinates')->nullable(); // For React Flow Canvas
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schemas');
    }
};
