<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LetterType;
use App\Models\LetterRequest;
use App\Models\LetterRequestAudit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class LetterRequestController extends Controller
{
    /**
     * Get a list of available letter types with their schema.
     */
    public function types(Request $request)
    {
        // Return letter types for the dynamic form
        $types = LetterType::all();
        return response()->json($types);
    }

    /**
     * Get a list of user's letter requests
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = LetterRequest::with(['user', 'letterType']);

        $role = strtolower((string) $user->role);
        if (!in_array($role, ['admin', 'petugas', 'superadmin'], true)) {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $limit = min(max((int) $request->query('limit', 200), 1), (int) config('services.letter_requests.max_list_items', 500));
        $requests = $query->orderBy('updated_at', 'desc')->limit($limit)->get();
        
        return response()->json($requests);
    }

    /**
     * Submit a new letter request
     */
    public function store(Request $request)
    {
        $dailyLimit = (int) config('services.letter_requests.daily_limit', 100);
        $todayCount = $request->user()->letterRequests()->where('created_at', '>=', now()->startOfDay())->count();
        if ($todayCount >= $dailyLimit) {
            return response()->json(['message' => 'Batas pengajuan harian akun telah tercapai.'], 429);
        }

        $validated = $request->validate([
            'letter_type_id' => 'required|exists:letter_types,id',
            'nama_pemohon' => 'nullable|string|max:255',
            'nik' => ['nullable', 'string', 'max:16', 'regex:/^[0-9]+$/'],
            'berkas_desa' => 'nullable|file|mimes:pdf|mimetypes:application/pdf|max:2048',
            'data' => 'nullable|array|max:50', // Keep the legacy payload optional while bounding abuse.
        ]);

        $data = $request->input('data', []);
        $serializedData = json_encode($data, JSON_UNESCAPED_UNICODE);
        if ($serializedData === false || strlen($serializedData) > (int) config('services.letter_requests.max_data_bytes', 32768)) {
            return response()->json(['message' => 'Data pengajuan terlalu besar.'], 422);
        }

        $filePath = null;
        if ($request->hasFile('berkas_desa')) {
            $uploadedFile = $request->file('berkas_desa');
            $pdfHeader = @file_get_contents($uploadedFile->getRealPath(), false, null, 0, 5);
            if ($pdfHeader !== '%PDF-') {
                return response()->json(['message' => 'File bukan PDF yang valid.'], 422);
            }

            $filePath = $uploadedFile->store('berkas_desa', 'local');
        }

        // Gabungkan data nama dan nik ke dalam kolom JSON 'data' jika ada, agar kompatibel
        if ($request->filled('nama_pemohon')) $data['nama_pemohon'] = $request->nama_pemohon;
        if ($request->filled('nik')) $data['nik'] = $request->nik;

        try {
            $letterRequest = $request->user()->letterRequests()->create([
                'letter_type_id' => $validated['letter_type_id'],
                'data' => $data,
                'berkas_desa' => $filePath
            ]);
        } catch (Throwable $exception) {
            if ($filePath) {
                Storage::disk('local')->delete($filePath);
            }
            throw $exception;
        }

        return response()->json([
            'message' => 'Letter request created successfully',
            'data' => $letterRequest
        ], 201);
    }

    /**
     * Serve an uploaded village document only to its owner or authorized staff.
     */
    public function attachment(Request $request, LetterRequest $letterRequest)
    {
        $user = $request->user();
        $staffRoles = ['admin', 'petugas', 'superadmin'];
        $isStaff = in_array(strtolower((string) $user?->role), $staffRoles, true);

        if (!$isStaff && $letterRequest->user_id !== $user?->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $path = ltrim((string) $letterRequest->berkas_desa, '/');
        if ($path === '' || str_contains($path, '\\') || preg_match('#(^|/)\.\.(?:/|$)#', $path)) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        $disk = Storage::disk('local');
        if (!$disk->exists($path)) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        $response = $disk->response(
            $path,
            'lampiran-pengajuan-'.$letterRequest->id.'.pdf',
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="lampiran-pengajuan-'.$letterRequest->id.'.pdf"',
                'Content-Security-Policy' => 'sandbox',
                'X-Content-Type-Options' => 'nosniff',
            ]
        );

        return $response;
    }

    /**
     * Show details of a specific request
     */
    public function show(Request $request, LetterRequest $letterRequest)
    {
        $user = $request->user();
        
        $role = strtolower((string) $user->role);
        if (!in_array($role, ['admin', 'petugas', 'superadmin'], true) && $letterRequest->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $letterRequest->load(['user', 'letterType']);
        return response()->json($letterRequest);
    }

    /**
     * Approve a request
     */
    public function approve(Request $request, LetterRequest $letterRequest)
    {
        $user = $request->user();
        
        $role = strtolower((string) $user->role);
        if (!in_array($role, ['admin', 'petugas', 'superadmin'], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:2000',
            'nomor_registrasi' => 'required|string|max:255|unique:letter_requests,nomor_registrasi',
        ]);

        $updated = DB::transaction(function () use ($letterRequest, $validated, $user): bool {
            $locked = LetterRequest::query()->lockForUpdate()->findOrFail($letterRequest->id);
            if (!in_array($locked->status, ['pending', 'returned'], true)) {
                return false;
            }

            $fromStatus = $locked->status;

            $locked->update([
                'status' => 'approved',
                'admin_notes' => $validated['admin_notes'] ?? null,
                'nomor_registrasi' => $validated['nomor_registrasi'],
                'completed_at' => now(),
                'processed_by' => $user->id,
            ]);

            LetterRequestAudit::create([
                'letter_request_id' => $locked->id,
                'actor_id' => $user->id,
                'from_status' => $fromStatus,
                'to_status' => 'approved',
                'notes' => $validated['admin_notes'] ?? null,
                'metadata' => ['nomor_registrasi' => $validated['nomor_registrasi']],
            ]);

            return true;
        });

        if (!$updated) {
            return response()->json(['message' => 'Status surat sudah final dan tidak dapat diubah.'], 409);
        }

        $letterRequest->refresh();

        return response()->json([
            'message' => 'Letter request approved successfully',
            'data' => $letterRequest
        ]);
    }

    /**
     * Reject a request
     */
    public function reject(Request $request, LetterRequest $letterRequest)
    {
        $user = $request->user();
        
        $role = strtolower((string) $user->role);
        if (!in_array($role, ['admin', 'petugas', 'superadmin'], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:2000',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $updated = DB::transaction(function () use ($letterRequest, $validated, $user): bool {
            $locked = LetterRequest::query()->lockForUpdate()->findOrFail($letterRequest->id);
            if (!in_array($locked->status, ['pending', 'returned'], true)) {
                return false;
            }

            $fromStatus = $locked->status;

            $locked->update([
                'status' => 'rejected',
                'rejection_reason' => $validated['rejection_reason'],
                'admin_notes' => $validated['admin_notes'] ?? null,
                'completed_at' => now(),
                'processed_by' => $user->id,
            ]);

            LetterRequestAudit::create([
                'letter_request_id' => $locked->id,
                'actor_id' => $user->id,
                'from_status' => $fromStatus,
                'to_status' => 'rejected',
                'notes' => $validated['admin_notes'] ?? null,
                'metadata' => ['rejection_reason' => $validated['rejection_reason']],
            ]);

            return true;
        });

        if (!$updated) {
            return response()->json(['message' => 'Status surat sudah final dan tidak dapat diubah.'], 409);
        }

        $letterRequest->refresh();

        return response()->json([
            'message' => 'Letter request rejected successfully',
            'data' => $letterRequest
        ]);
    }

    /**
     * Return a request for revision
     */
    public function returnRequest(Request $request, LetterRequest $letterRequest)
    {
        $user = $request->user();
        
        $role = strtolower((string) $user->role);
        if (!in_array($role, ['admin', 'petugas', 'superadmin'], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string|max:2000',
        ]);

        $updated = DB::transaction(function () use ($letterRequest, $validated, $user): bool {
            $locked = LetterRequest::query()->lockForUpdate()->findOrFail($letterRequest->id);
            if (!in_array($locked->status, ['pending', 'returned'], true)) {
                return false;
            }

            $fromStatus = $locked->status;

            $locked->update([
                'status' => 'returned',
                'admin_notes' => $validated['admin_notes'],
                'completed_at' => null,
                'processed_by' => $user->id,
            ]);

            LetterRequestAudit::create([
                'letter_request_id' => $locked->id,
                'actor_id' => $user->id,
                'from_status' => $fromStatus,
                'to_status' => 'returned',
                'notes' => $validated['admin_notes'],
            ]);

            return true;
        });

        if (!$updated) {
            return response()->json(['message' => 'Status surat sudah final dan tidak dapat dikembalikan.'], 409);
        }

        $letterRequest->refresh();

        return response()->json([
            'message' => 'Letter request returned for revision',
            'data' => $letterRequest
        ]);
    }
}
