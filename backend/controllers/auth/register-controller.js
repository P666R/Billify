import * as registerService from '#services/auth/register-service.js';
import { enrichRequestLogger } from '#middlewares/logging-middleware.js';

// POST /api/v1/auth/register

export const registerUser = async (req, res) => {
  const user = await registerService.registerUser(req.body);

  enrichRequestLogger(req, { userId: user._id });
  req.log.info('User registration successful');

  res.status(201).json({
    success: true,
    message: `${user.firstName}, verification email has been sent. Please verify within 15 minutes.`,
  });
};
