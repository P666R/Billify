import mongoose from 'mongoose';
import validator from 'validator';
import { ROLES } from '#constants/index.js';
import { hashPassword, verifyPassword } from '#utils/password.js';

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
    passwordConfirm: {
      type: String,
      select: false,
      // Required only for local email strategy
      required: function () {
        return this.provider === 'email';
      },
      validate: {
        validator: function (v) {
          return v === this.password;
        },
        message: 'Passwords do not match',
      },
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
      default: '+919876543210',
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [ROLES.USER],
      enum: {
        values: [ROLES.ADMIN, ROLES.USER],
        message: '{VALUE} is not a valid role',
      },
    },
    active: { type: Boolean, default: true },
    refreshToken: [String],
  },
  {
    timestamps: true,
    validateModifiedOnly: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await hashPassword(this.password);

  // Set timestamp 1s in past to prevent JWT race conditions
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;

  this.passwordConfirm = undefined;
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return await verifyPassword(givenPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
