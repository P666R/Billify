import * as userRepository from '#repositories/user/user-repository.js';

export const logoutUser = async (refreshToken) => {
  const existingUser =
    await userRepository.findUserByRefTAndDeleteRefT(refreshToken);

  return existingUser;
};
