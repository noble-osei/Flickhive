import { useEffect, useState } from "react";
import { tmdbInstance } from "../api/axios.js";

const CACHE_KEY = "tmdbGenres";

export default function useGenres() {
  const [genres, setGenres] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (genres) return;

    async function fetchGenres() {
      try {
        const [movieRes, tvRes] = await Promise.all([
          tmdbInstance.get("/genre/movie/list"),
          tmdbInstance.get("/genre/tv/list"),
        ]);

        const merged = Object.fromEntries(
          [...movieRes.data.genres, ...tvRes.data.genres].map((g) => [
            g.id,
            g.name,
          ]),
        );

        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        setGenres(merged);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }

    fetchGenres();
  }, [genres]);

  return genres;
}
