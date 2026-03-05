import { BadRequestError, NotFoundError } from '#utils/client-error.js';
import * as userRepository from '#repositories/user/user-repository.js';

export const deactivateUser = async (adminId, userId) => {
  if (userId.toString() === adminId.toString()) {
    throw new BadRequestError('Admin cannot deactivate own account');
  }

  const user = await userRepository.findUserByIdAndUpdate(userId, {
    active: false,
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
