<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LetterRequestController;
use App\Http\Controllers\LetterPrintController;
use App\Models\LetterRequest;
use App\Models\User;
use App\Services\PasswordResetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:register');
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');

Route::post('/password/forgot', function (Request $request, PasswordResetService $passwordResetService) {
    $validated = $request->validate(['email' => 'required|email']);
    $user = User::where('email', $validated['email'])->first();

    if ($user) {
        try {
            $passwordResetService->send($user);
        } catch (\Throwable $exception) {
            Log::warning('Password reset notification failed', [
                'exception' => get_class($exception),
            ]);
        }
    }

    return response()->json([
        'message' => 'Jika email terdaftar, tautan pengaturan password telah dikirim.',
    ], 202);
})->middleware('throttle:password-reset');

Route::post('/password/reset', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
        'token' => 'required|string',
        'password' => 'required|string|min:12|confirmed',
    ]);

    $status = Password::broker('users')->reset(
        $validated,
        function (User $user, string $password): void {
            $user->forceFill([
                'password' => Hash::make($password),
                'password_change_required' => false,
            ])->save();
            $user->tokens()->delete();
        }
    );

    if ($status !== Password::PASSWORD_RESET) {
        return response()->json(['message' => 'Tautan reset password tidak valid atau sudah kedaluwarsa.'], 422);
    }

    return response()->json(['message' => 'Password berhasil diatur ulang.']);
})->middleware('throttle:password-reset');

Route::middleware(['auth:sanctum', 'active', 'first-party-session'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/ai/chat', [AiController::class, 'chat'])
        ->middleware('throttle:ai');

    Route::get('/letter-types', [LetterRequestController::class, 'types']);
    Route::get('/my-requests', function (Request $request) {
        return LetterRequest::where('user_id', $request->user()->id)
            ->with('letterType')
            ->latest()
            ->limit((int) config('services.letter_requests.max_list_items', 500))
            ->get();
    })->middleware('role:user');

    Route::get('/user/stats', function (Request $request) {
        $userId = $request->user()->id;

        return response()->json([
            'total' => LetterRequest::where('user_id', $userId)->count(),
            'pending' => LetterRequest::where('user_id', $userId)->whereIn('status', ['pending', 'returned'])->count(),
            'approved' => LetterRequest::where('user_id', $userId)->where('status', 'approved')->count(),
            'rejected' => LetterRequest::where('user_id', $userId)->where('status', 'rejected')->count(),
        ]);
    })->middleware('role:user');

    Route::apiResource('letter-requests', LetterRequestController::class)
        ->only(['index', 'show']);

    Route::post('/letter-requests', [LetterRequestController::class, 'store'])
        ->middleware('throttle:letter-create');

    Route::get('/letter-requests/{letterRequest}/attachment', [LetterRequestController::class, 'attachment'])
        ->whereNumber('letterRequest')
        ->middleware('throttle:attachment');

    Route::middleware('role:admin,petugas,superadmin')->group(function () {
        Route::get('/admin/stats', function () {
            return response()->json([
                'total' => LetterRequest::count(),
                'pending' => LetterRequest::whereIn('status', ['pending', 'returned'])->count(),
                'approved' => LetterRequest::where('status', 'approved')->count(),
                'rejected' => LetterRequest::where('status', 'rejected')->count(),
            ]);
        });

        Route::get('/letters/pending', function () {
            return LetterRequest::with(['user', 'letterType'])
                ->whereIn('status', ['pending', 'returned'])
                ->oldest()
                ->limit((int) config('services.letter_requests.max_list_items', 500))
                ->get();
        });

        Route::post('/letter-requests/{letterRequest}/approve', [LetterRequestController::class, 'approve'])
            ->middleware('throttle:admin-mutations');
        Route::post('/letter-requests/{letterRequest}/reject', [LetterRequestController::class, 'reject'])
            ->middleware('throttle:admin-mutations');
        Route::post('/letter-requests/{letterRequest}/return', [LetterRequestController::class, 'returnRequest'])
            ->middleware('throttle:admin-mutations');
    });

    Route::middleware('role:superadmin')->group(function () {
        Route::get('/superadmin/stats', function () {
            return response()->json([
                'total' => LetterRequest::count(),
                'pending' => LetterRequest::whereIn('status', ['pending', 'returned'])->count(),
                'approved' => LetterRequest::where('status', 'approved')->count(),
                'rejected' => LetterRequest::where('status', 'rejected')->count(),
            ]);
        });

        Route::get('/superadmin/users-performance', function () {
            $users = User::whereIn('role', ['admin', 'Admin', 'user', 'User', 'warga', 'Warga'])
                ->whereRaw('LOWER(role) != ?', ['superadmin'])
                ->with(['letterRequestsProcessed' => function ($query) {
                    $query->whereNotNull('completed_at');
                }, 'letterRequests' => function ($query) {
                    $query->where('status', 'approved')->whereNotNull('completed_at');
                }])
                ->withCount([
                    'letterRequestsProcessed as admin_processed',
                    'letterRequestsProcessed as admin_approved' => function ($query) { $query->where('status', 'approved'); },
                    'letterRequestsProcessed as admin_rejected' => function ($query) { $query->where('status', 'rejected'); },
                    'letterRequests as warga_processed',
                    'letterRequests as warga_approved' => function ($query) { $query->where('status', 'approved'); },
                    'letterRequests as warga_pending' => function ($query) { $query->whereIn('status', ['pending', 'rejected']); },
                ])
                ->orderBy('updated_at', 'desc')
                ->get();

            $performanceData = $users->map(function ($user) {
                $isAdmin = strtolower($user->role) === 'admin';
                $relevantRequests = $isAdmin ? $user->letterRequestsProcessed : $user->letterRequests;
                $totalProcessed = $relevantRequests->count();
                $totalMinutes = 0;

                foreach ($relevantRequests as $request) {
                    if ($request->completed_at && $request->created_at) {
                        $totalMinutes += abs($request->created_at->diffInMinutes($request->completed_at));
                    }
                }

                $avgSla = '-';
                if ($totalProcessed > 0) {
                    $avgMinutes = round($totalMinutes / $totalProcessed);
                    if ($avgMinutes < 1) {
                        $avgSla = '< 1 mnt';
                    } elseif ($avgMinutes < 60) {
                        $avgSla = $avgMinutes.' mnt';
                    } elseif ($avgMinutes < 1440) {
                        $hours = floor($avgMinutes / 60);
                        $minutes = $avgMinutes % 60;
                        $avgSla = $minutes > 0 ? $hours.' jam '.$minutes.' mnt' : $hours.' jam';
                    } else {
                        $avgSla = floor($avgMinutes / 1440).' hari';
                    }
                }

                $words = explode(' ', $user->name);
                $initials = strtoupper(substr($words[0], 0, 1).(isset($words[1]) ? substr($words[1], 0, 1) : ''));

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'initials' => $initials,
                    'role' => $isAdmin ? 'Admin Desa' : 'Warga',
                    'processed' => $isAdmin ? ($user->admin_processed ?? 0) : ($user->warga_processed ?? 0),
                    'approved' => $isAdmin ? ($user->admin_approved ?? 0) : ($user->warga_approved ?? 0),
                    'rejected' => $isAdmin ? ($user->admin_rejected ?? 0) : ($user->warga_pending ?? 0),
                    'avgSla' => $avgSla,
                    'status' => $user->is_active ? 'Online' : 'Offline',
                    'is_online' => (bool) $user->is_active,
                ];
            })->values()->all();

            return response()->json(['data' => $performanceData]);
        });

    Route::prefix('superadmin/users')->middleware('throttle:admin-mutations')->group(function () {
            Route::get('/', function () {
                return response()->json(User::withCount('letterRequests')->orderBy('role')->latest()->get());
            });

            Route::post('/', function (Request $request) {
                $validated = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'password' => 'nullable|string|min:12',
                    'role' => ['required', Rule::in(['user', 'admin', 'petugas', 'superadmin'])],
                    'nik' => ['nullable', 'string', 'max:16', 'regex:/^[0-9]+$/', 'unique:users,nik'],
                    'phone' => 'nullable|string|max:30',
                ]);

                $passwordWasProvided = !empty($validated['password']);
                $validated['password'] = Hash::make($validated['password'] ?? Str::random(40));
                $validated['password_change_required'] = !$passwordWasProvided;
                $user = User::create($validated);

                if (!$passwordWasProvided) {
                    try {
                        app(PasswordResetService::class)->send($user);
                    } catch (\Throwable $exception) {
                        Log::warning('Initial password reset notification failed', [
                            'exception' => get_class($exception),
                            'user_id' => $user->id,
                        ]);

                        return response()->json([
                            'message' => 'Pengguna dibuat, tetapi email pengaturan password gagal dikirim. Silakan kirim ulang tautan reset dari menu pengguna.',
                            'user' => $user,
                        ], 503);
                    }
                }

                return response()->json([
                    'user' => $user,
                    'message' => $passwordWasProvided
                        ? 'Pengguna berhasil dibuat.'
                        : 'Pengguna berhasil dibuat. Tautan pengaturan password dikirim ke email pengguna.',
                ], 201);
            });

            Route::put('/{id}', function (Request $request, $id) {
                $user = User::findOrFail($id);
                $validated = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                    'nik' => ['nullable', 'string', 'max:16', 'regex:/^[0-9]+$/', Rule::unique('users', 'nik')->ignore($user->id)],
                    'phone' => 'nullable|string|max:30',
                    'password' => 'nullable|string|min:12',
                    'role' => ['sometimes', Rule::in(['user', 'admin', 'petugas', 'superadmin'])],
                ]);

                if (array_key_exists('role', $validated) && $user->is($request->user())) {
                    return response()->json(['message' => 'You cannot change your own role'], 422);
                }

                $passwordChanged = !empty($validated['password']);
                if ($passwordChanged) {
                    $validated['password'] = Hash::make($validated['password']);
                    $validated['password_change_required'] = true;
                } else {
                    unset($validated['password']);
                }

                $user->update($validated);
                if ($passwordChanged) {
                    $user->tokens()->delete();
                }

                return response()->json($user);
            });

            Route::post('/{id}/reset-password', function ($id, PasswordResetService $passwordResetService) {
                $user = User::findOrFail($id);
                $user->update(['password_change_required' => true]);
                $user->tokens()->delete();
                try {
                    $passwordResetService->send($user);
                } catch (\Throwable $exception) {
                    Log::warning('Password reset notification failed', [
                        'exception' => get_class($exception),
                        'user_id' => $user->id,
                    ]);

                    return response()->json([
                        'message' => 'Tautan pengaturan password gagal dikirim. Periksa konfigurasi email lalu coba lagi.',
                    ], 503);
                }

                return response()->json([
                    'message' => 'Tautan pengaturan password dikirim ke email pengguna.',
                ]);
            });

            Route::patch('/{id}/role', function (Request $request, $id) {
                $request->validate(['role' => ['required', Rule::in(['user', 'admin', 'petugas', 'superadmin'])]]);
                $user = User::findOrFail($id);

                if ($user->is($request->user())) {
                    return response()->json(['message' => 'You cannot change your own role'], 422);
                }

                $user->update(['role' => $request->input('role')]);

                return response()->json(['message' => 'Role updated successfully', 'user' => $user]);
            });

            Route::patch('/{id}/status', function (Request $request, $id) {
                $user = User::findOrFail($id);

                if ($user->is($request->user())) {
                    return response()->json(['message' => 'You cannot change your own status'], 422);
                }

                $user->update(['is_active' => !$user->is_active]);
                if (!$user->is_active) {
                    $user->tokens()->delete();
                }

                return response()->json(['message' => 'Status toggled successfully', 'is_active' => $user->is_active]);
            });

            Route::delete('/{id}', function (Request $request, $id) {
                $user = User::findOrFail($id);

                if ($user->is($request->user())) {
                    return response()->json(['message' => 'You cannot delete your own account'], 422);
                }

                if ($user->letterRequests()->exists()) {
                    return response()->json([
                        'message' => 'Akun memiliki riwayat surat dan tidak dapat dihapus. Nonaktifkan akun sebagai gantinya.',
                    ], 409);
                }

                $user->update(['is_active' => false]);
                $user->tokens()->delete();

                return response()->json(['message' => 'Account deactivated successfully']);
            });
        });
    });

    Route::get('/letters/{letterRequest}/print', [LetterPrintController::class, 'printLetter'])
        ->whereNumber('letterRequest')
        ->middleware('throttle:pdf');
});
