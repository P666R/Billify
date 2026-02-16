import asyncHandler from 'express-async-handler';
import * as registerService from '#services/auth/register-service.js';

export const registerUser = asyncHandler(async (req, res) => {
  const registeredUser = await registerService.registerUser(req.body);

  req.log.info({ userId: registeredUser._id }, 'User registration successful');

  res.status(201).json({
    success: true,
    message: `A verification email has been sent to ${registeredUser.email}. Please verify within 15 minutes.`,
  });
});
