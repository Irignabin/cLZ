<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BloodRequest;
use App\Models\Donor;
use Carbon\Carbon;

class UserController extends Controller
{
    public function getDashboardStats(Request $request)
    {
        $user = $request->user();
        $latitude = $user->latitude;
        $longitude = $user->longitude;

        // Get nearby donors count
        $nearbyDonors = Donor::selectRaw("*, 
            (6371 * acos(cos(radians(?)) 
            * cos(radians(latitude)) 
            * cos(radians(longitude) - radians(?)) 
            + sin(radians(?)) 
            * sin(radians(latitude)))) AS distance", 
            [$latitude, $longitude, $latitude])
            ->where('is_available', true)
            ->having('distance', '<=', 10)
            ->count();

        // Get nearby requests count
        $nearbyRequests = BloodRequest::selectRaw("*, 
            (6371 * acos(cos(radians(?)) 
            * cos(radians(latitude)) 
            * cos(radians(longitude) - radians(?)) 
            + sin(radians(?)) 
            * sin(radians(latitude)))) AS distance", 
            [$latitude, $longitude, $latitude])
            ->where('status', 'active')
            ->having('distance', '<=', 10)
            ->count();

        // Get user's donation stats if they are a donor
        $totalDonations = 0;
        $lastDonationDate = null;
        $livesImpacted = 0;

        if ($user->is_donor) {
            $donor = Donor::where('user_id', $user->id)->first();
            if ($donor) {
                $totalDonations = $donor->total_donations ?? 0;
                $lastDonationDate = $donor->last_donation_date;
                $livesImpacted = $totalDonations * 3; // Assuming each donation helps 3 people
            }
        }

        return response()->json([
            'totalDonations' => $totalDonations ,
            'lastDonationDate' => $lastDonationDate ,
            'livesImpacted' => $livesImpacted,
            'nearbyRequests' => $nearbyRequests,
            'nearbyDonors' => $nearbyDonors
        ]);
    }

    public function getDashboardActivity(Request $request)
    {
        $user = $request->user();
        $activities = [];

        // Get user's blood requests
        $requests = BloodRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'type' => 'request',
                    'location' => $request->hospital_name,
                    'date' => $request->created_at,
                    'status' => $request->status,
                    'details' => [
                        'blood_type' => $request->blood_type,
                        'units' => $request->units_needed,
                        'hospital' => $request->hospital_name
                    ]
                ];
            });

        // Get user's donations if they are a donor
        if ($user->is_donor) {
            $donor = Donor::where('user_id', $user->id)->first();
            if ($donor && $donor->donation_history) {
                $donations = collect($donor->donation_history)
                    ->map(function ($donation) {
                        return [
                            'id' => $donation['id'] ?? uniqid(),
                            'type' => 'donation',
                            'location' => $donation['location'] ?? 'Unknown',
                            'date' => $donation['date'],
                            'status' => 'completed',
                            'details' => [
                                'blood_type' => $donation['blood_type'] ?? null,
                                'units' => $donation['units'] ?? 1
                            ]
                        ];
                    });
                $activities = $donations;
            }
        }

        // Combine and sort activities
        $activities = collect($activities)->concat($requests)
            ->sortByDesc('date')
            ->values()
            ->take(10);

        return response()->json($activities);
    }
} 