import { createChild } from '#utils/logger.js';
import { sendEmail } from '#utils/send-email.js';
import { envConfig } from '#config/env-config.js';
import { NotFoundError, BadRequestError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

const { DOMAIN: domainURL } = envConfig;
const logger = createChild({ service: 'verify-email-service' });

export const verifyEmail = async (emailToken, userId) => {
  const user = await userRepository.findUserbyId(userId);

  if (!user) {
    logger.warn('User not found');
    throw new NotFoundError('User not found');
  }

  if (user.isEmailVerified) {
    logger.warn('User already verified. Please login');
    throw new BadRequestError('User already verified. Please login');
  }

  const userToken = await userRepository.findVerifyResetToken({
    _userId: user._id,
    token: emailToken,
  });

  if (!userToken) {
    logger.warn('Invalid or expired token');
    throw new BadRequestError('Invalid or expired token');
  }

  // Update user
  user.isEmailVerified = true;
  await user.save();

  // Delete token after use even though doc expires after 15 minutes
  await userToken.deleteOne();

  const payload = {
    name: user.firstName,
    link: `${domainURL}/login`,
  };

  await sendEmail(
    user.email,
    'Welcome - Account Verified',
    payload,
    'welcome.handlebars'
  );

  return user;
};
