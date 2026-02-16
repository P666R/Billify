import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { envConfig } from '#config/env-config.js';
import { UnauthorizedError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';
import { enrichRequestLogger } from '#middlewares/logging-middleware.js';

export const checkAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    req.log.warn('No token provided');
    throw new UnauthorizedError('No token provided');
  }

  const jwtToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(jwtToken, envConfig.JWT_ACCESS_SECRET_KEY);

    const user = await userRepository
      .findUserbyId(decoded.id)
      .select('-password');

    if (!user) {
      req.log.warn('User no longer exists');
      throw new UnauthorizedError('User no longer exists');
    }

    // Attach data to request
    req.user = user;
    req.roles = decoded.roles;

    // Attach data to logger
    enrichRequestLogger(req, {
      userId: user._id,
      roles: decoded.roles,
    });

    next();
  } catch (error) {
    req.log.warn({ err: error }, 'JWT verification failed');

    // If already one of our AppErrors, re-throw
    if (error.isOperational) throw error;

    // Else wrap JWT errors into UnauthorizedError
    throw new UnauthorizedError('JWT verification failed', { cause: error });
  }
});
