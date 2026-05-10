import asyncHandler from "../middlewares/asyncHandler.js";
import watchlistService from "../services/watchlist.js";

class WatchlistController {
  addToWatchlist = asyncHandler(async (req, res) => {
    await watchlistService.addToWatchlist(req.user?.id, req.body?.mediaData);

    res.status(201).end();
  });

  getWatchlist = asyncHandler(async (req, res) => {
    const watchlist = await watchlistService.getWatchlist(req.user?.id);

    res.json(watchlist);
  });

  deleteWatchlistItem = asyncHandler(async (req, res) => {
    await watchlistService.deleteWatchlistItem(
      req.user?.id,
      req.params.mediaId,
    );

    res.status(204).end();
  });
}

export default new WatchlistController();
