<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'weight',
        'height',
        'last_donation_date',
        'medical_conditions',
        'medications',
        'health_status'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_donation_date' => 'date',
        'medical_conditions' => 'array',
        'weight' => 'float',
        'height' => 'float'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 