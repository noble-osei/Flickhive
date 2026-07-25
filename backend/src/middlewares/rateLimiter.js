import rateLimit from "express-rate-limit";
import AppError from "../utils/appError.js";

const createLimiter = ({
  windowMs,
  max,
  skipSuccessfulRequests = false,
  message,
}) =>
  rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => next(new AppError(message, 429)),
  });

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const signupLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many signup attempts. Please try again in an hour.",
});
