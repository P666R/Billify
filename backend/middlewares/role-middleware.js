import { UnauthorizedError, ForbiddenError } from '#utils/client-error.js';

export const checkRole = (allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user || !req.roles) {
      req.log.info('Not authenticated');
      throw new UnauthorizedError('Not authenticated');
    }

    const roleFound = req.roles.some((role) => allowedRoles.includes(role));

    if (!roleFound) {
      req.log.info('Access denied');
      throw new ForbiddenError('Access denied');
    }

    next();
  };
};
