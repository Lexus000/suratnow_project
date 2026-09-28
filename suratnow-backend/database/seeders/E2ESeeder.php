<?php

namespace Database\Seeders;

use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class E2ESeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            'user' => User::create([
                'name' => 'E2E Warga',
                'email' => 'e2e-user@example.test',
                'password' => 'E2eUserPassword!2026',
                'nik' => '9990000000000001',
                'phone' => '081200000001',
                'role' => 'user',
                'address' => 'Alamat E2E Warga',
                'is_active' => true,
                'password_change_required' => false,
            ]),
            'admin' => User::create([
                'name' => 'E2E Admin',
                'email' => 'e2e-admin@example.test',
                'password' => 'E2eAdminPassword!2026',
                'role' => 'admin',
                'is_active' => true,
                'password_change_required' => false,
            ]),
            'superadmin' => User::create([
                'name' => 'E2E Superadmin',
                'email' => 'e2e-superadmin@example.test',
                'password' => 'E2eSuperadminPassword!2026',
                'role' => 'superadmin',
                'is_active' => true,
                'password_change_required' => false,
            ]),
            'petugas' => User::create([
                'name' => 'E2E Petugas',
                'email' => 'e2e-petugas@example.test',
                'password' => 'E2ePetugasPassword!2026',
                'role' => 'petugas',
                'is_active' => true,
                'password_change_required' => false,
            ]),
            'reset' => User::create([
                'name' => 'E2E Reset User',
                'email' => 'e2e-reset@example.test',
                'password' => 'E2eResetPassword!2026',
                'role' => 'user',
                'is_active' => true,
                'password_change_required' => false,
            ]),
            'other' => User::create([
                'name' => 'E2E Other Warga',
                'email' => 'e2e-other@example.test',
                'password' => 'E2eOtherPassword!2026',
                'nik' => '9990000000000002',
                'role' => 'user',
                'is_active' => true,
                'password_change_required' => false,
            ]),
        ];

        $skm = LetterType::create([
            'name' => 'Surat Keterangan Miskin (SKM)',
            'fields_schema' => [
                ['label' => 'NIK', 'type' => 'text'],
                ['label' => 'Pekerjaan', 'type' => 'text'],
                ['label' => 'Keperluan', 'type' => 'textarea'],
            ],
        ]);

        LetterType::create([
            'name' => 'Surat Pengantar Nikah',
            'fields_schema' => [
                ['label' => 'Nama Pasangan', 'type' => 'text'],
                ['label' => 'Alamat Pasangan', 'type' => 'textarea'],
            ],
        ]);

        LetterType::create([
            'name' => 'Surat Keterangan Usaha (SKU)',
            'fields_schema' => [
                ['label' => 'Nama Usaha', 'type' => 'text'],
                ['label' => 'Bidang Usaha', 'type' => 'text'],
                ['label' => 'Alamat Usaha', 'type' => 'textarea'],
            ],
        ]);

        Storage::disk('local')->put('berkas_desa/e2e-approved.pdf', $this->pdf('E2E approved attachment'));
        Storage::disk('local')->put('berkas_desa/e2e-pending.pdf', $this->pdf('E2E pending attachment'));
        Storage::disk('local')->put('berkas_desa/e2e-other.pdf', $this->pdf('E2E other attachment'));

        LetterRequest::create([
            'user_id' => $users['user']->id,
            'letter_type_id' => $skm->id,
            'data' => ['nama_pemohon' => 'E2E Warga', 'nik' => '9990000000000001', 'judul_permohonan' => 'Pengajuan approved E2E'],
            'status' => 'approved',
            'admin_notes' => 'Disetujui untuk pengujian E2E.',
            'completed_at' => now(),
            'processed_by' => $users['admin']->id,
            'nomor_registrasi' => 'E2E-APPROVED-001',
            'berkas_desa' => 'berkas_desa/e2e-approved.pdf',
        ]);

        LetterRequest::create([
            'user_id' => $users['user']->id,
            'letter_type_id' => $skm->id,
            'data' => ['nama_pemohon' => 'E2E Warga', 'nik' => '9990000000000001', 'judul_permohonan' => 'Pengajuan pending E2E'],
            'status' => 'pending',
            'berkas_desa' => 'berkas_desa/e2e-pending.pdf',
        ]);

        LetterRequest::create([
            'user_id' => $users['other']->id,
            'letter_type_id' => $skm->id,
            'data' => ['nama_pemohon' => 'E2E Other Warga', 'nik' => '9990000000000002', 'judul_permohonan' => 'Pengajuan other E2E'],
            'status' => 'pending',
            'berkas_desa' => 'berkas_desa/e2e-other.pdf',
        ]);
    }

    private function pdf(string $title): string
    {
        return "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 720 Td (".$title.") Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n";
    }
}
