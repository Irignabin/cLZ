# Architecture Overview

This document provides an overview of the backend architecture for the Smart Blood Bank project.

## Project Structure

- **app/**: Contains controllers, models, services, and business logic.
- **routes/api.php**: Defines API endpoints.
- **database/migrations/**: Database schema migrations.
- **database/seeders/**: Data seeders for initial data.
- **config/**: Configuration files including Scramble for API docs.

## Key Components

- **Controllers** handle HTTP requests and responses.
- **Models** represent database tables using Eloquent ORM.
- **Services** contain reusable business logic.
- **Middleware** manage authentication and request filtering.

## Data Flow Example: Donor Search

1. Client calls `/api/donors/nearby` with `latitude`, `longitude`, and `radius`.
2. Controller validates inputs and queries the donor database.
3. Donors within the radius are retrieved using the Haversine formula.
4. Response is sent back with matching donors.

## Design Patterns Used

- MVC (Model-View-Controller)
- Repository pattern (optional, if implemented)
- Service Layer for business logic separation

---

For detailed API docs, please refer to the auto-generated Scramble documentation at `/docs`.