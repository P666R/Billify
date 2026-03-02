import { randomUUID } from 'node:crypto';
import {
  createChild,
  errorSerializerDev,
  errorSerializerProd,
} from '#utils/logger.js';
import { pinoHttp } from 'pino-http';
import { AppError } from '#utils/app-error.js';
import { envConfig } from '#config/env-config.js';
import { loggerStore } from '#helpers/context-provider.js';

const { isProd } = envConfig;

export const httpLoggingMiddleware = () => {
  const pino = pinoHttp({
    autoLogging: {
      ignore: (req) => {
        const ignoredPaths = ['/health', '/metrics', '/favicon.ico'];
        return ignoredPaths.includes(req.url);
      },
    },
    customAttributeKeys: {
      err: 'err',
      req: 'req',
      res: 'res',
      responseTime: 'durationMs',
    },

    customReceivedMessage: () => {
      return '→ Incoming Request';
    },

    customSuccessMessage: () => {
      return '← Request Completed';
    },

    customErrorMessage: (_req, _res, err) => {
      const errorCode =
        err instanceof AppError ? err.errorCode : 'UNKNOWN_ERROR';
      return `✗ Request Failed [${errorCode}]`;
    },

    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      // If the user did something wrong (4xx), it's just info to avoid alert fatigue
      if (res.statusCode >= 400) return 'info';
      return 'info';
    },

    // Ensure trace IDs are explicitly included in the log object
    customProps: (req) => ({
      requestId: req.id,
      correlationId: req.correlationId,
    }),

    genReqId: (req, res) => {
      const requestIdHeader = req.headers['x-request-id'];
      const correlationIdHeader = req.headers['x-correlation-id'];

      const requestId =
        (Array.isArray(requestIdHeader)
          ? requestIdHeader[0]
          : requestIdHeader) ?? randomUUID();

      const correlationId =
        (Array.isArray(correlationIdHeader)
          ? correlationIdHeader[0]
          : correlationIdHeader) ?? randomUUID();

      req.id = requestId;
      req.correlationId = correlationId;

      res.setHeader('X-Request-ID', requestId);
      res.setHeader('X-Correlation-ID', correlationId);

      return requestId;
    },

    // Uses the service-aware Proxy logger for HTTP access logs
    logger: createChild({
      service: 'http',
    }),

    serializers: {
      err: isProd ? errorSerializerProd : errorSerializerDev,

      req: (req) => ({
        contentLength: req.headers['content-length'],
        method: req.method,
        url: req.url,
      }),

      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },

    wrapSerializers: false,
  });

  return (req, res, next) => {
    // Manually trigger pino-http to ensure req.log and IDs are initialized
    pino(req, res);

    // Provide req.log to the store so createChild() proxies can access it
    loggerStore.run(req.log, () => next());
  };
};

/**
 * Updates the current request's logger with new context (e.g., userId).
 * Uses enterWith to ensure the AsyncLocalStorage is updated for the rest of the request.
 */
export const enrichRequestLogger = (req, context) => {
  if (req.log) {
    const enrichedLogger = req.log.child(context);

    req.log = enrichedLogger;

    // Update store mid-flight so all proxied loggers pick up new context
    loggerStore.enterWith(enrichedLogger);
  }
};

export const getRequestLogger = (req) => req.log;
