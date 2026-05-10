import express from "express";
import Joi from "joi";
import watchlistController from "../controllers/watchlist.js";
import { validateAccessToken } from "../middlewares/auth.js";
import { validateParams } from "../middlewares/validateRequest.js";

const router = express.Router();

const mediaIdSchema = Joi.object({
  mediaId: Joi.string().hex().length(24).required(),
});

router.use(validateAccessToken);

router
  .route("/")
  .post(watchlistController.addToWatchlist)
  .get(watchlistController.getWatchlist);

router.delete(
  "/:mediaId",
  validateParams(mediaIdSchema),
  watchlistController.deleteWatchlistItem,
);

export default router;
