import * as loginService from '#services/auth/login-service.js';
import { enrichRequestLogger } from '#middlewares/logging-middleware.js';

// POST /api/v1/auth/login

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const currentCookieToken = req.cookies?.jwt;

  // Setup cookie options
  const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: true,
    sameSite: 'None',
    path: '/',
  };

  try {
    // 1. Call the service
    const { user, accessToken, refreshToken } = await loginService.loginUser(
      email,
      password,
      currentCookieToken
    );

    // 2. Attach userId to all logs for this request
    enrichRequestLogger(req, { userId: user._id });
    req.log.info('User logged in successfully');

    // 4. Set cookies
    res.cookie('jwt', refreshToken, cookieOptions);

    // 5. Send response
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
    //  Clear cookie on any login error
    const { maxAge: _maxAge, ...clearOptions } = cookieOptions;
    res.clearCookie('jwt', clearOptions);
    throw error;
  }
};
