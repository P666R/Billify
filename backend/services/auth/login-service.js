import jwt from 'jsonwebtoken';
import { createChild } from '#utils/logger.js';
import { envConfig } from '#config/env-config.js';
import { verifyPassword } from '#utils/password.js';
import * as userRepository from '#repositories/user/user-repository.js';
import { BadRequestError, UnauthorizedError } from '#utils/client-error.js';

const logger = createChild({ service: 'login-service' });
const { DUMMY_HASHED_PASSWORD, JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } =
  envConfig;

export const loginUser = async (email, password, currentCookieToken) => {
  // 1. Find existing user
  const existingUser = await userRepository.findUserByEmailWithPassword({
    email,
  });

  // 2. Verify user and password (timing safe)
  const storedHash = existingUser
    ? existingUser.password
    : DUMMY_HASHED_PASSWORD;
  const passwordMatch = await verifyPassword(password, storedHash);

  if (!existingUser || !passwordMatch) {
    logger.warn('Invalid credentials');
    throw new UnauthorizedError('Invalid credentials');
  }

  // 3. Status checks
  if (!existingUser.isEmailVerified) {
    logger.warn('Email not verified');
    throw new BadRequestError(
      'Email not verified. Check your email for verification link'
    );
  }
  if (!existingUser.active) {
    logger.warn('Account deactivated');
    throw new BadRequestError('Account deactivated. Please contact support');
  }

  // 4. Token Reuse Detection & Session Theft Protection
  if (
    currentCookieToken &&
    !existingUser.refreshToken.includes(currentCookieToken)
  ) {
    // The token was used before or is fake/stolen
    // Invalidate all sessions
    existingUser.refreshToken = [];
    await existingUser.save();

    logger.warn({ userId: existingUser._id }, 'Refresh token reuse detected');
    throw new UnauthorizedError('Potential session theft. Please log in again');
  }

  // 5. Generate new tokens
  const accessToken = jwt.sign(
    {
      id: existingUser._id,
      roles: existingUser.roles,
    },
    JWT_ACCESS_SECRET_KEY,
    {
      expiresIn: '10m',
    }
  );
  const newRefreshToken = jwt.sign(
    {
      id: existingUser._id,
    },
    JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: '1d',
    }
  );

  // 6. Refresh Token Rotation Logic
  // Remove the old refresh token (if any)
  let updatedRefreshTokenArray = currentCookieToken
    ? existingUser.refreshToken.filter((rt) => rt !== currentCookieToken)
    : existingUser.refreshToken;

  // Add the new token and keep only the 5 most recent
  existingUser.refreshToken = [
    ...updatedRefreshTokenArray,
    newRefreshToken,
  ].slice(-5);

  await existingUser.save();

  return {
    user: existingUser,
    accessToken,
    refreshToken: newRefreshToken,
  };
};
