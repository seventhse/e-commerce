# E-Commerce Admin Dashboard

Admin Dashboard for the E-Commerce platform, built with React, Vite, and ShadcnUI. This dashboard provides a comprehensive interface for managing the e-commerce platform.

## Features

- Light/dark mode
- Responsive design
- Authentication with JWT
- User management
- Product management
- Order management
- Customer management
- Dashboard analytics
- Global Search Command
- Built-in Sidebar component

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)

**HTTP Client:** [Axios](https://axios-http.com/)

**State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [Eslint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

## Project Setup

### Environment Variables

Create a `.env` file in the root of the admin app with the following variables:

```
VITE_API_URL=http://localhost:10086/api
```

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production
pnpm build

# Preview the production build
pnpm preview
```

## API Integration

The admin dashboard connects to the NestJS backend API. The API client is configured in `src/lib/api-client.ts` and uses Axios for HTTP requests.

Services are organized by domain:

- `auth.service.ts` - Authentication and user management
- `user.service.ts` - Admin user management
- `product.service.ts` - Product and category management
- `order.service.ts` - Order management
- `consumer.service.ts` - Customer management

## Authentication

The admin dashboard uses JWT authentication. The authentication flow is as follows:

1. User logs in with email/username and password
2. Server returns access token and refresh token
3. Access token is stored in memory and used for API requests
4. Refresh token is used to get a new access token when the current one expires

## Routing

The app uses TanStack Router for routing. Routes are defined in the `src/routes` directory.

Protected routes are wrapped in the `_authenticated` layout, which checks for authentication before rendering the route.
