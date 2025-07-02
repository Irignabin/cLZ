<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all donors without coordinates
        $donors = DB::table('donors')
            ->whereNull('latitude')
            ->orWhere('latitude', 0)
            ->orWhereNull('longitude')
            ->orWhere('longitude', 0)
            ->get();

        foreach ($donors as $donor) {
            // Default coordinates for Nepal (center point)
            $lat = 28.3949;  // Default latitude for Nepal
            $lng = 84.1240;  // Default longitude for Nepal

            // Update donor with default coordinates
            DB::table('donors')
                ->where('id', $donor->id)
                ->update([
                    'latitude' => $lat,
                    'longitude' => $lng,
                    'updated_at' => now()
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this migration as it's just data update
    }
};
