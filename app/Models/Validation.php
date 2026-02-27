<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Validation extends Model
{
    protected $fillable = [
        'form_id',
        'record_id',
        'status',
        // 'note'
    ];

    public function record()
    {
        return $this->belongsTo(GrowthRecord::class, 'record_id');
    }
}
