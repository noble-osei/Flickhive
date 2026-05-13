import { useEffect, useState } from "react";
import { tmdbInstance } from "../api/axios.js";

const CACHE_KEY = "tmdbGenres";

export default function useGenres() {
  const [genres, setGenres] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached? JSON.parse(cached): null;
  });

  const req1 = tmdbInstance.get("/genre/movie/list");
  const req2 = tmdbInstance.get("/genre/tv/list");

  useEffect(() => {
    if (genres) return;

    Promise.all([req1, req2])
      .then(([res1, res2]) => {
        const merged = Object.fromEntries(
          [...res1.data?.genres, ...res2.data?.genres].map(g => [g.id, g.name]) 
        );
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        setGenres(merged);
      })
      .catch(error => {
        console.error("Error: " + error);
      });
  }, []);
    
  return genres;
  }