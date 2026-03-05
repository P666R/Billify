import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as getUserProfileService from '#services/users/get-user-profile-service.js';

// GET /api/v1/user/profile

export const getUserProfile = async (req, res) => {
  const { _id: userId } = req.user;

  const { _id, ...userProfile } =
    await getUserProfileService.getUserProfile(userId);

  enrichRequestLogger(req, { userId: _id });
  req.log.info('User profile fetched successfully');

  res.status(200).json({
    success: true,
    message: `User ${userProfile.firstName} profile fetched successfully`,
    userProfile,
  });
};
