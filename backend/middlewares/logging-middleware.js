import { v4 as uuidv4 } from 'uuid';
import {
  createChild,
  errorSerializerDev,
  errorSerializerProd,
} from '#utils/logger.js';
import { pinoHttp } from 'pino-http';
import { AppError } from '#utils/app-error.js';
import { envConfig } from '#config/env-config.js';

const { isProd } = envConfig;

export const httpLoggingMiddleware = () => {
  return pinoHttp({
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

    customErrorMessage: (req, res, err) => {
      const errorCode =
        err instanceof AppError ? err.errorCode : 'UNKNOWN_ERROR';
      return `✗ ${req.method} ${req.url} ${res.statusCode} [${errorCode}] ${err.message}`;
    },

    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    customProps: (req) => ({
      correlationId: req.correlationId,
      requestId: req.id,
    }),

    customReceivedMessage: (req) => {
      return `→ ${req.method} ${req.url}`;
    },

    customSuccessMessage: (req, res) => {
      return `← ${req.method} ${req.url} ${res.statusCode}`;
    },

    genReqId: (req, res) => {
      const requestIdHeader = req.headers['x-request-id'];
      const correlationIdHeader = req.headers['x-correlation-id'];

      const requestId =
        (Array.isArray(requestIdHeader)
          ? requestIdHeader[0]
          : requestIdHeader) ?? uuidv4();

      const correlationId =
        (Array.isArray(correlationIdHeader)
          ? correlationIdHeader[0]
          : correlationIdHeader) ?? uuidv4();

      req.id = requestId;
      req.correlationId = correlationId;

      res.setHeader('X-Request-ID', requestId);
      res.setHeader('X-Correlation-ID', correlationId);

      return requestId;
    },

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
};

export const enrichRequestLogger = (req, context) => {
  req.log = req.log.child(context);
};

export const getRequestLogger = (req) => req.log;
