# E-Commerce Server API

Backend API for the E-Commerce platform, built with NestJS and PostgreSQL.

## Features

- RESTful API design
- JWT authentication
- Role-based access control
- Database integration with Prisma ORM
- Comprehensive error handling
- Logging system
- Environment configuration

## Tech Stack

**Framework:** [NestJS](https://nestjs.com/)

**Database:** PostgreSQL

**ORM:** [Prisma](https://www.prisma.io/)

**Authentication:** JWT

**Validation:** class-validator

**Logging:** Winston

## Project Setup

### Environment Variables

Create a `.env` file in the root of the server app with the following variables:

```
# App configuration
APP_PORT=10086

# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Password hashing
PASS_SALT=your_password_salt
```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the development server
pnpm start:dev

# Build for production
pnpm build

# Start the production server
pnpm start:prod
```

## API Documentation

The API is organized into modules:

### Authentication

- `POST /api/v1/manage/auth/signIn` - Sign in with username/email/phone and password
- `GET /api/v1/manage/auth/signOut` - Sign out
- `GET /api/v1/manage/auth/getUserInfo` - Get current user information
- `GET /api/v1/manage/auth/refreshToken` - Refresh access token

### Users

- `GET /api/v1/manage/users/list` - Get all users
- `GET /api/v1/manage/users/page` - Get paginated users
- `GET /api/v1/manage/users/:id` - Get user by ID
- `POST /api/v1/manage/users` - Create a new user
- `PUT /api/v1/manage/users/:id` - Update a user
- `DELETE /api/v1/manage/users/:id` - Delete a user

### Products

- `GET /api/v1/manage/products/list` - Get all products
- `GET /api/v1/manage/products/page` - Get paginated products
- `GET /api/v1/manage/products/:id` - Get product by ID
- `POST /api/v1/manage/products` - Create a new product
- `PUT /api/v1/manage/products/:id` - Update a product
- `DELETE /api/v1/manage/products/:id` - Delete a product

### Categories

- `GET /api/v1/manage/categories` - Get all categories
- `GET /api/v1/manage/categories/:id` - Get category by ID
- `POST /api/v1/manage/categories` - Create a new category
- `PUT /api/v1/manage/categories/:id` - Update a category
- `DELETE /api/v1/manage/categories/:id` - Delete a category

### Orders

- `GET /api/v1/manage/orders/list` - Get all orders
- `GET /api/v1/manage/orders/page` - Get paginated orders
- `GET /api/v1/manage/orders/:id` - Get order by ID
- `PUT /api/v1/manage/orders/:id/status` - Update order status
- `GET /api/v1/manage/orders/statistics` - Get order statistics

### Consumers

- `GET /api/v1/manage/consumers/list` - Get all consumers
- `GET /api/v1/manage/consumers/page` - Get paginated consumers
- `GET /api/v1/manage/consumers/:id` - Get consumer by ID
- `POST /api/v1/manage/consumers` - Create a new consumer
- `PUT /api/v1/manage/consumers/:id` - Update a consumer
- `DELETE /api/v1/manage/consumers/:id` - Delete a consumer
- `GET /api/v1/manage/consumers/statistics` - Get consumer statistics

## Authentication

The API uses JWT for authentication. The authentication flow is as follows:

1. Client sends credentials to `/api/v1/manage/auth/signIn`
2. Server validates credentials and returns access token and refresh token
3. Client includes access token in Authorization header for subsequent requests
4. When access token expires, client uses refresh token to get a new access token

## Error Handling

The API uses a standardized error response format:

```json
{
  "code": 400,
  "data": null,
  "message": "Error message",
  "timestamp": "2023-07-01T12:00:00.000Z",
  "path": "/api/v1/manage/users",
  "method": "POST"
}
```

Common error codes:
- 400: Bad Request (validation error)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error
