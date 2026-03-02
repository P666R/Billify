import { enrichRequestLogger } from '#middlewares/logging-middleware.js';
import * as refreshTokenService from '#services/auth/refresh-token-service.js';

// GET /api/v1/auth/new_access_token
// Get new access token from the refresh token

export const newAccessToken = async (req, res) => {
  const { jwt: refreshToken } = req.cookies;

  const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: true,
    sameSite: 'None',
    path: '/',
  };

  try {
    // 1. Call the service
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await refreshTokenService.newAccessToken(refreshToken);

    // 2. Attach userId to all logs for this request
    enrichRequestLogger(req, { userId: user._id });
    req.log.info('Tokens rotated successfully');

    // 3. Set new refresh token cookie
    res.cookie('jwt', newRefreshToken, cookieOptions);

    // 4. Send response
    res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        provider: user.provider,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch (error) {
    // Clear cookie on any error
    const { maxAge: _, ...clearOptions } = cookieOptions; // NOSONAR
    res.clearCookie('jwt', clearOptions);
    throw error;
  }
};
