import { useMemo } from "react";

import { useWatchlist } from "../context/Watchlist.jsx";

export default function useWatch(tmdbId, mediaType) {
  const { items, loading, addItem, removeItem } = useWatchlist();

  const watchlistItem = useMemo(
    () =>
      items.find(
        (item) => item.tmdbId === tmdbId && item.mediaType === mediaType,
      ),
    [items, tmdbId, mediaType],
  );

  const isWatching = Boolean(watchlistItem);

  const add = (mediaData) => addItem({ tmdbId, mediaType, mediaData });

  const remove = () => watchlistItem && removeItem(watchlistItem._id);

  const toggle = (mediaData) => (isWatching ? remove() : add(mediaData));

  return { isWatching, loading, add, remove, toggle };
}
