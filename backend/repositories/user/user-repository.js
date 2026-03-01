import { User } from '#models/user-model.js';
import { VerifyResetToken } from '#models/verify-reset-token-model.js';

// User operations
export const findUserByEmail = (data) => User.findOne(data);

export const findUserByEmailWithPassword = (data) =>
  User.findOne(data).select('+password');

export const findUserById = (id) => User.findById(id);

export const findUserByRefreshToken = (data) => User.findOne(data);

export const createUser = (data) => User.create(data);

// VerifyResetToken operations
export const createVerifyResetToken = (data) => VerifyResetToken.create(data);

export const findVerifyResetToken = (data) => VerifyResetToken.findOne(data);

export const deleteVerifyResetToken = (data) =>
  VerifyResetToken.findOneAndDelete(data);
