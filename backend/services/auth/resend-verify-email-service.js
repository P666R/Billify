import { randomBytes } from 'node:crypto';
import { createChild } from '#utils/logger.js';
import { sendEmail } from '#utils/send-email.js';
import { envConfig } from '#config/env-config.js';
import { NotFoundError, BadRequestError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

const logger = createChild({ service: 'resend-verify-email-service' });
const { DOMAIN: domainURL } = envConfig;

export const resendVerifyEmail = async (email) => {
  const existingUser = await userRepository.findUserByEmail({ email });

  if (!existingUser) {
    logger.info('User not found');
    throw new NotFoundError('User not found');
  }

  if (existingUser.isEmailVerified) {
    logger.info('User already verified. Please login');
    throw new BadRequestError('User already verified. Please login');
  }

  await userRepository.deleteVerifyResetToken({
    _userId: existingUser._id,
  });

  const resentToken = randomBytes(32).toString('hex');

  const emailTokenDoc = await userRepository.createVerifyResetToken({
    _userId: existingUser._id,
    token: resentToken,
  });

  const emailLink = `${domainURL}/api/v1/auth/verify/${emailTokenDoc.token}/${existingUser._id}`;

  const payload = {
    name: existingUser.firstName,
    link: emailLink,
  };

  await sendEmail(
    existingUser.email,
    'Account Verification',
    payload,
    'account-verification.handlebars'
  );

  return existingUser;
};
