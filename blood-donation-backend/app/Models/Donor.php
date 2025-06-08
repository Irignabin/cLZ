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