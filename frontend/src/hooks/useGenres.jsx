import { useEffect, useState } from "react";
import { tmdbInstance } from "../api/axios.js";

const CACHE_KEY = "tmdbGenres";
const CACHE_VERSION = 1;
const TTL = 24 * 60 * 60 * 1000; // 24 hours

function readCache() {
  let raw;
  try {
    raw = localStorage.getItem(CACHE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.version !== CACHE_VERSION ||
      typeof parsed.timestamp !== "number" ||
      Date.now() - parsed.timestamp > TTL
    ) {
      return null;
    }
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ version: CACHE_VERSION, timestamp: Date.now(), data }),
    );
  } catch {
    // localStorage unavailable/full — fail silently, in-memory state still works this session
  }
}

export default function useGenres() {
  const [genres, setGenres] = useState(() => readCache());

  useEffect(() => {
    if (genres) return;

    let cancelled = false;

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

        if (cancelled) return;
        writeCache(merged);
        setGenres(merged);
      } catch (error) {
        if (!cancelled) console.error("Failed to fetch genres:", error);
      }
    }

    fetchGenres();
    return () => {
      cancelled = true;
    };
  }, [genres]);

  return genres;
}
