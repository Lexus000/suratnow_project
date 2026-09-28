<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Password;

class E2ePasswordToken extends Command
{
    protected $signature = 'e2e:password-token {email}';

    protected $description = 'Create a password reset token for an isolated E2E user';

    public function handle(): int
    {
        $database = (string) config('database.connections.mysql.database');
        $allowed = app()->environment('e2e', 'testing')
            && filter_var(env('E2E_ALLOW_DATABASE_MUTATION', false), FILTER_VALIDATE_BOOL)
            && preg_match('/(?:^|_)e2e$/i', $database) === 1;

        if (!$allowed) {
            $this->error('Refusing to create an E2E token outside the isolated environment.');
            return self::FAILURE;
        }

        $user = User::where('email', $this->argument('email'))->first();
        if (!$user) {
            $this->error('E2E user not found.');
            return self::FAILURE;
        }

        $this->line(Password::broker('users')->createToken($user));
        return self::SUCCESS;
    }
}
