import * as getAllUserAccountsService from '#services/users/get-all-user-accounts-service.js';

// GET /api/v1/user/all

export const getAllUserAccounts = async (req, res) => {
  const { pageSize, pageNumber } = req.valid.query;

  const { count, users, numberOfPages } =
    await getAllUserAccountsService.getAllUserAccounts(pageSize, pageNumber);

  req.log.info('User accounts fetched successfully');

  res.status(200).json({
    success: true,
    count,
    numberOfPages,
    users,
  });
};
