import pino from 'pino';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { envConfig } from '#config/env-config.js';
import { loggerStore } from '#helpers/context-provider.js';
import packageJson from '../../package.json' with { type: 'json' };

const { NODE_ENV, LOG_LEVEL, isProd, isDev, isTest } = envConfig;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDir = join(__dirname, '../../logs');

// Error serializer for development environment
export const errorSerializerDev = (error) => {
  const base = {
    message: error.message,
    stack: error.stack,
    type: error.name,
  };

  // Preserve known custom fields
  const fields = [
    'statusCode',
    'errorCode',
    'details',
    'timestamp',
    'isOperational',
  ];

  for (const f of fields) {
    if (error[f] !== undefined) base[f] = error[f];
  }

  // Recursively serialize a cause chain if it exists
  if (error.cause) {
    base['cause'] =
      error.cause instanceof Error
        ? errorSerializerDev(error.cause)
        : error.cause;
  }

  return base;
};

// Error serializer for production environment
export const errorSerializerProd = (error) => {
  const base = {
    message: error.message,
    type: error.name,
  };

  // Preserve known custom fields
  if (error.statusCode) base['statusCode'] = error.statusCode;
  if (error.errorCode) base['errorCode'] = error.errorCode;
  if (error.isOperational) base['isOperational'] = error.isOperational;

  // Include details only for operational (4xx) errors
  if (error.details && error.isOperational) base['details'] = error.details;

  // Include stack trace only for server (5xx) errors in production
  if (error.statusCode && error.statusCode >= 500) {
    base['stack'] = error.stack;

    // Capture error cause chain
    if (error.cause) {
      base['cause'] =
        error.cause instanceof Error
          ? errorSerializerProd(error.cause)
          : error.cause;
    }
  }

  return base;
};

// Create logger based on environment
const basePinoConfig = {
  enabled: !isTest,
  level: LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: ({ hostname, pid }) => ({
      pid,
      hostname,
      env: NODE_ENV,
      version: packageJson.version,
    }),
  },
  serializers: {
    err: isProd ? errorSerializerProd : errorSerializerDev,
  },
};

if (isDev) {
  basePinoConfig.transport = {
    targets: [
      {
        level: LOG_LEVEL,
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          errorProps: 'statusCode,errorCode,details,cause',
        },
      },
      {
        level: LOG_LEVEL,
        target: 'pino-roll',
        options: {
          dateFormat: 'yyyy-MM-dd-hh',
          file: join(logDir, 'dev'),
          frequency: 'daily',
          size: '10m',
          limit: { count: 7 },
          extension: '.jsonl',
          mkdir: true,
        },
      },
    ],
    worker: { autoEnd: true },
  };
}

if (isProd) {
  basePinoConfig.transport = {
    targets: [
      // Stdout for cloud collectors
      {
        level: LOG_LEVEL,
        target: 'pino/file',
        options: { destination: 1 },
      },
      // Rotating file for on‑disk backup (optional)
      {
        level: LOG_LEVEL,
        target: 'pino-roll',
        options: {
          dateFormat: 'yyyy-MM-dd-hh',
          file: join(logDir, 'prod'),
          frequency: 'daily',
          size: '10m',
          limit: { count: 7 },
          extension: '.jsonl',
          mkdir: true,
        },
      },
    ],
    worker: { autoEnd: true },
  };

  basePinoConfig.redact = {
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
    censor: '[REDACTED]',
  };
}

const baseLogger = pino(basePinoConfig);

baseLogger
  .child({ service: 'logger' })
  .info(`logger: initialized [mode: ${NODE_ENV}, level: ${LOG_LEVEL}]`);

export { baseLogger };

/**
 * Creates a context-aware child logger using a Memoized Proxy.
 * Merges static service data with dynamic trace IDs from AsyncLocalStorage.
 */
export const createChild = (bindings) => {
  const childLogger = baseLogger.child(bindings);

  // WeakMap ensures cached loggers are garbage collected when request ends
  const requestCache = new WeakMap();

  return new Proxy(childLogger, {
    get(target, prop) {
      const requestLogger = loggerStore.getStore();

      // 1. Context fallback (outside of HTTP requests)
      if (!requestLogger) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      }
      // 2. Check cache to avoid redundant .child() calls for same request
      let traceLogger = requestCache.get(requestLogger);

      if (!traceLogger) {
        // 3. Only extract tracing IDs, discard 'req'/'res' objects
        const { correlationId, requestId } = requestLogger.bindings();

        // 4. Create the tracing child once per request/service combination
        traceLogger = target.child({ correlationId, requestId });
        requestCache.set(requestLogger, traceLogger);
      }

      const value = traceLogger[prop];
      return typeof value === 'function' ? value.bind(traceLogger) : value;
    },
  });
};
