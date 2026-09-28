<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Allow access only when the authenticated user has one of the roles
     * declared on the route. Authorization must be enforced server-side;
     * frontend route guards are only a user-experience feature.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $allowedRoles = array_map('strtolower', $roles);

        if (!$user || !in_array(strtolower((string) $user->role), $allowedRoles, true)) {
            return response()->json(['message' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
