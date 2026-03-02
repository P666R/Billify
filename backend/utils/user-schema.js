import * as z from 'zod';
import validator from 'validator';

// Reusable base schemas
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .trim()
  .toLowerCase()
  .refine((v) => validator.isEmail(v), { error: 'Invalid email address' });

const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .trim()
  .toLowerCase()
  .regex(/^[a-z][a-z0-9-_]{3,23}$/, {
    error:
      'Username must start with a letter and contain only letters, numbers, hyphens, or underscores',
  });

const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .trim()
  .refine((v) => validator.isAlpha(v), {
    error: 'First name must contain only letters',
  });

const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .trim()
  .refine((v) => validator.isAlpha(v), {
    error: 'Last name must contain only letters',
  });

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .trim()
  .refine((v) => validator.isStrongPassword(v), {
    error: 'Password must be 8+ chars with upper, lower, number, and symbol',
  });

const emailTokenSchema = z.hash('sha256', {
  enc: 'hex',
  error: 'Invalid email token',
});

const userIdSchema = z
  .string()
  .length(24, 'Invalid user ID')
  .refine((v) => validator.isMongoId(v), { error: 'Invalid user ID' });

const jwtSchema = z.jwt({ alg: 'HS256' });

// Schemas
export const registerUserSchema = z
  .strictObject({
    email: emailSchema,
    username: usernameSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
  .readonly();

export const verifyEmailSchema = z
  .strictObject({
    emailToken: emailTokenSchema,
    userId: userIdSchema,
  })
  .readonly();

export const loginBodySchema = z
  .strictObject({
    email: emailSchema,
    password: passwordSchema,
  })
  .readonly();

export const loginCookieSchema = z
  // not strictObject to allow "extra" cookies we don't control
  .object({
    jwt: jwtSchema.optional(),
  })
  .optional()
  .readonly();

export const refreshTokenCookieSchema = z
  .object({
    jwt: jwtSchema,
  })
  .readonly();

export const resendVerifyEmailSchema = z
  .strictObject({
    email: emailSchema,
  })
  .readonly();

export const passwordResetRequestSchema = z
  .strictObject({
    email: emailSchema,
  })
  .readonly();

export const userPasswordResetSchema = z
  .strictObject({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
    userId: userIdSchema,
    emailToken: emailTokenSchema,
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
  .readonly();
