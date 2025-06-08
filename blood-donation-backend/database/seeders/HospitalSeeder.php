<?php

namespace Database\Seeders;

use App\Models\Hospital;
use Illuminate\Database\Seeder;

class HospitalSeeder extends Seeder
{
    public function run()
    {
        $hospitals = [
            // Pokhara Hospitals
            [
                'name' => 'Manipal Teaching Hospital',
                'phone' => '061-526416',
                'email' => 'info@manipal.edu.np',
                'city' => 'Pokhara',
                'address' => 'Phulbari, Pokhara-11',
                'latitude' => 28.2397,
                'longitude' => 83.9989,
                'description' => 'Major teaching hospital with blood bank facilities',
                'has_blood_bank' => true
            ],
            [
                'name' => 'Western Regional Hospital',
                'phone' => '061-520297',
                'email' => 'info@wrhp.gov.np',
                'city' => 'Pokhara',
                'address' => 'Ramghat, Pokhara-10',
                'latitude' => 28.2195,
                'longitude' => 83.9856,
                'description' => 'Government regional hospital with emergency services',
                'has_blood_bank' => true
            ],
            // Kathmandu Hospitals
            [
                'name' => 'Bir Hospital',
                'phone' => '01-4221119',
                'email' => 'info@birhospital.gov.np',
                'city' => 'Kathmandu',
                'address' => 'Kanti Path',
                'latitude' => 27.7041,
                'longitude' => 85.3131,
                'description' => 'Oldest hospital in Nepal with advanced facilities',
                'has_blood_bank' => true
            ],
            [
                'name' => 'Teaching Hospital',
                'phone' => '01-4412505',
                'email' => 'info@teachinghospital.edu.np',
                'city' => 'Kathmandu',
                'address' => 'Maharajgunj',
                'latitude' => 27.7361,
                'longitude' => 85.3300,
                'description' => 'Major teaching hospital with modern facilities',
                'has_blood_bank' => true
            ],
            [
                'name' => 'Grande Hospital',
                'phone' => '01-4478205',
                'email' => 'info@grandehospital.com',
                'city' => 'Kathmandu',
                'address' => 'Dhapasi',
                'latitude' => 27.7419,
                'longitude' => 85.3264,
                'description' => 'Private hospital with state-of-the-art facilities',
                'has_blood_bank' => true
            ],
            // Butwal Hospitals
            [
                'name' => 'Lumbini City Hospital',
                'phone' => '071-546785',
                'email' => 'info@lumbinicity.com.np',
                'city' => 'Butwal',
                'address' => 'Golpark',
                'latitude' => 27.7005,
                'longitude' => 83.4482,
                'description' => 'Modern hospital serving Butwal region',
                'has_blood_bank' => true
            ]
        ];

        foreach ($hospitals as $hospital) {
            Hospital::create($hospital);
        }
    }
} 