<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LetterType extends Model
{
    protected $fillable = ['name', 'fields_schema'];

    protected $casts = [
        'fields_schema' => 'array',
    ];

    public function letterRequests(): HasMany
    {
        return $this->hasMany(LetterRequest::class);
    }
}
