import axios from "axios";

export const tmdbInstance = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    Accept: "application/json",
  },
  params: {
    language: "en-US",
  },
});

export const FlickhiveInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});