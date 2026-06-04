import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import TVShowDetails from "./pages/TvShowDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<MovieDetails />} />
          <Route path="/tv/:tvShowId" element={<TVShowDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
