<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model {
      protected $fillable = [
        'form_id',
        'total_rows'
    ];

    public function records(){
        return $this->hasMany(GrowthRecord::class, 'form_id', 'form_id');
    }
}
