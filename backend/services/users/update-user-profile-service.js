import { NotFoundError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

export const updateUserProfile = async (id, data) => {
  const updatedUser = await userRepository.findUserByIdAndUpdate(id, data);

  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  return updatedUser;
};
