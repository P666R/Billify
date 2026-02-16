import rateLimit from 'express-rate-limit';

const limitHandler = (req, res, _next, options) => {
  req.log.warn(
    {
      ip: req.ip,
      method: req.method,
      url: req.url,
      errorCode: 'TOO_MANY_REQUESTS',
    },
    `${options.message.error}`
  );

  res.status(options.statusCode).json({
    requestId: req.id,
    correlationId: req.correlationId,
    errorCode: 'TOO_MANY_REQUESTS',
    message: options.message.error,
    status: 'warn',
    timestamp: new Date().toISOString(),
  });
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
  handler: limitHandler,
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error:
      'Too many login attempts from this IP, please try again after 30 minutes',
  },
  handler: limitHandler,
});
