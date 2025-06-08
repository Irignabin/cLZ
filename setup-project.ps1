# Setup Script for Blood Donation System
Write-Host "Setting up Blood Donation System..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check and start XAMPP services
Write-Host "Starting XAMPP services..." -ForegroundColor Yellow
if (Test-Path "C:\xampp\xampp-control.exe") {
    Start-Process "C:\xampp\xampp-control.exe"
    Write-Host "Please start Apache and MySQL in XAMPP Control Panel" -ForegroundColor Yellow
    Read-Host "Press Enter after starting Apache and MySQL"
} else {
    Write-Host "XAMPP not found. Please install XAMPP first." -ForegroundColor Red
    exit 1
}

# Download and install Composer if not installed
if (-not (Test-Command composer)) {
    Write-Host "Installing Composer..." -ForegroundColor Yellow
    $composerInstaller = "composer-setup.exe"
    Invoke-WebRequest -Uri "https://getcomposer.org/Composer-Setup.exe" -OutFile $composerInstaller
    Start-Process -Wait -FilePath ".\$composerInstaller"
    Remove-Item $composerInstaller
}

# Set up Laravel Backend
Write-Host "Setting up Laravel Backend..." -ForegroundColor Yellow
if (Test-Path "blood-donation-backend") {
    Remove-Item -Recurse -Force "blood-donation-backend"
}

# Create new Laravel project
Set-Location "C:\Users\user\Desktop\projectclz"
& "C:\xampp\php\php.exe" "C:\ProgramData\ComposerSetup\bin\composer.phar" create-project laravel/laravel blood-donation-backend
Set-Location "blood-donation-backend"

# Configure .env file
$envContent = @"
APP_NAME=BloodDonationSystem
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blood_donation_db
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

# Generate application key
& "C:\xampp\php\php.exe" artisan key:generate

# Run database migrations
& "C:\xampp\php\php.exe" artisan migrate

# Start Laravel server
Start-Process "C:\xampp\php\php.exe" -ArgumentList "artisan serve" -NoNewWindow

Write-Host "Laravel backend is set up and running!" -ForegroundColor Green

# Set up React Frontend
Write-Host "Setting up React Frontend..." -ForegroundColor Yellow
if (Test-Path "blood-donation-app") {
    Set-Location "blood-donation-app"
    npm install
} else {
    npx create-react-app blood-donation-app --template typescript
    Set-Location "blood-donation-app"
    npm install @mui/material @emotion/react @emotion/styled axios react-router-dom @types/react-router-dom
}

# Start React development server
npm start

Write-Host "Setup complete! The system is now running." -ForegroundColor Green
Write-Host "Access the applications at:" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Database: http://localhost/phpmyadmin" -ForegroundColor Cyan 