import express from "express";
import authController from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateRequest.js";
import userSchema from "../schemas/user.js";
import {
  validateAccessToken,
  validateRefreshToken,
} from "../middlewares/auth.js";
import { loginLimiter, signupLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/signup",
  signupLimiter,
  validateBody(userSchema.userSignup),
  authController.signup,
);

router.get("/me", validateAccessToken, authController.me);

router.post(
  "/login",
  loginLimiter,
  validateBody(userSchema.userLogin),
  authController.login,
);

router.post("/logout", validateAccessToken, authController.logout);

router.post("/refresh", validateRefreshToken, authController.refresh);

export default router;
