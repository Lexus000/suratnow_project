<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:12',
            'nik' => ['nullable', 'string', 'max:16', 'regex:/^[0-9]+$/', 'unique:users,nik'],
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:2000',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        
        // Default role is user, don't allow setting role via register endpoint directly
        $user = User::create($validated);
        
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($user->is_active === false || $user->is_active === 0) {
            return response()->json([
                'message' => 'Akun Anda telah dinonaktifkan.'
            ], 403);
        }

        if ($user->password_change_required) {
            return response()->json([
                'message' => 'Password akun harus diatur ulang melalui tautan yang dikirim ke email Anda.',
                'password_reset_required' => true,
            ], 403);
        }

        if (app()->environment('production')) {
            foreach (config('auth.weak_password_candidates', []) as $weakPassword) {
                if (Hash::check($weakPassword, $user->password)) {
                    return response()->json([
                        'message' => 'Password akun harus diatur ulang sebelum digunakan di production.',
                        'password_reset_required' => true,
                    ], 403);
                }
            }
        }

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $accessToken = $request->user()->currentAccessToken();
        if ($accessToken && method_exists($accessToken, 'delete')) {
            $accessToken->delete();
        }
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
