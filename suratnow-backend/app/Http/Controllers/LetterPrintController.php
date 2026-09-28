<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\LetterRequest;

class LetterPrintController extends Controller
{
    public function printLetter(Request $request, LetterRequest $letterRequest)
    {
        $user = $request->user();
        $staffRoles = ['admin', 'petugas', 'superadmin'];
        $isStaff = in_array(strtolower((string) $user?->role), $staffRoles, true);

        if (!$isStaff && $letterRequest->user_id !== $user?->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($letterRequest->status !== 'approved') {
            return response()->json(['message' => 'Only approved letters can be printed'], 422);
        }

        $letterRequest->loadMissing(['user', 'letterType']);
        $data = [
            'nomor_surat' => '100.3.3.2/' . $letterRequest->id . '/406.01.2001/' . now()->year,
            'tanggal' => $letterRequest->updated_at->translatedFormat('d F Y'),
            'nama_pemohon' => $letterRequest->user->name ?? 'Warga',
            'jenis_surat' => $letterRequest->letterType->name ?? 'Surat Keterangan',
        ];

        // Escape values before inserting them into the HTML consumed by DomPDF.
        $safeType = e($data['jenis_surat']);
        $safeNumber = e($data['nomor_surat']);
        $safeName = e($data['nama_pemohon']);
        $safeDate = e($data['tanggal']);

        // Generate simple HTML for preview
        $html = '
        <div style="text-align: center; font-family: sans-serif;">
            <h2>PEMERINTAH KABUPATEN TRENGGALEK</h2>
            <h1>KECAMATAN SURUH</h1>
            <hr style="border: 2px solid black;" />
            <br/>
            <h3><u>' . strtoupper($safeType) . '</u></h3>
            <p>Nomor: ' . $safeNumber . '</p>
        </div>
        <div style="font-family: sans-serif; margin-top: 40px; line-height: 1.6;">
            <p>Telah disetujui pengajuan surat untuk:</p>
            <p><strong>Nama: </strong>' . $safeName . '</p>
            <br/><br/><br/>
            <div style="text-align: right;">
                <p>Suruh, ' . $safeDate . '</p>
                <br/><br/><br/>
                <p><strong>Camat Suruh</strong></p>
            </div>
        </div>';

        $pdf = Pdf::loadHTML($html);
        $safeFilename = Str::of($data['nama_pemohon'])
            ->ascii()
            ->replaceMatches('/[^A-Za-z0-9_-]+/', '_')
            ->trim('_')
            ->limit(80, '');

        return $pdf->download('Surat_Kecamatan_Suruh_' . $safeFilename . '.pdf');
    }
}
