<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DonorController;
// use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BloodRequestController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\BloodBankController;
use App\Http\Controllers\Api\LocationController as ApiLocationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Response;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function(){
    return response()->json([
        'status' => "Authentication required",
        'message' => "Needs client side login to access this route"
    ], 403);
});

// Public search routes
Route::get('/donors/nearby', [DonorController::class, 'search']);
Route::get('/hospitals/nearby', [HospitalController::class, 'index']);
Route::get('/blood-banks/nearby', [HospitalController::class, 'bloodBanks']);
Route::get('/requests/nearby', [BloodRequestController::class, 'nearby']);

// Location-based routes (public)
Route::prefix('locations')->group(function () {
    Route::get('/donors', [ApiLocationController::class, 'getNearbyDonors']);
    Route::get('/hospitals', [ApiLocationController::class, 'getNearbyHospitals']);
    Route::get('/blood-banks', [ApiLocationController::class, 'getNearbyBloodBanks']);
    Route::get('/requests', [ApiLocationController::class, 'getNearbyRequests']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/validate-token', [AuthController::class, 'validateToken']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // User routes
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/location', [AuthController::class, 'updateLocation']);

    // User dashboard routes
    Route::prefix('user/dashboard')->group(function () {
        Route::get('/stats', [UserController::class, 'getDashboardStats']);
        Route::get('/activity', [UserController::class, 'getDashboardActivity']);
    });

    // Donor routes
    Route::prefix('donors')->group(function () {
        Route::post('/', [DonorController::class, 'store']);
        Route::get('/', [DonorController::class, 'index']);
        Route::get('/{id}', [DonorController::class, 'show']);
        Route::put('/{id}', [DonorController::class, 'update']);
        Route::delete('/{id}', [DonorController::class, 'destroy']);
    });

    // Blood request routes
    Route::prefix('blood-requests')->group(function () {
        Route::post('/', [BloodRequestController::class, 'store']);
        Route::get('/', [BloodRequestController::class, 'index']);
        Route::get('/{id}', [BloodRequestController::class, 'show']);
        Route::put('/{id}', [BloodRequestController::class, 'update']);
        Route::delete('/{id}', [BloodRequestController::class, 'destroy']);
    });
    
    // Hospital routes
    Route::post('/hospitals', [HospitalController::class, 'store']);
    Route::post('/hospitals/seed', [HospitalController::class, 'seedHospitals']);
}); 