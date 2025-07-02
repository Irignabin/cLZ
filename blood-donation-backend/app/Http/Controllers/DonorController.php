<?php

namespace App\Http\Controllers;

use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DonorController extends Controller
{
    public function index(Request $request)
    {
        $donors = Donor::all();
        $isAuthenticated = $request->user() !== null;
        $donors = $donors->map(function ($donor) use ($isAuthenticated) {
            $data = $donor->toArray();
            if (!$isAuthenticated) {
                unset($data['email'], $data['phone'], $data['address']);
            }
            return $data;
        });
        return response()->json($donors);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'blood_type' => 'required|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:donors',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $donor = Donor::create($request->all());
        return response()->json([
            'success' => true,
            'data' => $donor,
            'message' => 'Donor registered successfully'
        ], 201);
    }

    public function show(Request $request, Donor $donor)
    {
        $data = $donor->toArray();
        if (!$request->user()) {
            unset($data['email'], $data['phone'], $data['address']);
        }
        return response()->json($data);
    }

    public function update(Request $request, Donor $donor)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'email|unique:donors,email,' . $donor->id,
            'phone' => 'string|max:20',
            'blood_type' => 'string|max:5',
            'address' => 'string',
            'last_donation_date' => 'nullable|date',
            'is_available' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $donor->update($request->all());
        return response()->json($donor);
    }

    public function destroy(Donor $donor)
    {
        $donor->delete();
        return response()->json(null, 204);
    }

    public function getNearbyDonors(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'sometimes|numeric|min:1|max:50', // radius in kilometers
        ]);

        $radius = $request->input('radius', 10); // Default 10km
        $lat = $request->latitude;
        $lon = $request->longitude;

        try {
            // Calculate distance in kilometers using the Pythagorean theorem
            // 111.319 is the conversion factor from degrees to kilometers at the equator
            $distanceCalc = "ROUND(SQRT(POW((latitude - $lat) * 111.319, 2) + POW((longitude - $lon) * 111.319, 2)), 1)";

            $query = User::where('is_donor', true)
                ->where('available_to_donate', true)
                ->whereNotNull('latitude')
                ->whereNotNull('longitude');

            if ($request->user()) {
                $query->where('id', '!=', $request->user()->id);
            }

            $donors = $query->select([
                '*',
                DB::raw("$distanceCalc as distance")
            ])
            ->having('distance', '<=', $radius)
            ->orderBy('distance')
            ->get();

            return response()->json([
                'data' => $donors,
                'total' => $donors->count(),
                'radius' => $radius,
                'message' => $donors->count() === 0 ? 'No donors available within ' . $radius . 'km radius' : null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch nearby donors',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateAvailability(Request $request, Donor $donor)
    {
        $validator = Validator::make($request->all(), [
            'is_available' => 'required|boolean',
            'last_donation_date' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $donor->update($request->all());
        return response()->json([
            'success' => true,
            'data' => $donor,
            'message' => 'Availability updated successfully'
        ]);
    }

    public function searchDonors(Request $request)
    {
        $request->validate([
            'blood_type' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'sometimes|numeric|min:1|max:50',
        ]);

        $radius = $request->input('radius', 10);
        $lat = $request->latitude;
        $lon = $request->longitude;

        // Calculate distance in kilometers using the Pythagorean theorem
        // 111.319 is the conversion factor from degrees to kilometers at the equator
        $distanceCalc = "ROUND(SQRT(POW((latitude - $lat) * 111.319, 2) + POW((longitude - $lon) * 111.319, 2)), 1)";

        $donors = User::where('is_donor', true)
            ->where('available_to_donate', true)
            ->where('blood_type', $request->blood_type)
            ->whereRaw("SQRT(POW((latitude - ?) * 111.319, 2) + POW((longitude - ?) * 111.319, 2)) <= ?", [$lat, $lon, $radius])
            ->select([
                '*',
                DB::raw("$distanceCalc as distance")
            ])
            ->orderBy(DB::raw($distanceCalc))
            ->get();

        return response()->json([
            'donors' => $donors,
            'total' => $donors->count(),
            'radius' => $radius,
            'message' => $donors->count() === 0 ? 'No donors available within ' . $radius . 'km radius' : null
        ]);
    }

    public function becomeDonor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'blood_type' => 'required|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'address' => 'required|string',
            'date_of_birth' => 'required|date|before:-18 years',
            'weight' => 'required|numeric|min:50',
            'height' => 'required|numeric',
            'last_donation_date' => 'nullable|date',
            'medical_conditions' => 'array',
            'medications' => 'required|string',
            'agreement' => 'required|boolean|accepted',
            'health_status' => 'required|string'
        ], [
            'blood_type.in' => 'Please select a valid blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)',
            'date_of_birth.before' => 'You must be at least 18 years old to become a donor',
            'weight.min' => 'You must weigh at least 50kg to become a donor'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();
            
            $user = $request->user();
            
            // Update user information
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'blood_type' => $request->blood_type,
                'address' => $request->address,
                'is_donor' => true,
                'available_to_donate' => true,
                'last_donation_date' => $request->last_donation_date
            ]);

            // Create or update donor profile
            $donorProfile = $user->donorProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'date_of_birth' => $request->date_of_birth,
                    'weight' => $request->weight,
                    'height' => $request->height,
                    'last_donation_date' => $request->last_donation_date,
                    'medical_conditions' => $request->medical_conditions ?? [],
                    'medications' => $request->medications,
                    'health_status' => $request->health_status
                ]
            );

            DB::commit();

            return response()->json([
                'message' => 'Successfully registered as a donor',
                'user' => $user->load('donorProfile')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to register as a donor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required_without:city|numeric|between:-90,90',
            'longitude' => 'required_without:city|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:100',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Donor::available();

        // If searching by city
        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Apply blood type filter if provided
        if ($request->blood_type) {
            $query->where('blood_type', $request->blood_type);
        }

        // If coordinates are provided, use radius search
        if ($request->latitude && $request->longitude) {
            $query->nearby(
                $request->latitude,
                $request->longitude,
                $request->radius ?? 10
            );
        }

        $donors = $query->get();

        return response()->json([
            'success' => true,
            'data' => $donors,
            'count' => $donors->count(),
            'search_location' => [
                'city' => $request->city,
                'address' => $request->address,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'radius' => $request->radius ?? 10
            ]
        ]);
    }
} 