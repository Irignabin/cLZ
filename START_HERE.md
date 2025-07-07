# How to Start the Blood Donation System

## Step 1:   Start XAMPP
1. Open XAMPP Control Panel
   - Double click on XAMPP icon on desktop or
   - Run: C:\xampp\xampp-control.exe
2. Start Apache and MySQL
   - Click "Start" button next to Apache
   - Click "Start" button next to MySQL
3. Wait until both show green status

## Step 2: Start Laravel Backend
1. Open Command Prompt as Administrator
2. Navigate to the backend folder:
   ```
   cd C:\Users\user\Desktop\projectclz\blood-donation-backend
   ```
3. Start Laravel server:
   ```
   C:\xampp\php\php.exe artisan serve
   ```
4. Keep this window open

## Step 3: Start React Frontend
1. Open another Command Prompt
2. Navigate to the frontend folder:
   ```
   cd C:\Users\user\Desktop\projectclz\blood-donation-app
   ```
3. Start React development server:
   ```
   npm start
   ```
4. Keep this window open

## Verify Everything is Running
1. Check XAMPP:
   - Apache and MySQL should show green in XAMPP Control Panel
   - Open http://localhost/phpmyadmin in browser

2. Check Laravel Backend:
   - Open http://localhost:8000 in browser
   - Should see Laravel welcome page

3. Check React Frontend:
   - Open http://localhost:3000 in browser
   - Should see Blood Donation System homepage

## Troubleshooting
1. If XAMPP services won't start:
   - Check if ports 80 and 3306 are free
   - Try stopping and starting services again

2. If Laravel won't start:
   - Make sure you're using the correct PHP path
   - Check if port 8000 is free

3. If React won't start:
   - Make sure Node.js is installed
   - Try running `npm install` first
   - Check if port 3000 is free 
