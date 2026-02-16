import * as z from 'zod';
import { AppError } from '#utils/app-error.js';
import { StatusCodes } from 'http-status-codes';
import { envConfig } from '#config/env-config.js';
import { NotFoundError } from '#utils/client-error.js';

const { isDev } = envConfig;

/**
 * Global Error Handling Middleware
 * Processes all errors passed to next(err) and sends structured JSON responses.
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
  // Set error on response for Pino-HTTP logger to pick up automatically
  res.err = err;

  // Delegate to default Express handler if headers are already sent
  if (res.headersSent) return next(err);

  // Unify error data regardless of input type - App, native, unknown error
  const errorInfo = extractErrorInfo(err);

  // Build the clean public response object
  const response = {
    requestId: req.id,
    correlationId: req.correlationId,
    errorCode: errorInfo.errorCode,
    message: errorInfo.message,
    status: errorInfo.status,
    timestamp: errorInfo.timestamp,
  };

  // Include details only for operational (trusted) errors
  if (errorInfo.isOperational && errorInfo.details) {
    response.details = errorInfo.details;
  }

  // In development, include stack trace for debugging
  if (isDev && errorInfo.stack) {
    response.stack = errorInfo.stack;
    if (errorInfo.cause) {
      response.cause = errorInfo.cause;
    }
  }

  // Send response
  res.status(errorInfo.statusCode).json(response);
};

/**
 * 404 Handler for undefined routes
 */
export const notFoundHandlerMiddleware = (req, _res, next) => {
  const error = new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`, {
    method: req.method,
    path: req.originalUrl,
  });
  next(error);
};

/**
 * Normalizes different error formats into a consistent internal object.
 * @param {unknown} err - The caught error
 */
function extractErrorInfo(err) {
  const stack = err.stack || null;
  const now = new Date().toISOString();
  const cause = err.cause ? serializeCause(err.cause) : null;

  // Handle ZodError (validation)
  if (err instanceof z.ZodError) {
    const { summary, details, type } = formatZodError(err);

    return {
      name: type,
      message: summary,
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      status: 'warn',
      errorCode: 'VALIDATION_ERROR',
      isOperational: true,
      details,
      timestamp: now,
      stack,
      cause,
    };
  }

  // Handle AppError (trusted operational errors)
  if (err instanceof AppError) {
    return {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      status: err.status,
      errorCode: err.errorCode,
      isOperational: err.isOperational,
      details: err.details,
      timestamp: err.timestamp,
      stack,
      cause,
    };
  }

  // Handle standard Error
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message || 'An unexpected error occurred',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: 'error',
      errorCode: 'INTERNAL_SERVER_ERROR',
      isOperational: false,
      details: null,
      timestamp: now,
      stack,
      cause,
    };
  }

  // Handle unknown error types
  return {
    name: 'UnknownError',
    message: 'An unidentifiable error occurred',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    status: 'error',
    errorCode: 'UNKNOWN_ERROR',
    isOperational: false,
    details: { raw: err },
    timestamp: now,
    stack,
    cause,
  };
}

/**
 * Recursively converts Error objects into plain JSON for logging/debugging.
 * Preserves custom AppError properties throughout the cause chain.
 */
function serializeCause(cause) {
  // If the cause isnt an object we can inspect, return it as-is
  if (!(cause instanceof Error)) return cause;

  const serialized = {
    type: cause.name,
    message: cause.message,
    stack: cause.stack,
  };

  // Safely map AppError-specific properties if they exist
  if ('errorCode' in cause) serialized.errorCode = cause.errorCode;
  if ('statusCode' in cause) serialized.statusCode = cause.statusCode;
  if ('status' in cause) serialized.status = cause.status;
  if ('details' in cause) serialized.details = cause.details;
  if ('timestamp' in cause) serialized.timestamp = cause.timestamp;
  if ('isOperational' in cause) serialized.isOperational = cause.isOperational;

  // Recursively follow the error chain if a nested cause exists
  if (cause.cause) {
    serialized.cause = serializeCause(cause.cause);
  }

  return serialized;
}

/**
 * Format Zod validation errors
 */
function formatZodError(error) {
  // Nested object structure matching the schema
  const tree = z.treeifyError(error);
  // Readable multi-line summary string
  const summary = z.prettifyError(error);

  return {
    summary,
    details: {
      tree,
      count: error.issues.length,
      // Flat list of issues for simpler log indexing
      issues: error.issues.map((iss) => ({
        code: iss.code,
        path: iss.path.join('.'),
        message: iss.message,
      })),
    },
    type: 'ValidationError',
  };
}
