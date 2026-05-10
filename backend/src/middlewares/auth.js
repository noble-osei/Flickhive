import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const validateAccessToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return next(new AppError("Not authenticated", 401));
  }

  try {
    // Verify given token using a secret key to get a decoded token
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export const validateRefreshToken = (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return next(new AppError("Not authenticated", 401));
  }

  try {
    // Verify given token using a secret key to get a decoded token
    const decoded = jwt.verify(token, process.env.SECRET_REFRESH_TOKEN);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
