import * as logoutService from '#services/auth/logout-service.js';
import { enrichRequestLogger } from '#middlewares/logging-middleware.js';

// POST /api/v1/auth/logout

export const logoutUser = async (req, res) => {
  const { jwt: currentCookieToken } = req.cookies;

  // Setup cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
  };

  res.clearCookie('jwt', cookieOptions);

  if (!currentCookieToken) {
    return res.status(200).json({
      success: true,
      message: 'Already logged out',
    });
  }

  const user = await logoutService.logoutUser(currentCookieToken);

  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'Already logged out',
    });
  }

  enrichRequestLogger(req, { userId: user._id });
  req.log.info('User logged out successfully');

  res.status(200).json({
    success: true,
    message: `${user.firstName}, you have been logged out successfully`,
  });
};
