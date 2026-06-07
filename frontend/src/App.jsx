import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/layout/Layout.jsx";
import HomeSkeleton from "./components/ui/skeletons/Home.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const TVShowDetails = lazy(() => import("./pages/TvShowDetails.jsx"));
const SeasonDetails = lazy(() => import("./pages/SeasonDetails.jsx"));
const FullCastCrew = lazy(() => import("./pages/FullCastCrew.jsx"));

function App() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<MovieDetails />} />
          <Route path="/tv/:tvShowId" element={<TVShowDetails />} />
          <Route
            path="/tv/:tvShowId/season/:seasonNumber"
            element={<SeasonDetails />}
          />
          <Route path="/:mediaType/:mediaId/cast" element={<FullCastCrew />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
