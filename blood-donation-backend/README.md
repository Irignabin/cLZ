# 🩸 Smart Blood Bank – Blood Donation Backend

Welcome to the backend system of **Smart Blood Bank**, an intelligent platform built to bridge the gap between blood donors and recipients using real-time geolocation, secure APIs, and powerful search capabilities.

This Laravel-based RESTful API allows users to register as blood donors, request blood based on urgency and location, and manage data securely with role-based access.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the App](#-running-the-app)
- [API Overview](#-api-overview)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🔍 **Geographic Donor Search** – Find eligible donors within 1–50km radius
- 📍 **Live Location Tracking** – Store and use donor's geolocation (lat/lng)
- 🩸 **Blood Request System** – Raise and manage urgent blood requests
- 🔐 **Token-Based Auth** – Secure access using Laravel Sanctum
- 📬 **Email Notifications** – Notify donors when a matching request is made
- 🧾 **Role Management** – Differentiate between donors, hospitals, admins
- 📊 **Analytics-Ready APIs** – Filter by blood type, location, and status
- 📦 **Modular Design** – Clean code, reusable services, scalable structure

---

## 🛠️ Tech Stack

- Laravel 11+
- PHP 8.2+
- MySQL / MariaDB
- Sanctum – for API authentication
- Laravel Notifications
- Eloquent ORM
- GeoSearch (Haversine Formula)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blood-donation-backend.git
cd blood-donation-backend
```

### 2. Install dependencies

```bash
composer install
```

### 3. Set up environment file

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Update `.env` with your database credentials:

```dotenv
APP_NAME=Smart Blood Bank
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blood_bank
DB_USERNAME=root
DB_PASSWORD=
```

---

## 🗃️ Database Setup

Run migrations and optionally seed default roles or users:

```bash
php artisan migrate --seed
```

---

## 🧪 Running the App

```bash
php artisan serve
```

Your backend is now running at `http://127.0.0.1:8000`.

You can test APIs using Postman or any REST client.

---

## 📡 API Overview

| Method | Endpoint                  | Description                          | Auth |
|--------|---------------------------|--------------------------------------|------|
| GET    | `/api/donors/nearby`      | Get donors within selected radius    | ✅   |
| POST   | `/api/donors/register`    | Register a new blood donor           | ❌   |
| POST   | `/api/request`            | Request blood from nearby donors     | ✅   |
| GET    | `/api/user`               | Get current authenticated user       | ✅   |
| GET    | `/api/requests`           | List blood requests                  | ✅   |
| POST   | `/api/login`              | Authenticate and receive token       | ❌   |
| POST   | `/api/logout`             | Revoke token and logout              | ✅   |

> Full API documentation available in the `/docs` folder or [Postman collection](#) (optional link)

---

## 🧠 Future Enhancements

- 🤖 AI-based donor availability prediction
- 📱 Mobile app integration (React Native / Flutter)
- 📍 Real-time map view with donor pins
- 🕵️‍♂️ Fraud detection & donor verification
- 🧾 Blood bank certification and document uploads

---

## 🤝 Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

> Please make sure to run tests and follow coding conventions.

---

## 🪪 License

This project is licensed under the MIT License.  
Feel free to use it, improve it, and contribute back!

---

## 💌 Credits

Maintained with ❤️ by [Neon, Nabin, Bishal]
