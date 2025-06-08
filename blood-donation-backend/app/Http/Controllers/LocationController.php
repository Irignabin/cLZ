<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LocationController extends Controller
{
    private $googleMapsApiKey;

    public function __construct()
    {
        $this->googleMapsApiKey = config('services.google.maps_api_key');
    }

    public function getNearbyHospitals(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'sometimes|numeric|min:1|max:50', // radius in kilometers
        ]);

        $radius = $request->input('radius', 5) * 1000; // Convert to meters

        $response = Http::get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', [
            'location' => "{$request->latitude},{$request->longitude}",
            'radius' => $radius,
            'type' => 'hospital',
            'key' => $this->googleMapsApiKey
        ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch nearby hospitals'
            ], 500);
        }

        $hospitals = collect($response->json()['results'])->map(function ($hospital) {
            return [
                'name' => $hospital['name'],
                'address' => $hospital['vicinity'],
                'latitude' => $hospital['geometry']['location']['lat'],
                'longitude' => $hospital['geometry']['location']['lng'],
                'rating' => $hospital['rating'] ?? null,
                'place_id' => $hospital['place_id'],
            ];
        });

        return response()->json($hospitals);
    }

    public function getNearbyBloodBanks(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'sometimes|numeric|min:1|max:50', // radius in kilometers
        ]);

        $radius = $request->input('radius', 5) * 1000; // Convert to meters

        $response = Http::get('https://maps.googleapis.com/maps/api/place/textsearch/json', [
            'query' => 'blood bank',
            'location' => "{$request->latitude},{$request->longitude}",
            'radius' => $radius,
            'key' => $this->googleMapsApiKey
        ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to fetch nearby blood banks'
            ], 500);
        }

        $bloodBanks = collect($response->json()['results'])->map(function ($bloodBank) {
            return [
                'name' => $bloodBank['name'],
                'address' => $bloodBank['formatted_address'],
                'latitude' => $bloodBank['geometry']['location']['lat'],
                'longitude' => $bloodBank['geometry']['location']['lng'],
                'rating' => $bloodBank['rating'] ?? null,
                'place_id' => $bloodBank['place_id'],
            ];
        });

        return response()->json($bloodBanks);
    }
} 