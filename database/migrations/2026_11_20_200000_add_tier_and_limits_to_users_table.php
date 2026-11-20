<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('password'); // 'user', 'superadmin'
            $table->string('tier')->default('free')->after('role'); // 'free', 'pro', 'agency'
            $table->timestamp('tier_expires_at')->nullable()->after('tier');
            $table->unsignedInteger('lifetime_projects_count')->default(0)->after('tier_expires_at');
            $table->unsignedInteger('lifetime_exports_count')->default(0)->after('lifetime_projects_count');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'tier',
                'tier_expires_at',
                'lifetime_projects_count',
                'lifetime_exports_count',
            ]);
        });
    }
};
