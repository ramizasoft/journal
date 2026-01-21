<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Worklog extends Model
{
    /** @use HasFactory<\Database\Factories\WorklogFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'log_date',
        'raw_content',
        'organized_content',
        'metadata',
    ];

    protected $casts = [
        'log_date' => 'date',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
