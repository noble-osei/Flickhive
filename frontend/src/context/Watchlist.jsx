import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../api/watchlist.js";
import { useAuth } from "./Auth.jsx";

const WatchlistContext = createContext(null);
const toastStyle = {
  style: {
    background: "#1a1a2e",
    color: "#fff",
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchWatchlist() {
      setLoading(true);
      try {
        const data = await getWatchlist();
        if (!cancelled) setItems(data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        if (!cancelled) {
          toast.error("Failed to load your watchlist", toastStyle);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWatchlist();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addItem = async (payload) => {
    try {
      const created = await addToWatchlist(payload);
      setItems((prev) => [...prev, created]);
      toast.success("Added to watchlist", toastStyle);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Already in your watchlist", toastStyle);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add to watchlist",
          toastStyle,
        );
      }
    }
  };

  const removeItem = async (id) => {
    try {
      await removeFromWatchlist(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from watchlist", toastStyle);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove from watchlist",
        toastStyle,
      );
    }
  };

  const value = { items, loading, addItem, removeItem };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}
