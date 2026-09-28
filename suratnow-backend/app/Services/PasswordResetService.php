<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\PasswordResetLinkNotification;
use Illuminate\Support\Facades\Password;

class PasswordResetService
{
    public function send(User $user): void
    {
        $token = Password::broker('users')->createToken($user);
        $user->notify(new PasswordResetLinkNotification($token));
    }
}
