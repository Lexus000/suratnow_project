<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Enforce account deactivation on every authenticated request, including
     * bearer tokens that were issued before the account was disabled.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_active) {
            $accessToken = $user?->currentAccessToken();
            if ($accessToken && method_exists($accessToken, 'delete')) {
                $accessToken->delete();
            }

            return response()->json(['message' => 'Account is inactive'], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
