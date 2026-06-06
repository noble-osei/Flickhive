import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import TVShowDetails from "./pages/TvShowDetails.jsx";
import SeasonDetails from "./pages/SeasonDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<MovieDetails />} />
          <Route path="/tv/:tvShowId" element={<TVShowDetails />} />
          <Route
            path="/tv/:tvShowId/season/:seasonNumber"
            element={<SeasonDetails />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
