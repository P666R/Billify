import 'dotenv/config';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { connectionToDB } from './config/connect-db.js';
import { morganMiddleware, systemLogs } from './utils/logger.js';

const PORT = process.env.PORT || 1997;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Connect to database
await connectionToDB();

// Initialize express app
const app = express();

// Logger instance for server logs
const logger = systemLogs.child({ service: 'server' });

NODE_ENV === 'development' && app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(morganMiddleware);

app.get('/api/v1/test', (_req, res) => {
  res.status(200).json({ message: 'API is working properly' });
});

app.listen(PORT, () => {
  logger.info(`server: running in ${NODE_ENV} mode on port ${PORT}`);
});
