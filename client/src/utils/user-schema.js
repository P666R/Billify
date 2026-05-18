import * as z from 'zod';
import validator from 'validator';
import { passwordStrength } from './password-strength';

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
  .min(8, 'Password must be at least 8 characters long')
  .max(80, 'Password cannot be longer than 80 characters')
  .trim();

// Schemas
export const registerUserSchema = z
  .strictObject({
    email: emailSchema,
    username: usernameSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    password: passwordSchema.refine((v) => passwordStrength(v), {
      error:
        'Password is too weak. Try a longer phrase or add more unique words',
    }),
    passwordConfirm: z.string().min(1, 'Confirm password is required').trim(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    error: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
  .readonly();

export const loginUserSchema = z
  .strictObject({
    email: emailSchema,
    password: passwordSchema,
  })
  .readonly();

export const resendVerifyEmailSchema = z
  .strictObject({
    email: emailSchema,
  })
  .readonly();

export const resetPasswordUserSchema = z
  .strictObject({
    password: passwordSchema.refine((v) => passwordStrength(v), {
      error:
        'Password is too weak. Try a longer phrase or add more unique words',
    }),
    passwordConfirm: z.string().min(1, 'Confirm password is required').trim(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    error: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
  .readonly();
