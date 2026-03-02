import jwt from 'jsonwebtoken';
import { createChild } from '#utils/logger.js';
import { envConfig } from '#config/env-config.js';
import * as userRepository from '#repositories/user/user-repository.js';
import { ForbiddenError } from '#utils/client-error.js';

const logger = createChild({ service: 'refresh-token-service' });
const { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = envConfig;

export const newAccessToken = async (refreshToken) => {
  // 1. Verify JWT integrity first (Zero DB cost)
  // We check the signature and expiry before hitting the database
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);
  } catch (error) {
    // If JWT is physically expired/fake, we wont do theft detection
    logger.info(`JWT: ${error.message}`);
    throw new ForbiddenError('Session expired. Please login again');
  }

  // 2. Pre generate the next Refresh Token in the chain
  // We use ID from decoded payload because the DB hasnt been hit yet
  const newRefreshToken = jwt.sign({ id: decoded.id }, JWT_REFRESH_SECRET_KEY, {
    expiresIn: '1d',
  });

  // 3. Atomic rotation - swap used token for new one in single DB op
  // Prevents race conditions where 2 simultaneous clicks could break the session
  const existingUser = await userRepository.findUserByRefTAndRotateRefT(
    refreshToken,
    newRefreshToken
  );

  // 4. Token reuse (theft) detection
  // If JWT passed Step 1 but not found in Step 3 it has been used before
  if (!existingUser) {
    // Use id from the stolen token to find the victim
    const hackedUser = await userRepository.findUserById(decoded.id);
    if (hackedUser) {
      hackedUser.refreshToken = [];
      await hackedUser.save();
      logger.warn(
        { userId: hackedUser._id },
        'Potential token reuse detected. All sessions revoked'
      );
    }
    throw new ForbiddenError('Session expired. Please login again');
  }

  // 5. Generate new short lived access tokens for frontend
  const accessToken = jwt.sign(
    { id: existingUser._id, roles: existingUser.roles },
    JWT_ACCESS_SECRET_KEY,
    { expiresIn: '10m' }
  );

  return { user: existingUser, accessToken, refreshToken: newRefreshToken };
};
