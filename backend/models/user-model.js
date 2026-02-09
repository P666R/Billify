/**
 * @file User Model Configuration
 * @description Handles user schema, password hashing, and role-based access control.
 * @module models/User
 */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
import { USER, ADMIN } from '../constants.js';

/**
 * Mongoose schema for User accounts.
 *
 * Includes built-in validation for emails, usernames, and passwords.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Username is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-z][a-z0-9-_]{3,23}$/i.test(v);
        },
        message:
          'Username must start with a letter and contain only letters, numbers, hyphens, or underscores.',
      },
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      validate: [validator.isAlpha, 'First name must contain only letters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      validate: [validator.isAlpha, 'Last name must contain only letters'],
    },
    password: {
      type: String,
      select: false,
      // Required only for local email strategy
      required: function () {
        return this.provider === 'email';
      },
      validate: [
        validator.isStrongPassword,
        'Password must be 8+ chars with upper, lower, number, and symbol',
      ],
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    provider: {
      type: String,
      required: true,
      default: 'email',
      enum: {
        values: ['email', 'google'],
        message: "Provider must be either 'email' or 'google'",
      },
    },
    googleId: { type: String, trim: true },
    avatar: { type: String, trim: true },
    businessName: { type: String, trim: true },
    phoneNumber: {
      type: String,
      trim: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number, begin with '+', then country code and number",
      ],
      default: '+911234567890',
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [USER],
      enum: {
        values: [USER, ADMIN],
        message: '{VALUE} is not a valid role',
      },
    },
    active: { type: Boolean, default: true },
    refreshToken: [String],
  },
  {
    timestamps: true,
  },
);

/**
 * Virtual field for password confirmation.
 *
 * Used for validation but never persisted to MongoDB.
 */
userSchema
  .virtual('passwordConfirm')
  .set(function (v) {
    this._passwordConfirm = v;
  })
  .get(function () {
    return this._passwordConfirm;
  });

/**
 * Middleware: Password Security
 *
 * 1. Validates password confirmation.
 * 2. Hashes password using Bcrypt.
 * 3. Updates passwordChangedAt timestamp.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.password !== this._passwordConfirm) {
    return next(new Error('Passwords do not match'));
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Set timestamp 1s in past to prevent JWT race conditions
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;

  // Memory cleanup
  this._passwordConfirm = undefined;
  next();
});

/**
 * Instance Method: Verify Password
 *
 * @param {string} givenPassword - Plain text password from request
 * @returns {Promise<boolean>} Match status
 */
userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
