import * as getAllUserAccountsService from '#services/users/get-all-user-accounts-service.js';

// GET /api/v1/user/all

export const getAllUserAccounts = async (req, res) => {
  const pageSize = 10;
  const { pageNumber: page } = req.query;

  const { count, users, numberOfPages } =
    await getAllUserAccountsService.getAllUserAccounts(pageSize, page);

  req.log.info('User accounts fetched successfully');

  res.status(200).json({
    success: true,
    count,
    numberOfPages,
    users,
  });
};
