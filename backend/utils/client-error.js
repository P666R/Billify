import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AppError } from '#utils/app-error.js';

/** 400: Malformed syntax or invalid request. */
export class BadRequestError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.BAD_REQUEST,
      statusCode ?? StatusCodes.BAD_REQUEST,
      errorCode ?? StatusCodes[StatusCodes.BAD_REQUEST],
      details,
      restOptions
    );
  }
}

/** 401: Authentication is required or has failed. */
export class UnauthorizedError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.UNAUTHORIZED,
      statusCode ?? StatusCodes.UNAUTHORIZED,
      errorCode ?? StatusCodes[StatusCodes.UNAUTHORIZED],
      details,
      restOptions
    );
  }
}

/** 403: Authenticated but lacks required permissions. */
export class ForbiddenError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.FORBIDDEN,
      statusCode ?? StatusCodes.FORBIDDEN,
      errorCode ?? StatusCodes[StatusCodes.FORBIDDEN],
      details,
      restOptions
    );
  }
}

/** 404: The requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.NOT_FOUND,
      statusCode ?? StatusCodes.NOT_FOUND,
      errorCode ?? StatusCodes[StatusCodes.NOT_FOUND],
      details,
      restOptions
    );
  }
}

/** 409: Request conflicts with current state (e.g., duplicate email). */
export class ConflictError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.CONFLICT,
      statusCode ?? StatusCodes.CONFLICT,
      errorCode ?? StatusCodes[StatusCodes.CONFLICT],
      details,
      restOptions
    );
  }
}

/** 422: Schema validation passed, but data is logically invalid. */
export class ValidationError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.UNPROCESSABLE_ENTITY,
      statusCode ?? StatusCodes.UNPROCESSABLE_ENTITY,
      errorCode ?? StatusCodes[StatusCodes.UNPROCESSABLE_ENTITY],
      details,
      restOptions
    );
  }
}

/** 429: Too many requests sent in a short timeframe. */
export class TooManyRequestsError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.TOO_MANY_REQUESTS,
      statusCode ?? StatusCodes.TOO_MANY_REQUESTS,
      errorCode ?? StatusCodes[StatusCodes.TOO_MANY_REQUESTS],
      details,
      restOptions
    );
  }
}

/** 408: Server timed out waiting for the client request. */
export class RequestTimeoutError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.REQUEST_TIMEOUT,
      statusCode ?? StatusCodes.REQUEST_TIMEOUT,
      errorCode ?? StatusCodes[StatusCodes.REQUEST_TIMEOUT],
      details,
      restOptions
    );
  }
}

/** 413: Request body is larger than the server's defined limit. */
export class PayloadTooLargeError extends AppError {
  constructor(message, options = {}) {
    const { statusCode, errorCode, details, ...restOptions } = options;
    super(
      message ?? ReasonPhrases.REQUEST_ENTITY_TOO_LARGE,
      statusCode ?? StatusCodes.REQUEST_ENTITY_TOO_LARGE,
      errorCode ?? StatusCodes[StatusCodes.REQUEST_ENTITY_TOO_LARGE],
      details,
      restOptions
    );
  }
}
