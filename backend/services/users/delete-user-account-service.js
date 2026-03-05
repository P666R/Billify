import { BadRequestError, NotFoundError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

export const deleteUserAccount = async (adminId, userId) => {
  if (userId.toString() === adminId.toString()) {
    throw new BadRequestError('Admin cannot delete own account');
  }

  const user = await userRepository.findUserByIdAndDelete(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
