<?php

namespace Database\Seeders;

use App\Models\Donor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DonorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donors = [
            // Pokhara Donors
            [
                'name' => 'Ram Sharma',
                'blood_type' => 'A+',
                'phone' => '9846123456',
                'city' => 'Pokhara',
                'address' => 'Lakeside-6',
                'latitude' => 28.2132,
                'longitude' => 83.9634,
                'is_available' => true
            ],
            [
                'name' => 'Sita Poudel',
                'blood_type' => 'B+',
                'phone' => '9846789012',
                'city' => 'Pokhara',
                'address' => 'Birauta-17',
                'latitude' => 28.2209,
                'longitude' => 83.9892,
                'is_available' => true
            ],
            // Kathmandu Donors
            [
                'name' => 'Hari Kumar',
                'blood_type' => 'O+',
                'phone' => '9851234567',
                'city' => 'Kathmandu',
                'address' => 'Thamel',
                'latitude' => 27.7172,
                'longitude' => 85.3240,
                'is_available' => true
            ],
            [
                'name' => 'Gita Thapa',
                'blood_type' => 'A+',
                'phone' => '9851890123',
                'city' => 'Kathmandu',
                'address' => 'Baneshwor',
                'latitude' => 27.6910,
                'longitude' => 85.3423,
                'is_available' => true
            ],
            // Butwal Donors
            [
                'name' => 'Bishnu Gurung',
                'blood_type' => 'AB+',
                'phone' => '9847123456',
                'city' => 'Butwal',
                'address' => 'Devinagar',
                'latitude' => 27.7005,
                'longitude' => 83.4482,
                'is_available' => true
            ]
        ];

        foreach ($donors as $donor) {
            Donor::create($donor);
        }
    }
}
