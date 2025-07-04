<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'blood_type' => 'nullable|string|max:5',
                'is_donor' => 'boolean',
                'address' => 'nullable|string|max:255',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
            ]);

            // Check if user exists but was soft deleted
            $existingUser = User::withTrashed()->where('email', $request->email)->first();
            if ($existingUser) {
                if ($existingUser->trashed()) {
                    $existingUser->restore();
                    $existingUser->update([
                        'name' => $request->name,
                        'password' => Hash::make($request->password),
                        'phone' => $request->phone,
                        'blood_type' => $request->blood_type,
                        'is_donor' => $request->is_donor,
                        'address' => $request->address,
                        'latitude' => $request->latitude,
                        'longitude' => $request->longitude,
                    ]);
                    $user = $existingUser;
                } else {
                    return response()->json([
                        'data' => null,
                        'message' => 'This email is already registered. Please login instead.',
                        'status' => 422
                    ], 422);
                }
            } else {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'phone' => $request->phone,
                    'blood_type' => $request->blood_type,
                    'is_donor' => $request->is_donor,
                    'address' => $request->address,
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                ]);
            }

            // Revoke any existing tokens
            $user->tokens()->delete();
            
            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'data' => [
                    'user' => $user,
                    'token' => $token
                ],
                'message' => 'Registration successful',
                'status' => 201
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'data' => null,
                'message' => $e->errors()['email'][0] ?? 'Validation failed',
                'status' => 422
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'message' => 'An error occurred during registration.',
                'status' => 500
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required|string',
            ], [
                'email.exists' => 'No account found with this email address.',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'data' => null,
                    'message' => 'The provided credentials are incorrect.',
                    'status' => 401
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            
            // Revoke any existing tokens
            $user->tokens()->delete();
            
            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'data' => [
                    'user' => $user,
                    'token' => $token
                ],
                'message' => 'Login successful',
                'status' => 200
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'data' => null,
                'message' => $e->errors()['email'][0] ?? 'Validation failed',
                'status' => 422
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'message' => 'An error occurred during login.',
                'status' => 500
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Revoke all tokens
            $request->user()->tokens()->delete();
            
            return response()->json([
                'data' => null,
                'message' => 'Successfully logged out',
                'status' => 200
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'message' => 'An error occurred during logout.',
                'status' => 500
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json([
            'data' => [
                'user' => $request->user()
            ],
            'message' => 'User profile retrieved successfully',
            'status' => 200
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            $data = $request->validate([
                'name' => 'string|max:255',
                'blood_type' => 'string|max:5',
                'phone' => 'string|max:20',
                'address' => 'string|max:255',
                'city' => 'string|max:255',
                'is_donor' => 'boolean',
                'available_to_donate' => 'boolean',
            ]);
            
            $user->update($data);
            
            return response()->json([
                'data' => [
                    'user' => $user
                ],
                'message' => 'Profile updated successfully',
                'status' => 200
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'data' => null,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'status' => 422
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
                'message' => 'An error occurred while updating profile.',
                'status' => 500
            ], 500);
        }
    }

    public function validateToken(Request $request)
    {
        try {
            $user = $request->user();
            return response()->json([
                'valid' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid token'
            ], 401);
        }
    }
} 