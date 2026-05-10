import watchlistRepository from "../repositories/watchlist.js";
import AppError from "../utils/appError.js";

class WatchlistService {
  addToWatchlist = async (userId, mediaData) => {
    if (!mediaData) {
      throw new AppError("Media data is required", 400);
    }
    return await watchlistRepository.addToWatchlist({ userId, mediaData });
  };

  getWatchlist = async (userId) => {
    return await watchlistRepository.findWatchlist(
      { userId: userId },
      { select: "-__v" },
    );
  };

  deleteWatchlistItem = async (userId, mediaId) => {
    return await watchlistRepository.deleteWatchlistItem({
      userId: userId,
      _id: mediaId,
    });
  };
}

export default new WatchlistService();
