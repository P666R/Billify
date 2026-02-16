import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
} from '#middlewares/error-middleware.js';
import { createChild } from '#utils/logger.js';
import { envConfig } from '#config/env-config.js';
import { authRouter } from '#routes/auth-routes.js';
import { connectionToDB } from '#config/connect-db.js';
import { httpLoggingMiddleware } from '#middlewares/logging-middleware.js';

const { PORT, NODE_ENV } = envConfig;

// Logger instance for server logs
const logger = createChild({ service: 'server' });

// Connect to database
await connectionToDB();

// Initialize express app
const app = express();

// Trust proxy sent by nginx
// 1 represents the single hop from Nginx container to API container
app.set('trust proxy', 1);

// Middlewares
app.use(httpLoggingMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.get('/api/v1/test', (_req, res) => {
  res.status(200).json({ message: 'Welcome to the Billify API' });
});

app.use('/api/v1/auth', authRouter);

// Error handlers
app.use(notFoundHandlerMiddleware);
app.use(errorHandlerMiddleware);

// Start server
app.listen(PORT, () => {
  logger.info(`server: running in ${NODE_ENV} mode on port ${PORT}`);
});
