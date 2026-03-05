import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as updateUserProfileService from '#services/users/update-user-profile-service.js';

// PATCH /api/v1/user/profile

export const updateUserProfile = async (req, res) => {
  const { _id: userId } = req.user;

  const { _id, ...updatedUser } =
    await updateUserProfileService.updateUserProfile(userId, req.body);

  enrichRequestLogger(req, { userId: _id });
  req.log.info('User profile updated successfully');

  res.status(200).json({
    success: true,
    message: `${updatedUser.firstName} profile was successfully updated`,
    updatedUser,
  });
};
