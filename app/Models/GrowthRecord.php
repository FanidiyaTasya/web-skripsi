<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrowthRecord extends Model {
    protected $fillable = [
        'form_id',
        'child_id',
        'month',
        'year',
        'age_months',
        'weight',
        'height',
        'nutrition_status'
    ];

    public function child(){
        return $this->belongsTo(Child::class);
    }

    public function validation(){
        return $this->hasOne(Validation::class, 'record_id');
    }
}
