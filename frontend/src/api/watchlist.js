import { FlickhiveInstance } from "./axios.js";

export const getWatchlist = () =>
  FlickhiveInstance.get("/watchlist").then((res) => res.data);

export const addToWatchlist = (payload) =>
  FlickhiveInstance.post("/watchlist", payload).then((res) => res.data);

export const removeFromWatchlist = (id) =>
  FlickhiveInstance.delete(`/watchlist/${id}`);
