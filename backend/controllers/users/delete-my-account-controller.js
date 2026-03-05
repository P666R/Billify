import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as deleteMyAccountService from '#services/users/delete-my-account-service.js';

// DELETE /api/v1/user/profile

export const deleteMyAccount = async (req, res) => {
  const { _id: userId } = req.user;

  const { _id, firstName } =
    await deleteMyAccountService.deleteMyAccount(userId);

  enrichRequestLogger(req, { userId: _id });
  req.log.info('User account deleted successfully');

  res.status(200).json({
    success: true,
    message: `User ${firstName} account deleted successfully`,
  });
};
