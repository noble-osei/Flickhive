import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { LuSearch, LuMenu } from "react-icons/lu";

export default function Layout({ children }) {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </div>

      <div className="drawer-side z-30">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 min-h-full w-64 p-4">
          <span className="mb-4 text-3xl font-bold">
            Flick<span className="text-primary">hive</span>
          </span>
          <PrimaryMenuList />
        </ul>
      </div>
    </div>
  );
}

function PrimaryMenuList({ horizontal = false }) {
  if (horizontal) {
    return (
      <>
        <li className="dropdown dropdown-hover">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost h-8 font-semibold"
          >
            🎬 Movies
          </div>
          <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
            <li className="text-sm text-flick-muted">
              <Link to="/movies/popular">Popular</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/trending">Trending</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/upcoming">Upcoming</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/now-playing">Now Playing</Link>
            </li>
          </ul>
        </li>

        <li className="dropdown dropdown-hover">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost h-8 font-semibold"
          >
            📺 TV Shows
          </div>
          <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/popular">Popular</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/top-rated">Top Rated</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/on-tv">On TV</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/airing-today">Airing Today</Link>
            </li>
          </ul>
        </li>

        <li className="dropdown dropdown-hover">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost h-8 font-semibold"
          >
            👨‍🎤 People
          </div>
          <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
            <li className="text-sm text-flick-muted">
              <Link to="/people/popular">Popular</Link>
            </li>
          </ul>
        </li>
      </>
    );
  }

  // vertical (sidebar) — keep using <details> as before
  return (
    <>
      <li>
        <details>
          <summary className="font-semibold">🎬 Movies</summary>
          <ul>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/popular">Popular</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/trending">Trending</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/upcoming">Upcoming</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/movies/now-playing">Now Playing</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary className="font-semibold">📺 TV Shows</summary>
          <ul>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/popular">Popular</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/top-rated">Top Rated</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/on-tv">On TV</Link>
            </li>
            <li className="text-sm text-flick-muted">
              <Link to="/tv-shows/airing-today">Airing Today</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary className="font-semibold">👨‍🎤 People</summary>
          <ul>
            <li className="text-sm text-flick-muted">
              <Link to="/people/popular">Popular</Link>
            </li>
          </ul>
        </details>
      </li>
    </>
  );
}

function Navbar() {
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <nav className="bg-base-200 w-full">
      <div className="navbar lg:px-16 relative z-20 overflow-visible xl:px-0 max-w-7xl mx-auto">
        <SearchBar show={showSearchBar} setShow={setShowSearchBar} />
        <div className="navbar-start">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost lg:hidden"
          >
            <LuMenu className="inline-block" size={20} />
          </label>

          <Link to="/" className="text-3xl font-bold">
            Flick<span className="text-primary">hive</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:block">
          <ul className="menu menu-horizontal bg-base-200">
            <PrimaryMenuList horizontal={true} />
          </ul>
        </div>

        <div className="navbar-end">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setShowSearchBar(true)}
            aria-label="Open search"
          >
            <LuSearch className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link to="/login" className="btn btn-ghost text-lg rounded-full">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-base-300/20 w-full border-t border-base-200 py-8 px-4 lg:px-16 xl:px-0 mx-auto">
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm 
        text-base-content/50"
      >
        <p>© {new Date().getFullYear()} Flickhive</p>
        <p className="flex items-center gap-2">
          Movie and TV data provided by
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="text-base-content/70 hover:text-base-content transition-colors underline 
              underline-offset-2"
          >
            TMDB
          </a>
        </p>
      </div>
    </footer>
  );
}
