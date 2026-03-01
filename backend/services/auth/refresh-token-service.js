import jwt from 'jsonwebtoken';
import { createChild } from '#utils/logger.js';
import { envConfig } from '#config/env-config.js';
import * as userRepository from '#repositories/user/user-repository.js';
import { ForbiddenError } from '#utils/client-error.js';

const logger = createChild({ service: 'refresh-token-service' });
const { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = envConfig;

export const newAccessToken = async (refreshToken) => {
  // 1. Find existing user with this refresh token
  let existingUser = await userRepository.findUserByRefreshToken({
    refreshToken,
  });

  // 2. Token reuse detection
  if (!existingUser) {
    logger.warn('Refresh token not found in database');
    // Token might still be valid but not in database
    // Try to verify it to detect potential token reuse attack
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);
      // If verification succeeds, this could be a reuse attempt
      // Invalidate all sessions for this user
      const hackedUser = await userRepository.findUserById(decoded.id);
      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
        logger.error(
          { userId: hackedUser._id },
          'Potential token reuse detected. All sessions revoked'
        );
      }
    } catch (error) {
      logger.warn(
        { cause: error.message },
        'Refresh token is invalid or expired'
      );
    }
    throw new ForbiddenError('Session expired or invalid. Please login again');
  }

  // 3. Remove the old refresh token from the array
  const newRefreshTokenArray = existingUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // 4. Verify the refresh token JWT
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);
  } catch (error) {
    logger.warn(
      { userId: existingUser._id },
      'Refresh token is invalid or expired'
    );
    // Token is invalid, save cleaned array and throw
    existingUser.refreshToken = newRefreshTokenArray;
    await existingUser.save();
    throw new ForbiddenError('Session expired', { cause: error });
  }

  // 5. Check if user ID matches
  if (existingUser._id.toString() !== decoded.id) {
    logger.warn(
      { userId: existingUser._id },
      'Identity mismatch during rotation'
    );
    throw new ForbiddenError('Session expired or invalid. Please login again');
  }

  // 6. Generate new tokens
  const accessToken = jwt.sign(
    {
      id: existingUser._id,
      roles: existingUser.roles,
    },
    JWT_ACCESS_SECRET_KEY,
    { expiresIn: '10m' }
  );

  const newRefreshToken = jwt.sign(
    { id: existingUser._id },
    JWT_REFRESH_SECRET_KEY,
    { expiresIn: '1d' }
  );

  // 7. Update refresh token array (keep only 5 most recent)
  existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken].slice(
    -5
  );

  await existingUser.save();

  return {
    user: existingUser,
    accessToken,
    refreshToken: newRefreshToken,
  };
};
