import { ADMIN, USER } from '#constants/index.js';
import { UnauthorizedError, ForbiddenError } from '#utils/client-error.js';

export const ROLES = {
  User: USER,
  Admin: ADMIN,
};

export const checkRole = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user || !req.roles) {
      req.log.warn('Not authenticated');
      throw new UnauthorizedError('Not authenticated');
    }

    const roleFound = req.roles.some((role) => allowedRoles.includes(role));

    if (!roleFound) {
      req.log.warn('Access denied');
      throw new ForbiddenError('Access denied');
    }

    next();
  };
};
