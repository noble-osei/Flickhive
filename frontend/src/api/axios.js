import axios from "axios";

export const tmdbInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmYzYTc1OTUzYTgxNWIxNTJhYzE3OGEyYTM2NmVjZiIsIm5iZiI6MTc3ODAwMzM3Mi41MDgsInN1YiI6IjY5ZmEyZGFjNmY4Zjk2ZTBmYzM1ZmQxMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bxZd-6w3Y9AtEoH2rCcJ-592Mie_boDsHNdJILk3pjI",
    Accept: "application/json",
  },
  params: {
    language: "en-US",
  },
});

export const FlickhiveInstance = axios.create({
  baseURL: "http://localhost:5004",
});