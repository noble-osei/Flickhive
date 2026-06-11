import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/layout/Layout.jsx";
import HomeSkeleton from "./components/ui/skeletons/Home.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const TVShowDetails = lazy(() => import("./pages/TvShowDetails.jsx"));
const SeasonDetails = lazy(() => import("./pages/SeasonDetails.jsx"));
const FullCastCrew = lazy(() => import("./pages/FullCastCrew.jsx"));
const BrowsePage = lazy(() => import("./pages/Browse.jsx"));
const PersonDetails = lazy(() => import("./pages/PersonDetails.jsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));

function App() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/movies/popular"
            element={<BrowsePage pageKey="movies-popular" />}
          />
          <Route
            path="/movies/top-rated"
            element={<BrowsePage pageKey="movies-top-rated" />}
          />
          <Route
            path="/movies/upcoming"
            element={<BrowsePage pageKey="movies-upcoming" />}
          />
          <Route
            path="/movies/now-playing"
            element={<BrowsePage pageKey="movies-now-playing" />}
          />
          <Route path="/movies/:movieId" element={<MovieDetails />} />

          <Route
            path="/tv/popular"
            element={<BrowsePage pageKey="tv-popular" />}
          />
          <Route
            path="/tv/top-rated"
            element={<BrowsePage pageKey="tv-top-rated" />}
          />
          <Route
            path="/tv/on-tv"
            element={<BrowsePage pageKey="tv-on-the-air" />}
          />
          <Route path="/tv/:tvShowId" element={<TVShowDetails />} />
          <Route
            path="/tv/:tvShowId/season/:seasonNumber"
            element={<SeasonDetails />}
          />

          <Route
            path="/people/popular"
            element={<BrowsePage pageKey="people-popular" />}
          />
          <Route path="/people/:personId" element={<PersonDetails />} />

          <Route path="/:mediaType/:mediaId/cast" element={<FullCastCrew />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
