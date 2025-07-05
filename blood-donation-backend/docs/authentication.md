# Authentication Details

The Smart Blood Bank backend uses **Laravel Sanctum** for API authentication.

## How Authentication Works

- Users log in via `/api/login` endpoint.
- A personal access token is generated and returned.
- This token must be included in the `Authorization` header for protected routes.

Example header:

```
Authorization: Bearer your-token-here
```

## Protected Endpoints

Most data modification endpoints require authentication, such as:

- `/api/request` (Request blood)
- `/api/donors/nearby` (Nearby donor search)
- `/api/requests` (View requests)
- `/api/logout` (Logout)

Public endpoints include:

- `/api/donors/register` (Donor registration)
- `/api/login` (Login)

---

## Managing Roles and Permissions

Currently, roles include:

- Donor
- Hospital
- Admin

Role-based access is implemented via middleware and policies (expandable).

---

## Getting a Token Example

```bash
curl -X POST http://localhost:8000/api/login \
 -d "email=your-email@example.com" \
 -d "password=your-password"
```

---

## Revoking Tokens

Logout endpoint `/api/logout` revokes the token.