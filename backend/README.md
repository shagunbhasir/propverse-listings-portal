# Propverse Listings Portal Backend

This is the backend API for the Propverse Listings Portal, built using the Slim Framework.

## Requirements

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Composer

## Installation

1. Install dependencies:
```
composer install
```

2. Create a `.env` file in the root directory of the backend with the following variables:
```
DB_HOST=localhost
DB_NAME=propverse
DB_USER=your_mysql_username
DB_PASS=your_mysql_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400
```

3. Create the database and tables using the provided SQL script:
```
mysql -u root -p < database.sql
```

## Running the Application

Start the development server:
```
composer start
```

This will start the server at `http://localhost:8080`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### Properties

- `GET /api/properties` - Get all properties (supports filtering)
- `GET /api/properties/{id}` - Get a specific property
- `POST /api/properties` - Create a new property (requires authentication)
- `PUT /api/properties/{id}` - Update an existing property (requires authentication)
- `DELETE /api/properties/{id}` - Delete a property (requires authentication)

## Query Parameters for Filtering Properties

- `search` - Search by title, location, or type
- `min_price` - Minimum price
- `max_price` - Maximum price
- `property_types` - Comma-separated list of property types (apartment, flat, pg, hostel)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
``` 