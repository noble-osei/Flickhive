import express from "express";
import authController from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateRequest.js";
import userSchema from "../schemas/user.js";
import {
  validateAccessToken,
  validateRefreshToken,
} from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/signup",
  validateBody(userSchema.userSignup),
  authController.signup,
);

router.get("/me", validateAccessToken, authController.me);

router.post("/login", validateBody(userSchema.userLogin), authController.login);

router.post("/logout", validateAccessToken, authController.logout);

router.post("/refresh", validateRefreshToken, authController.refresh);

export default router;
