import pino from 'pino';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { envConfig } from '#config/env-config.js';
import packageJson from '../../package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDir = join(__dirname, '../../logs');

// Error serializer for development environment
export const errorSerializerDev = (error) => {
  const serialized = {
    message: error.message,
    stack: error.stack,
    type: error.name,
  };

  // Add AppError fields if present
  if (error.statusCode) serialized['statusCode'] = error.statusCode;
  if (error.errorCode) serialized['errorCode'] = error.errorCode;
  if (error.details) serialized['details'] = error.details;
  if (error.timestamp) serialized['timestamp'] = error.timestamp;
  if (error.isOperational) serialized['isOperational'] = error.isOperational;

  // Capture error cause chain
  if (error.cause) {
    serialized['cause'] =
      error.cause instanceof Error
        ? errorSerializerDev(error.cause)
        : error.cause;
  }

  return serialized;
};

// Error serializer for production environment
export const errorSerializerProd = (error) => {
  const serialized = {
    message: error.message,
    type: error.name,
  };

  // Essential fields
  if (error.statusCode) serialized['statusCode'] = error.statusCode;
  if (error.errorCode) serialized['errorCode'] = error.errorCode;
  if (error.isOperational) serialized['isOperational'] = error.isOperational;

  // Include details only for operational errors
  if (error.details && error.isOperational) {
    serialized['details'] = error.details;
  }

  // Include stack trace for 5xx errors in production
  if (error.statusCode && error.statusCode >= 500) {
    serialized['stack'] = error.stack;

    // Capture error cause chain
    if (error.cause) {
      serialized['cause'] =
        error.cause instanceof Error
          ? errorSerializerProd(error.cause)
          : error.cause;
    }
  }

  return serialized;
};

// Create logger based on environment
const createLogger = (config) => {
  const { NODE_ENV, LOG_LEVEL, isProd, isDev, isTest } = config;

  const pinoConfig = {
    enabled: !isTest,
    formatters: {
      bindings: ({ hostname, pid }) => ({
        pid,
        hostname,
        env: NODE_ENV,
        version: packageJson.version,
      }),
    },
    level: LOG_LEVEL,
    serializers: {
      err: isProd ? errorSerializerProd : errorSerializerDev,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  if (isDev) {
    pinoConfig.transport = {
      targets: [
        {
          level: LOG_LEVEL,
          options: {
            colorize: true,
            errorProps: 'statusCode,errorCode,details,cause',
            ignore: 'pid,hostname',
            translateTime: 'yyyy-mm-dd HH:MM:ss',
          },
          target: 'pino-pretty',
        },
        {
          level: LOG_LEVEL,
          options: {
            dateFormat: 'yyyy-MM-dd-hh-mm',
            file: join(logDir, 'dev.jsonl'),
            frequency: 'daily',
            limit: { count: 7 },
            mkdir: true,
          },
          target: 'pino-roll',
        },
      ],
    };
  }

  if (isProd) {
    pinoConfig.transport = {
      targets: [
        {
          level: LOG_LEVEL,
          options: {
            destination: 1,
          },
          target: 'pino/file',
        },
        {
          level: LOG_LEVEL,
          options: {
            dateFormat: 'yyyy-MM-dd-hh-mm',
            file: join(logDir, 'prod.jsonl'),
            frequency: 'daily',
            limit: { count: 7 },
            mkdir: true,
          },
          target: 'pino-roll',
        },
      ],
      worker: { autoEnd: true },
    };
    pinoConfig.redact = {
      paths: [
        // Sensitive fields
        '*.password',
        '*.token',
        '*.apiKey',
        '*.secret',
        '*.accessToken',
        '*.refreshToken',
        '*.privateKey',

        // HTTP headers
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
        'res.headers["set-cookie"]',

        // Request body fields
        'req.body.password',
        'req.body.token',
      ],
      remove: true,
    };
  }

  const logger = pino(pinoConfig);

  logger
    .child({ service: 'logger' })
    .info(
      `logger: initialized in ${NODE_ENV} mode with log level ${LOG_LEVEL}`
    );

  return logger;
};

export const logger = createLogger(envConfig);

export const createChild = (bindings) => logger.child(bindings);
