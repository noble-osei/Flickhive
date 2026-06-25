import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  LuClapperboard,
  LuSearch,
  LuStar,
} from "react-icons/lu";
import { FaHome } from "react-icons/fa";

import useFetch from "../hooks/useFetch.jsx";
import PageError from "../components/ui/PageError.jsx";
import BrowseGridSkeleton from "../components/ui/skeletons/BrowseGrid.jsx";
import { formatProfession } from "../helpers/media.js";
import { Pagination } from "../components/media/MediaDetails.jsx";

const IMG = import.meta.env.VITE_IMG;

const TMDB_ENDPOINT = {
  all: "multi",
  movies: "movie",
  tv: "tv",
  people: "person",
};

const TYPE_LABELS = {
  all: "All",
  movies: "Movies",
  tv: "TV Shows",
  people: "People",
};

const VALID_TYPES = Object.keys(TMDB_ENDPOINT);

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query")?.trim() ?? "";
  const rawType = searchParams.get("type") ?? "all";
  const type = VALID_TYPES.includes(rawType) ? rawType : "all";
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);

  const searchUrl = useMemo(() => {
    if (!query) return null;

    const endpoint = TMDB_ENDPOINT[type];

    const params = new URLSearchParams({
      query,
      page: String(page),
      include_adult: "false",
    });

    return `/search/${endpoint}?${params.toString()}`;
  }, [query, type, page]);

  const { data, loading, error, refetch } = useFetch(
    searchUrl,
    Boolean(searchUrl),
  );

  const results = data?.results ?? [];
  const totalResults = data?.total_results ?? 0;
  const totalPages = Math.min(data?.total_pages ?? 1, 500);

  function changeResultsType(nextType) {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);

        if (nextType === "all") {
          nextParams.delete("type");
        } else {
          nextParams.set("type", nextType);
        }

        nextParams.set("page", "1");

        return nextParams;
      },
      { replace: true },
    );
  }

  function changeResultsPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) return;

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set("page", String(nextPage));
      return nextParams;
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (error) {
    return (
      <PageError
        title="Couldn't load search results"
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {query ? `Search results for "${query}" | Flickhive` : "Search | Flickhive"}
        </title>
        <meta
          name="description"
          content={
            query
              ? `Search results for ${query} on Flickhive.`
              : "Search for movies, TV shows, and people on Flickhive."
          }
        />
        {!query && <meta name="robots" content="noindex" />}
      </Helmet>

      <main className="min-h-screen bg-base-300/30 pb-10">
        <SearchHeader query={query} />

        <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          {!query ? (
            <NoQueryState />
          ) : (
            <>
              <SearchToolbar
                type={type}
                totalResults={totalResults}
                changeResultsType={changeResultsType}
              />

              {loading ? (
                <BrowseGridSkeleton personPage={type === "people"} />
              ) : results.length > 0 ? (
                <>
                  <ResultsGrid results={results} activeType={type} />

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    updatePage={changeResultsPage}
                  />
                </>
              ) : (
                <EmptySearchState query={query} />
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

function SearchHeader({ query }) {
  return (
    <header className="max-w-7xl mx-auto px-4 pt-8 pb-6 lg:px-16 xl:px-0">
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-base-content/50 mb-3"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-base-content/80">Search</li>
        </ol>
      </nav>

      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
        Search Results
      </h1>

      {query ? (
        <p className="text-base-content/60 mt-2 max-w-2xl">
          Showing results for{" "}
          <span className="text-base-content font-semibold">“{query}”</span>
        </p>
      ) : (
        <p className="text-base-content/60 mt-2 max-w-2xl">
          Use the navbar search to find movies, TV shows, and people.
        </p>
      )}
    </header>
  );
}

function SearchToolbar({ type, totalResults, changeResultsType }) {
  return (
    <div className="flex flex-col gap-4 border-y border-white/10 py-4 mb-6">
      <p className="text-sm text-base-content/60">
        {totalResults.toLocaleString()} results
      </p>

      <div
        role="tablist"
        aria-label="Search result type"
        className="tabs tabs-border overflow-x-auto no-scrollbar"
      >
        {VALID_TYPES.map((itemType) => {
          const isActive = type === itemType;

          return (
            <button
              key={itemType}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`tab shrink-0 ${isActive ? "tab-active" : ""}`}
              onClick={() => changeResultsType(itemType)}
            >
              {TYPE_LABELS[itemType]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsGrid({ results, activeType }) {
  const validResults = results.filter((item) => {
    const mediaType = getMediaType(item, activeType);
    return mediaType === "movie" || mediaType === "tv" || mediaType === "person";
  });

  return (
    <section aria-labelledby="search-results-title">
      <h2 id="search-results-title" className="sr-only">
        Search results
      </h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 
        gap-4 lg:gap-6"
      >
        {validResults.map((item, index) => (
          <SearchResultCard
            key={`${getMediaType(item, activeType)}-${item.id}`}
            item={item}
            activeType={activeType}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function SearchResultCard({ item, activeType, index }) {
  const mediaType = getMediaType(item, activeType);

  if (mediaType === "person") {
    return <PersonResultCard person={item} index={index} />;
  }

  return <MediaResultCard item={item} mediaType={mediaType} index={index} />;
}

function MediaResultCard({ item, mediaType, index }) {
  const isMovie = mediaType === "movie";
  const title = isMovie ? item.title : item.name;
  const date = isMovie ? item.release_date : item.first_air_date;

  const poster = item.poster_path
    ? `${IMG}/w342${item.poster_path}`
    : `/${isMovie ? "movie" : "tv"}.svg`;

  return (
    <Link
      to={`/${isMovie ? "movies" : "tv"}/${item.id}`}
      className="group min-w-0"
    >
      <div className="relative overflow-hidden rounded-lg bg-base-200 aspect-2/3">
        <img
          src={poster}
          alt={`${title} poster`}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          loading={index < 5 ? "eager" : "lazy"}
          fetchPriority={index < 5 ? "auto" : "low"}
          decoding={index < 5 ? "sync" : "async"}
        />

        <span className="absolute top-2 left-2 badge badge-neutral bg-black/65 border-white/10">
          {isMovie ? "Movie" : "TV Show"}
        </span>

        {item.vote_average > 0 && (
          <span
            className="absolute bottom-2 right-2 badge badge-neutral gap-1 
            border-white/10 bg-black/65 text-accent"
          >
            <LuStar size={12} fill="currentColor" />
            {item.vote_average.toFixed(1)}
          </span>
        )}
      </div>

      <h2 className="mt-3 text-sm font-bold line-clamp-2 group-hover:text-primary transition">
        {title}
      </h2>

      <p className="text-sm text-base-content/55">
        {date?.slice(0, 4) || "Unknown year"}
      </p>
    </Link>
  );
}

function PersonResultCard({ person, index }) {
  const image = person.profile_path
    ? `${IMG}/w342${person.profile_path}`
    : "/person.svg";

  const knownFor = person.known_for?.[0];
  const knownForTitle = knownFor?.title ?? knownFor?.name;

  return (
    <Link to={`/people/${person.id}`} className="group min-w-0">
      <div className="relative overflow-hidden rounded-lg bg-base-200 aspect-2/3">
        <img
          src={image}
          alt={person.name}
          className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
          loading={index < 5 ? "eager" : "lazy"}
          fetchPriority={index < 5 ? "auto" : "low"}
          decoding={index < 5 ? "sync" : "async"}
        />

        <span className="absolute top-2 left-2 badge badge-neutral bg-black/65 border-white/10">
          Person
        </span>
      </div>

      <h2 className="mt-3 text-sm font-bold line-clamp-2 group-hover:text-primary transition">
        {person.name}
      </h2>

      <p className="text-sm text-base-content/55">
        {formatProfession(person.known_for_department) || "Contributor"}
      </p>

      {knownForTitle && (
        <p className="text-xs text-base-content/45 line-clamp-1 mt-1">
          Known for: {knownForTitle}
        </p>
      )}
    </Link>
  );
}

function NoQueryState() {
  return (
    <section className="rounded-box border border-white/10 bg-primary/10 p-8 text-center">
      <div
        className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center 
        justify-center mx-auto mb-4"
        aria-hidden="true"
      >
        <LuSearch size={30} />
      </div>

      <h2 className="text-xl font-bold">Start searching from the navbar</h2>

      <p className="text-base-content/60 mt-2 max-w-md mx-auto">
        Use the search icon above to find movies, TV shows, and people across
        Flickhive.
      </p>

      <Link to="/" className="btn btn-primary rounded-full mt-5">
        <FaHome aria-hidden="true" />
        Back to Home
      </Link>
    </section>
  );
}

function EmptySearchState({ query }) {
  return (
    <section className="rounded-box border border-white/10 bg-primary/10 p-8 text-center">
      <div
        className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center 
        justify-center mx-auto mb-4"
        aria-hidden="true"
      >
        <LuSearch size={30} />
      </div>

      <h2 className="text-xl font-bold">No results found</h2>

      <p className="text-base-content/60 mt-2">
        We couldn't find anything matching{" "}
        <span className="text-base-content font-semibold">“{query}”</span>.
      </p>

      <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
        <Link to="/" className="btn btn-primary rounded-full">
          <FaHome aria-hidden="true" />
          Go Home
        </Link>

        <Link to="/movies/popular" className="btn btn-outline rounded-full">
          <LuClapperboard aria-hidden="true" />
          Popular Movies
        </Link>
      </div>
    </section>
  );
}

function getMediaType(item, activeType) {
  if (item.media_type) return item.media_type;

  if (activeType === "movies") return "movie";
  if (activeType === "tv") return "tv";
  if (activeType === "people") return "person";

  return null;
}