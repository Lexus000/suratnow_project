<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function chat(Request $request)
    {
        $apiUrl = config('services.gemini.api_url');
        $apiKey = config('services.gemini.api_key');

        if (!$apiKey || !$apiUrl) {
            return response()->json(['reply' => 'Layanan AI sedang tidak tersedia.'], 503);
        }

        $validated = $request->validate([
            'message' => 'nullable|string|max:4000',
            'text' => 'nullable|string|max:4000',
            'prompt' => 'nullable|string|max:4000',
            'history' => 'nullable|array|max:12',
            'history.*.role' => 'required|string|in:user,assistant',
            'history.*.content' => 'required|string|max:1000',
        ]);

        $userMessage = $validated['message'] ?? $validated['text'] ?? $validated['prompt'] ?? null;
        
        if (empty($userMessage)) {
            return response()->json(['reply' => 'Pesan dari frontend kosong.'], 400);
        }

        // Gabungkan instruksi sistem dan pesan warga untuk Gemini
        $prompt = "Kamu adalah Asisten AI SuruhNow, sistem cerdas Kantor Kecamatan Suruh. Jawab pertanyaan warga dengan ramah, sopan, dan ringkas dalam Bahasa Indonesia.\n\nPertanyaan Warga: " . $userMessage;

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $apiKey,
                ])
                ->post($apiUrl, [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [['text' => $prompt]]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.6,
                        'maxOutputTokens' => 512,
                    ]
                ]);

            if ($response->successful()) {
                // Parsing balasan dari struktur JSON Gemini
                $reply = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak bisa memproses ini.';
                return response()->json([
                    'status' => 'success', 
                    'reply' => trim($reply)
                ]);
            }

            Log::warning('Gemini request failed', [
                'status' => $response->status(),
                'user_id' => $request->user()?->getAuthIdentifier(),
            ]);

            return response()->json(['reply' => 'Layanan AI sedang mengalami gangguan.'], 502);
        } catch (\Throwable $e) {
            Log::warning('Gemini request exception', [
                'exception' => get_class($e),
                'user_id' => $request->user()?->getAuthIdentifier(),
            ]);

            return response()->json(['reply' => 'Layanan AI sedang tidak tersedia.'], 503);
        }
    }
}
