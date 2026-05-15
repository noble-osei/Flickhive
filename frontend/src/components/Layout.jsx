import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";

function Layout({ children }) {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <Navbar />
        <main>{children}</main>
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
          <div tabIndex={0} role="button" className="btn btn-ghost h-8 font-semibold">🎬 Movies</div>
          <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
            <li className="text-sm text-flick-muted"><Link to="/movies/popular">Popular</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/movies/trending">Trending</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/movies/upcoming">Upcoming</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/movies/now-playing">Now Playing</Link></li>
          </ul>
        </li>

        <li className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-ghost h-8 font-semibold">📺 TV Shows</div>
          <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/popular">Popular</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/top-rated">Top Rated</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/on-tv">On TV</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/airing-today">Airing Today</Link></li>
          </ul>
        </li>

        <li className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-ghost h-8 font-semibold">👨‍🎤 People</div>
          <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
            <li className="text-sm text-flick-muted"><Link to="/people/popular">Popular</Link></li>
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
            <li className="text-sm text-flick-muted"><Link to="/movies/popular">Popular</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/movies/trending">Trending</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/movies/upcoming">Upcoming</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/movies/now-playing">Now Playing</Link></li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary className="font-semibold">📺 TV Shows</summary>
          <ul>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/popular">Popular</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/top-rated">Top Rated</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/on-tv">On TV</Link></li>
            <li className="text-sm text-flick-muted"><Link to="/tv-shows/airing-today">Airing Today</Link></li>
          </ul>
        </details>
      </li>
      <li>
        <details>
          <summary className="font-semibold">👨‍🎤 People</summary>
          <ul>
            <li className="text-sm text-flick-muted"><Link to="/people/popular">Popular</Link></li>
          </ul>
        </details>
      </li>
    </>
  );
}

function Navbar() {
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <div className="bg-base-200 w-full">
      <div className="navbar lg:px-16 relative z-20 overflow-visible xl:px-0 max-w-7xl mx-auto">
        <SearchBar show={showSearchBar} setShow={setShowSearchBar} />
        <div className="navbar-start">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>{" "}
            </svg>
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
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />{" "}
            </svg>
          </button>

          <Link to="/login" className="btn btn-ghost text-lg rounded-full">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Layout;
