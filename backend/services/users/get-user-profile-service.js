import { NotFoundError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

export const getUserProfile = async (userId) => {
  const user = await userRepository.findUserByIdLean(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
