<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'city',
        'address',
        'latitude',
        'longitude',
        'description',
        'has_blood_bank'
    ];

    protected $casts = [
        'has_blood_bank' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float'
    ];

    public function scopeWithBloodBank($query)
    {
        return $query->where('has_blood_bank', true);
    }

    public function scopeNearby($query, $latitude, $longitude, $radius = 10)
    {
        // Simple distance calculation using the Pythagorean theorem
        // This is an approximation that works well for small distances
        $distanceCalc = "((latitude - $latitude) * (latitude - $latitude) + 
                         (longitude - $longitude) * (longitude - $longitude)) * 111.319 * 111.319";
        
        return $query->selectRaw("*, $distanceCalc AS distance")
                    ->orderByRaw($distanceCalc)
                    ->whereRaw("$distanceCalc <= ?", [$radius]);
    }
} 