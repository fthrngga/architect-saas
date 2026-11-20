<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('modules', 'relations')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->json('relations')->nullable()->after('attributes');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('modules', 'relations')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->dropColumn('relations');
            });
        }
    }
};

