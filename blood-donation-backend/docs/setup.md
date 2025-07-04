# Setup Guide

This guide will help you set up the Smart Blood Bank backend on your local machine.

## Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL or MariaDB
- Git

## Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/blood-donation-backend.git
cd blood-donation-backend
```

2. **Install dependencies**

```bash
composer install
```

3. **Create environment file**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure `.env`**

Update your `.env` with your database credentials and app URL:

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

5. **Run database migrations**

```bash
php artisan migrate --seed
```

6. **Run the application**

```bash
php artisan serve
```

The backend will be accessible at `http://localhost:8000`.

7. **View API documentation**

Visit `http://localhost:8000/docs` to see the interactive API docs generated by Scramble.

---

## Running Tests (Optional)

If you have tests set up, run:

```bash
php artisan test
```

---

## Additional Notes

- Make sure your local environment meets the PHP and database requirements.
- If you face permission issues, check file/folder ownership.