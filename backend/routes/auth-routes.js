import { Router } from 'express';
import {
  loginBodySchema,
  loginCookieSchema,
  verifyEmailSchema,
  registerUserSchema,
  userPasswordResetSchema,
  resendVerifyEmailSchema,
  refreshTokenCookieSchema,
  passwordResetRequestSchema,
} from '#utils/user-schema.js';
import {
  passwordResetRequest,
  userPasswordReset,
} from '#controllers/auth/password-reset-controller.js';
import { loginLimiter } from '#middlewares/api-limiter.js';
import { loginUser } from '#controllers/auth/login-controller.js';
import { logoutUser } from '#controllers/auth/logout-controller.js';
import { registerUser } from '#controllers/auth/register-controller.js';
import { verifyEmail } from '#controllers/auth/verify-email-controller.js';
import { newAccessToken } from '#controllers/auth/refresh-token-controller.js';
import { validateRequest } from '#middlewares/request-validator-middleware.js';
import { resendVerifyEmail } from '#controllers/auth/resend-verify-email-controller.js';

export const authRouter = Router();

authRouter
  .route('/register')
  .post(validateRequest({ body: registerUserSchema }), registerUser);

authRouter
  .route('/verify/:emailToken/:userId')
  .get(validateRequest({ params: verifyEmailSchema }), verifyEmail);

authRouter
  .route('/login')
  .post(
    loginLimiter,
    validateRequest({ cookies: loginCookieSchema, body: loginBodySchema }),
    loginUser
  );

authRouter
  .route('/new_access_token')
  .get(validateRequest({ cookies: refreshTokenCookieSchema }), newAccessToken);

authRouter
  .route('/resend_email_token')
  .post(validateRequest({ body: resendVerifyEmailSchema }), resendVerifyEmail);

authRouter
  .route('/reset_password_request')
  .post(
    validateRequest({ body: passwordResetRequestSchema }),
    passwordResetRequest
  );

authRouter
  .route('/reset_password')
  .post(validateRequest({ body: userPasswordResetSchema }), userPasswordReset);

authRouter.route('/logout').get(logoutUser);
