import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/layout/Layout.jsx";
import HomeSkeleton from "./components/ui/skeletons/Home.jsx";
import DetailsSkeleton from "./components/ui/skeletons/Details.jsx";
import PersonDetailsSkeleton from "./components/ui/skeletons/PersonDetails.jsx";
import FullCastCrewSkeleton from "./components/ui/skeletons/FullCastCrew.jsx";
import SeasonDetailsSkeleton from "./components/ui/skeletons/SeasonDetails.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const TVShowDetails = lazy(() => import("./pages/TvShowDetails.jsx"));
const SeasonDetails = lazy(() => import("./pages/SeasonDetails.jsx"));
const FullCastCrew = lazy(() => import("./pages/FullCastCrew.jsx"));
const BrowsePage = lazy(() => import("./pages/Browse.jsx"));
const PersonDetails = lazy(() => import("./pages/PersonDetails.jsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AuthLayout = lazy(() => import("./components/layout/AuthLayout.jsx"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={
          <Suspense fallback={<HomeSkeleton />}>
            <Home />
          </Suspense>
        } />
        <Route path="/search" element={<SearchResults />} />

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
        <Route path="/movies/:movieId" element={
          <Suspense fallback={<DetailsSkeleton />}>
            <MovieDetails />
          </Suspense>
        } />

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
        <Route path="/tv/:tvShowId" element={
          <Suspense fallback={<DetailsSkeleton />}>
            <TVShowDetails />
          </Suspense>
        } />
        <Route
          path="/tv/:tvShowId/season/:seasonNumber"
          element={
            <Suspense fallback={<SeasonDetailsSkeleton />}>
              <SeasonDetails />
            </Suspense>
          }
        />

        <Route
          path="/people/popular"
          element={<BrowsePage pageKey="people-popular" />}
        />
        <Route path="/people/:personId" element={
          <Suspense fallback={<PersonDetailsSkeleton />}>
            <PersonDetails />
          </Suspense>
        } />

        <Route path="/:mediaType/:mediaId/cast" element={
          <Suspense fallback={<FullCastCrewSkeleton />}>
            <FullCastCrew />
          </Suspense>
        } />

        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
