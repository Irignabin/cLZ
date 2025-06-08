<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Donor;

class DonorSeeder extends Seeder
{
    public function run(): void
    {
        Donor::insert([
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '1234567890',
                'blood_type' => 'A+',
                'address' => '123 Main St',
                'last_donation_date' => '2024-01-15',
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '0987654321',
                'blood_type' => 'B-',
                'address' => '456 Elm St',
                'last_donation_date' => '2024-03-10',
                'is_available' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
} 