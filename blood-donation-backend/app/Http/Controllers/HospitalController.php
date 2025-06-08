<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HospitalController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:100',
            'city' => 'nullable|string|max:255',
            'has_blood_bank' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Hospital::query();

        // Apply city filter if provided
        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Filter by blood bank availability
        if ($request->has('has_blood_bank')) {
            $query->where('has_blood_bank', $request->has_blood_bank);
        }

        // Apply location radius search if coordinates provided
        $hospitals = $query->nearby(
            $request->latitude,
            $request->longitude,
            $request->radius ?? 10
        )->get();

        return response()->json([
            'success' => true,
            'data' => $hospitals,
            'count' => $hospitals->count()
        ]);
    }

    public function bloodBanks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:100',
            'city' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Hospital::withBloodBank();

        // Apply city filter if provided
        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Apply location radius search
        $bloodBanks = $query->nearby(
            $request->latitude,
            $request->longitude,
            $request->radius ?? 10
        )->get();

        return response()->json([
            'success' => true,
            'data' => $bloodBanks,
            'count' => $bloodBanks->count()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'has_blood_bank' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hospital = Hospital::create($request->all());
        return response()->json([
            'success' => true,
            'data' => $hospital
        ], 201);
    }

    public function seedHospitals()
    {
        $hospitals = [
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
            [
                'name' => 'Gandaki Medical College',
                'phone' => '061-538595',
                'email' => 'info@gmc.edu.np',
                'city' => 'Pokhara',
                'address' => 'Prithvi Chowk, Pokhara-8',
                'latitude' => 28.2341,
                'longitude' => 83.9845,
                'description' => 'Teaching hospital with modern facilities',
                'has_blood_bank' => true
            ],
            [
                'name' => 'Metro City Hospital',
                'phone' => '061-523695',
                'email' => 'info@metrocity.com.np',
                'city' => 'Pokhara',
                'address' => 'Birauta, Pokhara-17',
                'latitude' => 28.2209,
                'longitude' => 83.9892,
                'description' => 'Private hospital with modern facilities',
                'has_blood_bank' => false
            ],
            [
                'name' => 'Fewa City Hospital',
                'phone' => '061-524477',
                'email' => 'info@fewacity.com.np',
                'city' => 'Pokhara',
                'address' => 'Lakeside, Pokhara-6',
                'latitude' => 28.2132,
                'longitude' => 83.9634,
                'description' => 'Private hospital near Fewa Lake',
                'has_blood_bank' => false
            ]
        ];

        foreach ($hospitals as $hospital) {
            Hospital::create($hospital);
        }

        return response()->json([
            'success' => true,
            'message' => 'Hospitals seeded successfully'
        ]);
    }
} 