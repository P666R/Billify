import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { AppError } from '#utils/app-error.js';

/** 500: Unexpected server-side failure. */
export class InternalServerError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR,
      StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR],
      details,
      options
    );
  }
}

/** 503: Server is overloaded or down for maintenance. */
export class ServiceUnavailableError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.SERVICE_UNAVAILABLE,
      StatusCodes.SERVICE_UNAVAILABLE,
      StatusCodes[StatusCodes.SERVICE_UNAVAILABLE],
      details,
      options
    );
  }
}

/** 502: Invalid response from an upstream server. */
export class BadGatewayError extends AppError {
  constructor(message, details, options) {
    super(
      message ?? ReasonPhrases.BAD_GATEWAY,
      StatusCodes.BAD_GATEWAY,
      StatusCodes[StatusCodes.BAD_GATEWAY],
      details,
      options
    );
  }
}
