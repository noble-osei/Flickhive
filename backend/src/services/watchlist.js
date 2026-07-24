import watchlistRepository from "../repositories/watchlist.js";
import AppError from "../utils/appError.js";

class WatchlistService {
  addToWatchlist = async (userId, { tmdbId, mediaType, mediaData } = {}) => {
    if (!tmdbId || !mediaType || !mediaData) {
      throw new AppError("tmdbId, mediaType and mediaData are required", 400);
    }

    try {
      return await watchlistRepository.addToWatchlist({
        userId,
        tmdbId,
        mediaType,
        mediaData,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Already in watchlist", 409);
      }
      throw error;
    }
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
