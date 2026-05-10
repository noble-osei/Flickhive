import asyncHandler from "../middlewares/asyncHandler.js";
import authService from "../services/auth.js";
import authHelpers from "../utils/authHelper.js";

class AuthController {
  signup = asyncHandler(async (req, res) => {
    await authService.signup(req.body);

    res.status(201).end();
  });

  login = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken } = await authService.login(req.body);

    if (refreshToken && refreshToken.length > 0) {
      authHelpers.sendRefreshTokenCookie(res, refreshToken);
    }

    authHelpers.sendAccessTokenCookie(res, accessToken);
    res.status(204).end();
  });

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user?.id);

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(204)
      .end();
  });

  refresh = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken } = await authService.refresh(
      req.token,
      req.user,
    );

    authHelpers.sendAccessTokenCookie(res, accessToken);
    authHelpers.sendRefreshTokenCookie(res, refreshToken);

    res.status(204).end();
  });
}

export default new AuthController();
