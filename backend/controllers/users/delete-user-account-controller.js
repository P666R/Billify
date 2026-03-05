import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as deleteUserAccountService from '#services/users/delete-user-account-service.js';

// DELETE /api/v1/user/:id

export const deleteUserAccount = async (req, res) => {
  const { _id: adminId } = req.user;
  const { id: userId } = req.params;

  const { _id, firstName } = await deleteUserAccountService.deleteUserAccount(
    adminId,
    userId
  );

  enrichRequestLogger(req, { userId: _id });
  req.log.info('User account deleted successfully');

  res.status(200).json({
    success: true,
    message: `User ${firstName} account deleted successfully`,
  });
};
