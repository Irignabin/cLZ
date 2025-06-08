<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'blood_type',
        'phone',
        'address',
        'city',
        'latitude',
        'longitude',
        'is_donor',
        'last_donation_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_donor' => 'boolean',
            'last_donation_date' => 'datetime',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    protected $dates = [
        'deleted_at',
    ];

    public function bloodRequests()
    {
        return $this->hasMany(BloodRequest::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function donorProfile()
    {
        return $this->hasOne(DonorProfile::class);
    }
}
