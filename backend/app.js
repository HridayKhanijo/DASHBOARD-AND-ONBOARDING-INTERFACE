import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { StatusCodes } from 'http-status-codes';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import ApiError from './utils/apiError.js';
import logger from './utils/logger.js';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 - Not Found
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
