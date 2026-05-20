import * as userRepository from '#repositories/user/user-repository.js';

export const getAllUserAccounts = async (pageSize, pageNumber) => {
  const { count, users } = await userRepository.getPaginatedUsers(
    pageSize,
    pageNumber
  );

  const numberOfPages = Math.ceil(count / pageSize);

  return {
    users,
    count,
    numberOfPages,
  };
};
