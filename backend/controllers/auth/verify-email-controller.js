import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as verifyEmailService from '#services/auth/verify-email-service.js';

//  GET /api/v1/auth/verify/:emailToken/:userId

export const verifyEmail = async (req, res) => {
  const { emailToken, userId } = req.params;

  const user = await verifyEmailService.verifyEmail(emailToken, userId);

  enrichRequestLogger(req, { userId: user._id });
  req.log.info('Email verified successfully');

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
};
