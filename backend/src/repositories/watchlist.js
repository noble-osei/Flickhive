import Watchlist from "../models/Watchlist.js";
import { applyQueryOptions } from "./common.js";

class WatchlistRepository {
  findWatchlist = async (filters, options = {}) => {
    let query = Watchlist.find(filters);
    query = applyQueryOptions(query, options);
    return await query.exec();
  };

  deleteWatchlistItem = async (filters) => {
    return await Watchlist.findOneAndDelete(filters);
  };

  addToWatchlist = async (mediaData) => {
    return await Watchlist.create(mediaData);
  };
}

export default new WatchlistRepository();
