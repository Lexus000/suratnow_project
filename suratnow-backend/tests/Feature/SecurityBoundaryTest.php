<?php

namespace Tests\Feature;

use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityBoundaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_read_another_users_request(): void
    {
        $owner = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $otherUser = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $type = LetterType::create(['name' => 'Surat Uji', 'fields_schema' => []]);
        $request = LetterRequest::create([
            'user_id' => $owner->id,
            'letter_type_id' => $type->id,
            'data' => ['nama_pemohon' => $owner->name],
            'status' => 'pending',
        ]);

        Sanctum::actingAs($otherUser);

        $this->getJson('/api/letter-requests/'.$request->id)
            ->assertForbidden();
    }

    public function test_legacy_bearer_tokens_are_rejected(): void
    {
        $user = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $token = $user->createToken('legacy-test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertUnauthorized();
    }

    public function test_final_request_status_cannot_be_overwritten(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $owner = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $type = LetterType::create(['name' => 'Surat Uji', 'fields_schema' => []]);
        $request = LetterRequest::create([
            'user_id' => $owner->id,
            'letter_type_id' => $type->id,
            'data' => ['nama_pemohon' => $owner->name],
            'status' => 'approved',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/letter-requests/'.$request->id.'/reject', [
            'rejection_reason' => 'Tidak valid',
        ])->assertStatus(409);
    }

    public function test_non_pdf_upload_is_rejected(): void
    {
        $user = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $type = LetterType::create(['name' => 'Surat Uji', 'fields_schema' => []]);

        Sanctum::actingAs($user);

        $this->postJson('/api/letter-requests', [
            'letter_type_id' => $type->id,
            'data' => ['nama_pemohon' => 'Pengguna Uji'],
            'berkas_desa' => UploadedFile::fake()->createWithContent('surat.pdf', 'bukan dokumen pdf'),
        ])->assertStatus(422);
    }

    public function test_attachment_is_limited_to_owner_or_staff(): void
    {
        Storage::fake('local');
        $owner = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $otherUser = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $type = LetterType::create(['name' => 'Surat Uji', 'fields_schema' => []]);
        $path = 'berkas_desa/security-test.pdf';
        Storage::disk('local')->put($path, "%PDF-1.7\nsecurity test");
        $request = LetterRequest::create([
            'user_id' => $owner->id,
            'letter_type_id' => $type->id,
            'data' => ['nama_pemohon' => $owner->name],
            'berkas_desa' => $path,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($otherUser);
        $this->getJson('/api/letter-requests/'.$request->id.'/attachment')
            ->assertForbidden();

        Sanctum::actingAs($owner);
        $this->get('/api/letter-requests/'.$request->id.'/attachment')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/pdf');
    }
}
