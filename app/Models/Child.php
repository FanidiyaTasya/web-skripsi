<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    protected $fillable = [
        'child_nik',
        'name',
        'gender',
        'posyandu'
    ];

    public function records()
    {
        return $this->hasMany(GrowthRecord::class, 'child_id', 'child_nik');
    }

    public function getGenderLabelAttribute()
    {
        return match ($this->gender) {
            1 => 'Laki-laki',
            2 => 'Perempuan',
            default => '-'
        };
    }

}
