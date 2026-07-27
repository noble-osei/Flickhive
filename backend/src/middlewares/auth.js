import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const createTokenValidator =
  ({ cookieName, secretEnvVar, attachToken }) =>
  (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) {
      return next(new AppError("Not authenticated", 401));
    }

    try {
      // Verify given token using a secret key to get a decoded token
      const decoded = jwt.verify(token, process.env[secretEnvVar]);
      req.user = decoded;
      if (attachToken) req.token = token;
      next();
    } catch (error) {
      return next(new AppError("Invalid or expired token", 401));
    }
  };

export const validateAccessToken = createTokenValidator({
  cookieName: "accessToken",
  secretEnvVar: "SECRET_ACCESS_TOKEN",
});

export const validateRefreshToken = createTokenValidator({
  cookieName: "refreshToken",
  secretEnvVar: "SECRET_REFRESH_TOKEN",
  attachToken: true,
});
