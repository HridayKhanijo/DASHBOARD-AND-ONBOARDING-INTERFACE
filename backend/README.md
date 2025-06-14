# Onboarding App - Backend

This is the backend service for the Onboarding App, built with Node.js, Express, and MongoDB. It provides a RESTful API for user authentication, onboarding, and profile management.

## Features

- **User Authentication**
  - JWT-based authentication
  - User registration and login
  - Password reset functionality
  - Email verification
  - Protected routes

- **User Management**
  - Profile management
  - Role-based access control
  - User preferences

- **Onboarding**
  - Multi-step onboarding process
  - Company information collection
  - Preference selection

- **Security**
  - Password hashing with bcrypt
  - Rate limiting
  - Data sanitization
  - Helmet for HTTP headers
  - CORS protection

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000` by default.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/onboarding_app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (for production)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password
SMTP_FROM_NAME=Onboarding App
SMTP_FROM=no-reply@example.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm test` - Run tests
- `npm run lint` - Lint the codebase
- `npm run format` - Format the code

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── views/            # Email templates
├── .env              # Environment variables
├── app.js            # Express app setup
└── server.js         # Server entry point
```

## Error Handling

All errors are handled by the error handling middleware in `middleware/error.middleware.js`. The API returns JSON responses with the following structure:

```json
{
  "status": "error",
  "message": "Error message",
  "stack": "Error stack trace (in development)"
}
```

## Logging

Logs are stored in the `logs/` directory with the following files:
- `application-*.log` - Application logs (rotated daily)
- `error.log` - Error logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## Security Best Practices

- Use HTTPS in production
- Set secure flags on cookies
- Implement rate limiting
- Use Helmet for HTTP headers
- Validate and sanitize all user input

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
