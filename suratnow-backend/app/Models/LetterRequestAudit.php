<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterRequestAudit extends Model
{
    protected $fillable = [
        'letter_request_id',
        'actor_id',
        'from_status',
        'to_status',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function letterRequest(): BelongsTo
    {
        return $this->belongsTo(LetterRequest::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
