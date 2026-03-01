import * as logoutService from '#services/auth/logout-service.js';
import { enrichRequestLogger } from '#middlewares/logging-middleware.js';

// POST /api/v1/auth/logout

export const logoutUser = async (req, res) => {
  const currentCookieToken = req.cookies?.jwt;

  // Setup cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
  };

  try {
    const user = await logoutService.logoutUser(currentCookieToken);

    res.clearCookie('jwt', cookieOptions);

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
  } catch (error) {
    //  Clear cookie on any logout error
    res.clearCookie('jwt', cookieOptions);
    throw error;
  }
};
