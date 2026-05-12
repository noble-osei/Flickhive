function SearchBar({ setShow }) {
  return (
    <label className="input border-x-0 bg-base-100 rounded-none w-full outline-none focus-within:shadow-md transition-shadow duration-150">
      <style>{`
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-decoration {
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>
      <svg
        className="h-[1em] opacity-50 text-base-content"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        type="search"
        className="grow text-flick-muted outline-none"
        placeholder="Search"
      />
      <button
        className="btn btn-ghost btn-circle btn-sm"
        onClick={() => setShow(false)}
      >
        ✕
      </button>
    </label>
  );
}

export default SearchBar;
