<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements CanResetPasswordContract
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nik',
        'phone',
        'role',
        'address',
        'is_active',
        'password_change_required'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'password_change_required' => 'boolean',
        ];
    }

    protected function role(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => $value === null ? null : strtolower($value),
            set: fn (?string $value): ?string => $value === null ? null : strtolower($value),
        );
    }
    
    /**
     * Get the letter requests for the user.
     */
    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class);
    }

    public function letterRequestsProcessed()
    {
        return $this->hasMany(LetterRequest::class, 'processed_by');
    }
}
