import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as passwordResetService from '#services/auth/password-reset-service.js';

// POST /api/v1/auth/reset_password_request

export const passwordResetRequest = async (req, res) => {
  const { email } = req.body;

  const user = await passwordResetService.passwordResetRequest(email);

  enrichRequestLogger(req, { userId: user._id });
  req.log.info('Password reset link generated');

  res.status(200).json({
    success: true,
    message: `${user.firstName}, password reset link emailed successfully`,
  });
};

export const userPasswordReset = async (req, res) => {
  const { password, passwordConfirm, userId, emailToken } = req.body;

  const user = await passwordResetService.userPasswordReset({
    password,
    passwordConfirm,
    userId,
    emailToken,
  });

  enrichRequestLogger(req, { userId: user._id });
  req.log.info('Password reset successful');

  res.status(200).json({
    success: true,
    message: `${user.firstName}, your password reset was successful. An email has been sent to confirm`,
  });
};
