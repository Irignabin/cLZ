# Deployment Guide for Blood Donation System

## Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Deploy to Vercel:
```bash
cd blood-donation-app
vercel
```

4. Configure environment variables in Vercel dashboard:
- REACT_APP_API_URL=https://your-backend-url.com/api

## Backend Deployment (DigitalOcean)

1. Create a DigitalOcean account
2. Create a new Droplet:
   - Choose Ubuntu 20.04
   - Basic plan ($5/month is sufficient to start)
   - Choose a datacenter near your users

3. Initial server setup:
```bash
ssh root@your-server-ip
adduser laravel
usermod -aG sudo laravel
```

4. Install required software:
```bash
apt update
apt install nginx mysql-server php-fpm php-mysql composer
```

5. Configure MySQL:
```bash
mysql_secure_installation
mysql
CREATE DATABASE blood_donation_db;
CREATE USER 'blood_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON blood_donation_db.* TO 'blood_user'@'localhost';
FLUSH PRIVILEGES;
```

6. Deploy Laravel application:
```bash
cd /var/www
git clone your-backend-repo
cd your-backend-repo
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

7. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/your-backend-repo/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

8. SSL Configuration:
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## Final Steps

1. Update frontend environment variables with new backend URL
2. Test all features end-to-end
3. Monitor error logs:
   - Frontend: Vercel dashboard
   - Backend: /var/log/nginx/error.log

## Backup Strategy

1. Database backups:
```bash
mysqldump -u root -p blood_donation_db > backup.sql
```

2. Schedule daily backups:
```bash
crontab -e
0 0 * * * mysqldump -u root -p blood_donation_db > /backup/blood_donation_$(date +\%Y\%m\%d).sql
```

## Monitoring

1. Set up monitoring tools:
   - New Relic
   - Laravel Telescope
   - Server monitoring with DigitalOcean

2. Configure alerts for:
   - High server load
   - Low disk space
   - Database connection issues
   - API errors

## Security Checklist

✅ SSL certificates installed
✅ Database passwords secured
✅ Environment variables configured
✅ File permissions set correctly
✅ Regular security updates enabled
✅ API rate limiting configured
✅ CORS policies set up 