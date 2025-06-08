<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blood_type',
        'units_needed',
        'hospital_name',
        'hospital_address',
        'latitude',
        'longitude',
        'urgency_level',
        'patient_name',
        'contact_phone',
        'additional_notes',
        'status',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'units_needed' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function donors()
    {
        return $this->belongsToMany(User::class, 'blood_request_donors')
            ->withTimestamps()
            ->withPivot(['status', 'response_time']);
    }
} 