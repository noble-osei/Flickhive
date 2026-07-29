const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" required for cross-site (Vercel <-> Render) cookies
});

class AuthHelpers {
  sendRefreshTokenCookie = (res, refreshToken) => {
    return res.cookie("refreshToken", refreshToken, {
      ...baseCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  };

  sendAccessTokenCookie = (res, accessToken) => {
    return res.cookie("accessToken", accessToken, {
      ...baseCookieOptions(),
      maxAge: 15 * 60 * 1000, // 15 mins
    });
  };
}

export default new AuthHelpers();
