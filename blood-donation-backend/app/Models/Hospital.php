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
        $haversine = "(6371 * acos(cos(radians($latitude)) 
                     * cos(radians(latitude)) 
                     * cos(radians(longitude) - radians($longitude)) 
                     + sin(radians($latitude)) 
                     * sin(radians(latitude))))";
        
        return $query->selectRaw("*, $haversine AS distance")
                    ->having('distance', '<=', $radius)
                    ->orderBy('distance');
    }
} 