# Blood Donation Project Setup Guide

## 1. Backend Setup (Laravel)

### Database Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blood_donation_db
DB_USERNAME=root
DB_PASSWORD=
```

### Required API Endpoints
```php
/api/auth/login
/api/auth/register
/api/donors
/api/requests
/api/inventory
```

### Models Required
- User
- Donor
- BloodInventory
- BloodRequest
- Donation
- Notification

## 2. Frontend Setup (React)

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### API Integration Points
- Authentication Service
- Donor Service
- Request Service
- Inventory Service

## 3. Deployment Steps

### Backend Deployment (Laravel)
1. Choose hosting (DigitalOcean/Heroku)
2. Configure environment variables
3. Set up MySQL database
4. Deploy Laravel application

### Frontend Deployment (React)
1. Build React application
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Connect to backend API

## 4. Security Considerations
- CORS configuration
- JWT authentication
- API rate limiting
- SSL certificates

## 5. Performance Optimization
- Database indexing
- API caching
- Image optimization
- Code splitting 