<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\LetterType::insert([
            [
                'name' => 'Surat Keterangan Miskin (SKM)',
                'fields_schema' => json_encode([
                    ['label' => 'NIK', 'type' => 'text'],
                    ['label' => 'Pekerjaan', 'type' => 'text'],
                    ['label' => 'Keperluan', 'type' => 'textarea']
                ])
            ],
            [
                'name' => 'Surat Pengantar Nikah',
                'fields_schema' => json_encode([
                    ['label' => 'Nama Pasangan', 'type' => 'text'],
                    ['label' => 'Alamat Pasangan', 'type' => 'textarea']
                ])
            ],
            [
                'name' => 'Surat Keterangan Usaha (SKU)',
                'fields_schema' => json_encode([
                    ['label' => 'Nama Usaha', 'type' => 'text'],
                    ['label' => 'Bidang Usaha', 'type' => 'text'],
                    ['label' => 'Alamat Usaha', 'type' => 'textarea']
                ])
            ]
        ]);

        // Keep the existing demo accounts available for local presentations,
        // but never create them implicitly during a production deployment.
        if (config('app.seed_demo_accounts') && !app()->environment('production')) {
            $demoPasswords = config('app.demo_passwords', []);
            foreach (['superadmin', 'admin', 'user'] as $demoRole) {
                if (!is_string($demoPasswords[$demoRole] ?? null) || strlen($demoPasswords[$demoRole]) < 12) {
                    throw new \RuntimeException('DEMO_'.strtoupper($demoRole).'_PASSWORD must be configured with at least 12 characters when SEED_DEMO_ACCOUNTS=true.');
                }
            }

            User::updateOrCreate(
                ['email' => 'superadmin@suruh.go.id'],
                [
                    'name' => 'Super Administrator',
                    'password' => Hash::make($demoPasswords['superadmin']),
                    'role' => 'superadmin',
                ]
            );

            User::updateOrCreate(
                ['email' => 'admin@suruh.go.id'],
                [
                    'name' => 'Admin Pelayanan',
                    'password' => Hash::make($demoPasswords['admin']),
                    'role' => 'admin',
                ]
            );

            User::updateOrCreate(
                ['email' => 'warga@gmail.com'],
                [
                    'name' => 'Budi Warga',
                    'password' => Hash::make($demoPasswords['user']),
                    'role' => 'user',
                ]
            );
        }
    }
}
