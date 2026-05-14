function SearchBar({ show, setShow }) {
  return (
    <label
      className={`input h-full border-x-0 bg-base-100 rounded-none w-full outline-none 
      focus-within:shadow-md transition-shadow duration-150 z-100 ${show ? "absolute inset-0 bg-base-200 lg:px-8 flex items-center" : "hidden"}`}
    >
      <style>{`
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-decoration {
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-50"
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
