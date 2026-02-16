export class AppError extends Error {
  constructor(message, statusCode, errorCode, details, options) {
    // 1. Pass message and options (like 'cause') to base Error class
    super(message, options);

    // 2. Set the prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;

    // 3. Logic for 'warn' (4xx) vs 'error' (5xx)
    this.status = statusCode >= 400 && statusCode < 500 ? 'warn' : 'error';

    // 4. Mark as operational (trusted error we know how to handle)
    this.isOperational = true;

    this.errorCode = errorCode ?? this.name;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}
