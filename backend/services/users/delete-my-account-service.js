import { NotFoundError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

export const deleteMyAccount = async (userId) => {
  const user = await userRepository.findUserByIdAndDelete(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
