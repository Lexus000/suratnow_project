<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireFirstPartySession
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken()) {
            return response()->json(['message' => 'Bearer token authentication is disabled. Please use the secure web session.'], 401);
        }

        return $next($request);
    }
}
