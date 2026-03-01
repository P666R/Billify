import { createChild } from '#utils/logger.js';
import * as userRepository from '#repositories/user/user-repository.js';

const logger = createChild({ service: 'logout-service' });

export const logoutUser = async (refreshToken) => {
  const existingUser = await userRepository.findUserByRefreshToken({
    refreshToken,
  });

  if (!existingUser) {
    logger.warn('User not found');
    return null;
  }

  existingUser.refreshToken = existingUser.refreshToken.filter(
    (refT) => refT !== refreshToken
  );

  await existingUser.save();

  return existingUser;
};
