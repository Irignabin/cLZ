<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use App\Models\Hospital;
use App\Models\BloodRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    public function getNearbyDonors(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'numeric|min:1|max:50',
            'blood_type' => 'string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'city' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Donor::available()->nearby(
            $request->latitude,
            $request->longitude,
            $request->radius ?? 10
        );

        if ($request->blood_type) {
            $query->where('blood_type', $request->blood_type);
        }

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        return response()->json($query->get());
    }

    public function getNearbyHospitals(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'numeric|min:1|max:50',
            'city' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Hospital::nearby(
            $request->latitude,
            $request->longitude,
            $request->radius ?? 10
        );

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        return response()->json($query->get());
    }

    public function getNearbyBloodBanks(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'numeric|min:1|max:50',
            'city' => 'string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Hospital::withBloodBank()->nearby(
            $request->latitude,
            $request->longitude,
            $request->radius ?? 10
        );

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        return response()->json($query->get());
    }

    public function getNearbyRequests(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'numeric|min:1|max:50',
            'blood_type' => 'string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = BloodRequest::where('status', 'active')
            ->selectRaw(
                "*, (6371 * acos(cos(radians(?)) 
                * cos(radians(latitude)) 
                * cos(radians(longitude) - radians(?)) 
                + sin(radians(?)) 
                * sin(radians(latitude)))) AS distance",
                [$request->latitude, $request->longitude, $request->latitude]
            )
            ->having('distance', '<=', $request->radius ?? 10)
            ->orderBy('distance');

        if ($request->blood_type) {
            $query->where('blood_type', $request->blood_type);
        }

        return response()->json($query->get());
    }
}
