<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'blood_type',
        'phone',
        'email',
        'city',
        'address',
        'latitude',
        'longitude',
        'is_available',
        'last_donation_date'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'last_donation_date' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float'
    ];

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
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