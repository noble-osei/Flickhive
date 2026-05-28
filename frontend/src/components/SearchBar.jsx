import { useEffect, useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import useFetch from "../hooks/useFetch.jsx";
import { SearchMediaCard } from "./MovieCard.jsx";

function useDebounce(query, delay = 500) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
      setTyping(false);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [delay, query]);

  return { debouncedQuery, typing, setTyping };
}

function SearchBar({ show, setShow }) {
  const inputRef = useRef(null);
  const [showResults, setShowResults] = useState(true);
  const [query, setQuery] = useState("");
  const { debouncedQuery, typing, setTyping } = useDebounce(query);
  const { data, loading } = useFetch(
    `/search/multi?query=${debouncedQuery}&include_adult=false&page=1`,
  );

  useEffect(() => {
    if (show && inputRef.current) inputRef.current.focus();
  }, [show]);

  const closeSearchBar = () => {
    setShow(false);
    setQuery("");
  };

  return (
    <div
      className={`${
        !show
          ? "hidden"
          : "absolute inset-0 bg-base-200 lg:px-16 flex flex-col xl:px-0 max-w-7xl mx-auto"
      }`}
    >
      <label
        className={`input h-16 border-0 border-b border-white/10 bg-base-200 rounded-none w-full 
          outline-none focus-within:shadow-md transition-shadow duration-150 z-50`}
      >
        <style>{`
          input[type="search"]::-webkit-search-cancel-button,
          input[type="search"]::-webkit-search-decoration {
            -webkit-appearance: none;
            appearance: none;
          }
        `}</style>
        <IoSearchOutline className="h-5 w-5 opacity-50" aria-label="Search" />
        <input
          ref={inputRef}
          type="search"
          className="grow text-flick-muted outline-none"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setTyping(true);
          }}
          onFocus={() => setShowResults(true)}
        />
        <button
          className="btn btn-ghost btn-circle btn-sm"
          onClick={closeSearchBar}
          aria-label="Close Search"
        >
          ✕
        </button>
      </label>

      {query.length > 0 && showResults && (
        <div
          className="absolute top-16 inset-x-0 lg:inset-x-16 xl:inset-x-0 bg-base-200 shadow-xl 
          rounded-b-lg"
        >
          <div
            aria-label="Close Search Results"
            onClick={() => setShowResults(false)}
            className="fixed inset-0 w-screen h-screen bg-black/50 z-10 cursor-pointer"
          ></div>
          <div className="relative flex flex-col z-50 bg-base-200 rounded-b-[inherit]">
            {typing || loading ? (
              <p className="h-32 flex items-center justify-center">
                <span className="loading loading-dots loading-xl"></span>
              </p>
            ) : (
              <>
                {data.results?.slice(0, 5).map((r) => (
                  <SearchMediaCard
                    key={r.id}
                    item={r}
                    closeSearchBar={closeSearchBar}
                  />
                ))}

                {data.results?.length > 0 ? (
                  data.results?.length > 5 && (
                    <div
                      className="text-sm font-semibold py-3 px-4 hover:bg-secondary/10 
                      cursor-pointer border-t border-base-300 rounded-b-[inherit]"
                    >
                      See all results for "{query}"
                    </div>
                  )
                ) : (
                  <div className="py-4 px-4 text-sm opacity-50">
                    No results found.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
