import * as z from 'zod';
import validator from 'validator';

// Reusable base schemas
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .trim()
  .toLowerCase()
  .refine(validator.isEmail, { error: 'Invalid email address' });

const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .trim()
  .toLowerCase()
  .refine(/^[a-z][a-z0-9-_]{3,23}$/i, {
    error:
      'Username must start with a letter and contain only letters, numbers, hyphens, or underscores',
  });

const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .trim()
  .refine(validator.isAlpha, { error: 'First name must contain only letters' });

const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .trim()
  .refine(validator.isAlpha, { error: 'Last name must contain only letters' });

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .trim()
  .refine(validator.isStrongPassword, {
    error: 'Password must be 8+ chars with upper, lower, number, and symbol',
  });

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
  });
