import { useCallback, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import SearchBar from "../search/SearchBar.jsx";
import { LuSearch, LuMenu } from "react-icons/lu";
import ScrollManager from "../../helpers/ScrollManager.jsx";

export default function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, [])

  return (
    <div className="drawer">
      <input id="my-drawer" readOnly type="checkbox" className="drawer-toggle" checked={isDrawerOpen} />

      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar setIsDrawerOpen={setIsDrawerOpen} />
        <ScrollManager />
        <Outlet />
        <Footer />
      </div>

      <div className="drawer-side z-30">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={closeDrawer}
        ></label>

        <ul className="menu bg-base-200 min-h-full w-64 p-4">
          <span className="mb-4 text-3xl font-bold">
            Flick<span className="text-primary">hive</span>
          </span>
          <PrimaryMenuList closeDrawer={closeDrawer} />
        </ul>
      </div>
    </div>
  );
}

const PRIMARY_MENU = [
  {
    label: "🎬 Movies",
    links: [
      { label: "Popular", to: "/movies/popular" },
      { label: "Top Rated", to: "/movies/top-rated" },
      { label: "Upcoming", to: "/movies/upcoming" },
      { label: "Now Playing", to: "/movies/now-playing" },
    ],
  },
  {
    label: "📺 TV Shows",
    links: [
      { label: "Popular", to: "/tv/popular" },
      { label: "Top Rated", to: "/tv/top-rated" },
      { label: "On TV", to: "/tv/on-tv" },
    ],
  },
  {
    label: "👨‍🎤 People",
    links: [{ label: "Popular", to: "/people/popular" }],
  },
];

function PrimaryMenuList({ closeDrawer, horizontal = false }) {
  const handleDesktopLinkClick = useCallback(() => {
    document.activeElement?.blur();
  }, []);

  if (horizontal) {
    return (
      <>
        {PRIMARY_MENU.map((section) => (
          <li key={section.label} className="dropdown dropdown-hover">
            <button
              type="button"
              className="btn btn-ghost h-8 font-semibold"
            >
              {section.label}
            </button>

            <ul className="dropdown-content menu bg-base-200 rounded-box -mt-px pt-3 z-50 w-44 shadow">
              {section.links.map((link) => (
                <li key={link.to} className="text-sm text-flick-muted">
                  <Link to={link.to} onClick={handleDesktopLinkClick}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </>
    );
  }

  return (
    <>
      {PRIMARY_MENU.map((section) => (
        <li key={section.label}>
          <details>
            <summary className="font-semibold">{section.label}</summary>

            <ul>
              {section.links.map((link) => (
                <li key={link.to} className="text-sm text-flick-muted">
                  <Link to={link.to} onClick={closeDrawer}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </>
  );
}

function Navbar({ setIsDrawerOpen }) {
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <nav className="bg-base-200 w-full">
      <div className="navbar lg:px-16 relative z-20 overflow-visible xl:px-0 max-w-7xl mx-auto">
        <SearchBar show={showSearchBar} setShow={setShowSearchBar} />
        <div className="navbar-start">
          <label
            onClick={() => setIsDrawerOpen(true)}
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
