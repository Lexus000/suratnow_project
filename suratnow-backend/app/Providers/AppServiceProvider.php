<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            if (config('app.debug')) {
                throw new \RuntimeException('APP_DEBUG must be false in production.');
            }

            $connection = config('database.connections.'.config('database.default'), []);
            $username = strtolower((string) ($connection['username'] ?? ''));
            $password = (string) ($connection['password'] ?? '');

            if ($username === '' || $username === 'root' || $password === '') {
                throw new \RuntimeException('Production database credentials must use a dedicated account and a non-empty password.');
            }
        }

        RateLimiter::for('login', function (Request $request) {
            $email = strtolower((string) $request->input('email'));

            return [
                Limit::perMinute(5)->by('login-email:'.$email),
                Limit::perMinute(30)->by('login-ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('password-reset', function (Request $request) {
            $email = strtolower((string) $request->input('email'));

            return [
                Limit::perMinute(3)->by('reset-email:'.$email),
                Limit::perMinute(10)->by('reset-ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('admin-mutations', function (Request $request) {
            return Limit::perMinute(60)->by((string) ($request->user()?->getAuthIdentifier() ?? $request->ip()));
        });

        RateLimiter::for('ai', function (Request $request) {
            $identity = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return [
                Limit::perMinute(20)->by('user:'.(string) $identity),
                Limit::perMinute(60)->by('ip:'.$request->ip()),
                Limit::perMinute((int) config('services.gemini.global_rate_limit', 120))->by('global-gemini'),
            ];
        });

        RateLimiter::for('letter-create', function (Request $request) {
            $identity = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return [
                Limit::perMinute(10)->by('user:'.(string) $identity),
                Limit::perMinute(30)->by('ip:'.$request->ip()),
            ];
        });

        RateLimiter::for('pdf', function (Request $request) {
            $identity = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return Limit::perMinute(30)->by((string) $identity);
        });

        RateLimiter::for('attachment', function (Request $request) {
            $identity = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return Limit::perMinute(30)->by((string) $identity);
        });
    }
}
