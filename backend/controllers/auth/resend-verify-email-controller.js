import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as resendVerifyEmailService from '#services/auth/resend-verify-email-service.js';

// POST /api/v1/auth/resend_email_token

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await resendVerifyEmailService.resendVerifyEmail(email);

  enrichRequestLogger(req, { userId: user._id });
  req.log.info('Email verification token resent successfully');

  res.status(200).json({
    success: true,
    message: `${user.firstName}, an email has been sent to your account. Please verify within 15 minutes`,
  });
};
