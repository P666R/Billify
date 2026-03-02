import { randomBytes } from 'node:crypto';
import { createChild } from '#utils/logger.js';
import { sendEmail } from '#utils/send-email.js';
import { envConfig } from '#config/env-config.js';
import { NotFoundError, BadRequestError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

const logger = createChild({ service: 'password-reset-service' });
const { DOMAIN: domainURL } = envConfig;

export const passwordResetRequest = async (email) => {
  const existingUser = await userRepository.findUserByEmail({ email });

  if (!existingUser) {
    logger.info('User not found');
    throw new NotFoundError('User not found');
  }

  if (!existingUser.isEmailVerified) {
    logger.info('Email not verified');
    throw new BadRequestError(
      'Email not verified. Check email for verification link'
    );
  }

  await userRepository.deleteVerifyResetToken({
    _userId: existingUser._id,
  });

  const resetToken = randomBytes(32).toString('hex');

  const emailTokenDoc = await userRepository.createVerifyResetToken({
    _userId: existingUser._id,
    token: resetToken,
  });

  const emailLink = `${domainURL}/auth/reset_password?emailToken=${emailTokenDoc.token}&userId=${existingUser._id}`;

  const payload = {
    name: existingUser.firstName,
    link: emailLink,
  };

  await sendEmail(
    existingUser.email,
    'Password Reset Request',
    payload,
    'request-reset-password.handlebars'
  );

  return existingUser;
};

export const userPasswordReset = async ({
  password,
  passwordConfirm,
  userId,
  emailToken,
}) => {
  if (password !== passwordConfirm) {
    logger.info('Passwords do not match');
    throw new BadRequestError('Passwords do not match');
  }

  const passwordResetTokenDoc = await userRepository.findVerifyResetToken({
    _userId: userId,
    token: emailToken,
  });

  if (!passwordResetTokenDoc) {
    logger.info('Invalid or expired token');
    throw new BadRequestError('Invalid or expired token');
  }

  const existingUser = await userRepository.findUserById(
    passwordResetTokenDoc._userId
  );

  if (!existingUser) {
    logger.info('User not found');
    throw new NotFoundError('User not found');
  }

  existingUser.password = password;
  existingUser.passwordConfirm = passwordConfirm;
  await existingUser.save();

  await passwordResetTokenDoc.deleteOne();

  const payload = {
    name: existingUser.firstName,
  };

  await sendEmail(
    existingUser.email,
    'Password Reset Success',
    payload,
    'reset-password.handlebars'
  );

  return existingUser;
};
