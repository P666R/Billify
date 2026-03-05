import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as deactivateUserService from '#services/users/deactivate-user-service.js';

// PATCH /api/v1/user/:id/deactivate

export const deactivateUser = async (req, res) => {
  const { _id: adminId } = req.user;
  const { id: userId } = req.params;

  const { _id, ...updatedUser } = await deactivateUserService.deactivateUser(
    adminId,
    userId
  );

  enrichRequestLogger(req, { userId: _id });
  req.log.info('User deactivated successfully');

  res.status(200).json({
    success: true,
    message: `User ${updatedUser.firstName} account deactivated successfully`,
    updatedUser,
  });
};
