<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use PDO;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (DB::connection()->getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
            // Register math functions for SQLite
            DB::connection()->getPdo()->sqliteCreateFunction('cos', 'cos');
            DB::connection()->getPdo()->sqliteCreateFunction('acos', 'acos');
            DB::connection()->getPdo()->sqliteCreateFunction('sin', 'sin');
            DB::connection()->getPdo()->sqliteCreateFunction('radians', function($value) {
                return deg2rad($value);
            });
        }
    }
}
