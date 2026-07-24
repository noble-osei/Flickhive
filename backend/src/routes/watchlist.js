import express from "express";
import Joi from "joi";
import watchlistController from "../controllers/watchlist.js";
import { validateAccessToken } from "../middlewares/auth.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validateRequest.js";

const router = express.Router();

const mediaIdSchema = Joi.object({
  mediaId: Joi.string().hex().length(24).required(),
});

const addWatchlistSchema = Joi.object({
  tmdbId: Joi.number().required(),
  mediaType: Joi.string().valid("movie", "tv").required(),
  mediaData: Joi.object({
    title: Joi.string().allow(null, ""),
    name: Joi.string().allow(null, ""),
    poster_path: Joi.string().allow(null, ""),
    release_date: Joi.string().allow(null, ""),
    first_air_date: Joi.string().allow(null, ""),
    vote_average: Joi.number().allow(null),
  }).required(),
});

router.use(validateAccessToken);

router
  .route("/")
  .post(validateBody(addWatchlistSchema), watchlistController.addToWatchlist)
  .get(watchlistController.getWatchlist);

router.delete(
  "/:mediaId",
  validateParams(mediaIdSchema),
  watchlistController.deleteWatchlistItem,
);

export default router;
