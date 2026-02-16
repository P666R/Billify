import { randomBytes } from 'node:crypto';
import { createChild } from '#utils/logger.js';
import { sendEmail } from '#utils/send-email.js';
import { envConfig } from '#config/env-config.js';
import { ConflictError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

const { DOMAIN: domainURL } = envConfig;
const logger = createChild({ service: 'register-service' });

export const registerUser = async (user) => {
  const { email } = user;

  // Check if user already exists
  const userExists = await userRepository.findUserByEmail({ email });
  if (userExists) {
    logger.warn('Email already registered');
    throw new ConflictError('Email already registered');
  }

  // Create user
  const registeredUser = await userRepository.createUser(user);

  // Token for email verification
  const verificationToken = randomBytes(32).toString('hex');
  let emailVerificationToken = await userRepository.createVerifyResetToken({
    _userId: registeredUser._id,
    token: verificationToken,
  });

  // Send verification email
  const emailLink = `${domainURL}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;
  const payload = {
    name: registeredUser.firstName,
    link: emailLink,
  };
  await sendEmail(
    registeredUser.email,
    'Account Verification',
    payload,
    'account-verification.handlebars'
  );

  return registeredUser;
};
