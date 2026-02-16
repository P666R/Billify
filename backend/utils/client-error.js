import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AppError } from '#utils/app-error.js';

/** 400: Malformed syntax or invalid request. */
export class BadRequestError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      StatusCodes[StatusCodes.BAD_REQUEST],
      details,
      options
    );
  }
}

/** 401: Authentication is required or has failed. */
export class UnauthorizedError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.UNAUTHORIZED,
      StatusCodes.UNAUTHORIZED,
      StatusCodes[StatusCodes.UNAUTHORIZED],
      details,
      options
    );
  }
}

/** 403: Authenticated but lacks required permissions. */
export class ForbiddenError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.FORBIDDEN,
      StatusCodes.FORBIDDEN,
      StatusCodes[StatusCodes.FORBIDDEN],
      details,
      options
    );
  }
}

/** 404: The requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.NOT_FOUND,
      StatusCodes.NOT_FOUND,
      StatusCodes[StatusCodes.NOT_FOUND],
      details,
      options
    );
  }
}

/** 409: Request conflicts with current state (e.g., duplicate email). */
export class ConflictError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.CONFLICT,
      StatusCodes.CONFLICT,
      StatusCodes[StatusCodes.CONFLICT],
      details,
      options
    );
  }
}

/** 422: Schema validation passed, but data is logically invalid. */
export class ValidationError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.UNPROCESSABLE_ENTITY,
      StatusCodes.UNPROCESSABLE_ENTITY,
      StatusCodes[StatusCodes.UNPROCESSABLE_ENTITY],
      details,
      options
    );
  }
}

/** 429: Too many requests sent in a short timeframe. */
export class TooManyRequestsError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.TOO_MANY_REQUESTS,
      StatusCodes.TOO_MANY_REQUESTS,
      StatusCodes[StatusCodes.TOO_MANY_REQUESTS],
      details,
      options
    );
  }
}

/** 408: Server timed out waiting for the client request. */
export class RequestTimeoutError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.REQUEST_TIMEOUT,
      StatusCodes.REQUEST_TIMEOUT,
      StatusCodes[StatusCodes.REQUEST_TIMEOUT],
      details,
      options
    );
  }
}

/** 413: Request body is larger than the server's defined limit. */
export class PayloadTooLargeError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.REQUEST_ENTITY_TOO_LARGE,
      StatusCodes.REQUEST_ENTITY_TOO_LARGE,
      StatusCodes[StatusCodes.REQUEST_ENTITY_TOO_LARGE],
      details,
      options
    );
  }
}
