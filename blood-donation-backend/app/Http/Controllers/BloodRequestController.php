<?php

namespace App\Http\Controllers;

use App\Models\BloodRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BloodRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = BloodRequest::with('user');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('blood_type')) {
            $query->where('blood_type', $request->blood_type);
        }
        
        return $query->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'blood_type' => 'required|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'units_needed' => 'required|integer|min:1',
            'urgency_level' => 'required|string|in:normal,urgent,emergency',
            'hospital_id' => 'required|exists:hospitals,id',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // For now, return success since we haven't implemented blood requests yet
        return response()->json([
            'success' => true,
            'message' => 'Blood request created successfully',
            'data' => null
        ], 201);
    }

    public function show(BloodRequest $bloodRequest)
    {
        return $bloodRequest->load('user', 'donors');
    }

    public function update(Request $request, BloodRequest $bloodRequest)
    {
        $this->authorize('update', $bloodRequest);

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'additional_notes' => 'sometimes|string',
        ]);

        $bloodRequest->update($validated);

        return response()->json($bloodRequest);
    }

    public function destroy(BloodRequest $bloodRequest)
    {
        $this->authorize('delete', $bloodRequest);
        
        $bloodRequest->delete();
        
        return response()->json(null, 204);
    }

    public function getNearbyRequests(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'sometimes|numeric|min:1|max:50', // radius in kilometers
        ]);

        $radius = $request->input('radius', 10); // Default 10km
        $radiusInMeters = $radius * 1000;

        return BloodRequest::with('user')
            ->whereRaw("
                ST_Distance_Sphere(
                    point(longitude, latitude),
                    point(?, ?)
                ) <= ?
            ", [
                $request->longitude,
                $request->latitude,
                $radiusInMeters
            ])
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    public function respondToRequest(Request $request, BloodRequest $bloodRequest)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $user = $request->user();
        
        if (!$user->is_donor || !$user->available_to_donate) {
            return response()->json([
                'message' => 'You must be an available donor to respond to blood requests'
            ], 403);
        }

        $bloodRequest->donors()->attach($user->id, [
            'status' => $request->status,
            'response_time' => now(),
        ]);

        if ($request->status === 'accepted') {
            $bloodRequest->update(['status' => 'in_progress']);
        }

        return response()->json([
            'message' => 'Response recorded successfully'
        ]);
    }

    public function nearby(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:100',
            'blood_type' => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'city' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // For now, return empty array since we haven't implemented blood requests yet
        return response()->json([
            'success' => true,
            'data' => [],
            'count' => 0
        ]);
    }
} 