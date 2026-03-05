import jwt from 'jsonwebtoken';
import { envConfig } from '#config/env-config.js';
import { UnauthorizedError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';
import { enrichRequestLogger } from '#middlewares/logging-middleware.js';

export const checkAuth = async (req, _res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    req.log.info('No token provided');
    throw new UnauthorizedError('No token provided');
  }

  const jwtToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(jwtToken, envConfig.JWT_ACCESS_SECRET_KEY);

    const user = await userRepository.findUserByIdLean(
      decoded.id,
      '-refreshToken -__v'
    );

    if (!user) {
      req.log.info('User no longer exists');
      throw new UnauthorizedError('User no longer exists');
    }

    if (!user.active) {
      req.log.info('Account has been deactivated');
      throw new UnauthorizedError('Account has been deactivated');
    }

    // Attach data to request
    req.user = user;
    req.roles = user.roles;

    // Attach data to logger
    enrichRequestLogger(req, {
      userId: user._id,
      roles: user.roles,
    });

    next();
  } catch (error) {
    req.log.info({ err: error }, 'JWT verification failed');

    // If already one of our AppErrors, re-throw
    if (error.isOperational) throw error;

    // Else wrap JWT errors into UnauthorizedError
    throw new UnauthorizedError('JWT verification failed', { cause: error });
  }
};
