<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:manage 
                            {action : promote|create|list}
                            {email? : User email address}
                            {name? : User full name (for create)}
                            {password? : User password (for create)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage Super Admin accounts and promote users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'list':
                $admins = User::where('role', 'superadmin')->get(['id', 'name', 'email', 'tier', 'created_at']);
                if ($admins->isEmpty()) {
                    $this->warn('Belum ada akun Super Admin yang terdaftar.');
                    return 0;
                }
                $this->table(['ID', 'Name', 'Email', 'Tier', 'Created At'], $admins->toArray());
                return 0;

            case 'promote':
                $email = $this->argument('email') ?: $this->ask('Masukkan alamat email user yang ingin dijadikan Super Admin:');
                $user = User::where('email', $email)->first();

                if (!$user) {
                    $this->error("User dengan email '{$email}' tidak ditemukan.");
                    return 1;
                }

                $user->update([
                    'role' => 'superadmin',
                    'tier' => 'agency',
                    'tier_expires_at' => null, // Lifetime access
                ]);

                $this->info("✓ Sukses! User '{$user->name}' ({$user->email}) sekarang resmi menjadi SUPER ADMIN!");
                return 0;

            case 'create':
                $name = $this->argument('name') ?: $this->ask('Nama Lengkap:');
                $email = $this->argument('email') ?: $this->ask('Alamat Email:');
                $password = $this->argument('password') ?: $this->secret('Password:');

                if (User::where('email', $email)->exists()) {
                    $this->error("Email '{$email}' sudah terdaftar. Gunakan perintah 'php artisan admin:manage promote {$email}' untuk menjadikannya Super Admin.");
                    return 1;
                }

                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make($password),
                    'handle' => Str::random(10),
                    'role' => 'superadmin',
                    'tier' => 'agency',
                    'tier_expires_at' => null,
                ]);

                $this->info("✓ Akun Super Admin '{$user->name}' ({$user->email}) berhasil dibuat!");
                return 0;

            default:
                $this->error("Aksi '{$action}' tidak valid. Pilihan yang tersedia: promote, create, list");
                return 1;
        }
    }
}
