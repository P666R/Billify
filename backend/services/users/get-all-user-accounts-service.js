import * as userRepository from '#repositories/user/user-repository.js';

export const getAllUserAccounts = async (pageSize, page) => {
  const count = await userRepository.countAllUsers();

  const users = await userRepository.findAllUsers(pageSize, page);

  const numberOfPages = Math.ceil(count / pageSize);

  return {
    users,
    count,
    numberOfPages,
  };
};
