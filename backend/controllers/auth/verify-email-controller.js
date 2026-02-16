import asyncHandler from 'express-async-handler';
import * as verifyEmailService from '#services/auth/verify-email-service.js';

//  GET /api/v1/auth/verify/:emailToken/:userId

export const verifyEmail = asyncHandler(async (req, res) => {
  const { emailToken, userId } = req.params;

  const verifiedUser = await verifyEmailService.verifyEmail(emailToken, userId);

  req.log.info({ userId: verifiedUser._id }, 'Email verified successfully');

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});
