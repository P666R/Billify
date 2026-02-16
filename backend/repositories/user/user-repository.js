import { User } from '#models/user-model.js';
import { VerifyResetToken } from '#models/verify-reset-token-model.js';

export const findUserByEmail = (data) => User.findOne(data);

export const findUserbyId = (data) => User.findById(data);

export const createUser = (data) => User.create(data);

export const createVerifyResetToken = (data) => VerifyResetToken.create(data);

export const findVerifyResetToken = (data) => VerifyResetToken.findOne(data);
