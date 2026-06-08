import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useRef } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
  LuRotateCcw,
  LuX,
} from "react-icons/lu";

import useFetch from "../hooks/useFetch.jsx";
import BrowseMediaCard from "../components/media/BrowseMediaCard.jsx";
import PersonBrowseCard from "../components/media/PersonBrowseCard.jsx";
import BrowseGridSkeleton from "../components/ui/skeletons/BrowseGridSkeleton.jsx";
import PageError from "../components/ui/PageError.jsx";
import { Helmet } from "react-helmet-async";

const PAGE_CONFIG = {
  "movies-popular": {
    title: "Popular Movies",
    description: "Discover movies people are watching right now.",
    mediaType: "movies",
    apiMediaType: "movie",
    defaultEndpoint: "/movie/popular",
    defaultSort: "popularity.desc",
  },

  "movies-upcoming": {
    title: "Upcoming Movies",
    description: "Explore movies arriving soon.",
    mediaType: "movies",
    apiMediaType: "movie",
    defaultEndpoint: "/movie/upcoming",
    defaultSort: "popularity.desc",
  },

  "movies-now-playing": {
    title: "Now Playing",
    description: "Find movies currently showing in cinemas.",
    mediaType: "movies",
    apiMediaType: "movie",
    defaultEndpoint: "/movie/now_playing",
    defaultSort: "popularity.desc",
  },

  "movies-top-rated": {
    title: "Top Rated Movies",
    description: "Browse highly rated movies from across the years.",
    mediaType: "movies",
    apiMediaType: "movie",
    defaultEndpoint: "/movie/top_rated",
    defaultSort: "vote_average.desc",
  },

  "tv-popular": {
    title: "Popular TV Shows",
    description: "Discover shows viewers are watching right now.",
    mediaType: "tv",
    apiMediaType: "tv",
    defaultEndpoint: "/tv/popular",
    defaultSort: "popularity.desc",
  },

  "tv-top-rated": {
    title: "Top Rated TV Shows",
    description: "Browse highly rated series worth adding to your watchlist.",
    mediaType: "tv",
    apiMediaType: "tv",
    defaultEndpoint: "/tv/top_rated",
    defaultSort: "vote_average.desc",
  },

  "tv-on-the-air": {
    title: "On the Air",
    description: "Explore TV shows with episodes currently airing.",
    mediaType: "tv",
    apiMediaType: "tv",
    defaultEndpoint: "/tv/on_the_air",
    defaultSort: "popularity.desc",
  },

  "people-popular": {
    title: "Popular People",
    description: "Explore actors, directors, and creators currently trending.",
    mediaType: "people",
    apiMediaType: "person",
    defaultEndpoint: "/person/popular",
    defaultSort: null,
  },
};

export default function BrowsePage({ pageKey }) {
  const config = PAGE_CONFIG[pageKey];

  if (!config) {
    throw new Error(`Unknown browse page configuration: ${pageKey}`);
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const filterDrawerRef = useRef(null);

  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const sort = searchParams.get("sort") ?? config.defaultSort ?? "";
  const genreIds = useMemo(() => {
    return searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
  }, [searchParams]);
  const fromYear = searchParams.get("from") ?? "";
  const toYear = searchParams.get("to") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const language = searchParams.get("language") ?? "";

  const isPersonPage = config.mediaType === "people";

  const hasFilters =
    !isPersonPage &&
    (genreIds.length > 0 || fromYear || toYear || rating || language);

  const hasCustomSort = !isPersonPage && sort && sort !== config.defaultSort;

  const activeFilterCount =
    genreIds.length +
    Number(Boolean(fromYear || toYear)) +
    Number(Boolean(rating)) +
    Number(Boolean(language));

  const browseUrl = useMemo(() => {
    if (isPersonPage) {
      return `${config.defaultEndpoint}?page=${page}`;
    }

    if (!hasFilters && !hasCustomSort) {
      return `${config.defaultEndpoint}?page=${page}`;
    }

    const params = new URLSearchParams({
      page: String(page),
      include_adult: "false",
      sort_by: sort || config.defaultSort,
    });

    if (genreIds.length > 0) {
      params.set("with_genres", genreIds.join(","));
    }

    if (rating) {
      params.set("vote_average.gte", rating);
    }

    if (language) {
      params.set("with_original_language", language);
    }

    if (config.apiMediaType === "movie") {
      if (fromYear) params.set("primary_release_date.gte", `${fromYear}-01-01`);
      if (toYear) params.set("primary_release_date.lte", `${toYear}-12-31`);
    }

    if (config.apiMediaType === "tv") {
      if (fromYear) params.set("first_air_date.gte", `${fromYear}-01-01`);
      if (toYear) params.set("first_air_date.lte", `${toYear}-12-31`);
    }

    return `/discover/${config.apiMediaType}?${params.toString()}`;
  }, [
    config,
    genreIds,
    fromYear,
    toYear,
    hasCustomSort,
    hasFilters,
    isPersonPage,
    language,
    page,
    rating,
    sort,
  ]);

  const genresQuery = useFetch(
    isPersonPage ? null : `/genre/${config.apiMediaType}/list`,
    !isPersonPage,
  );

  const { data, loading, error, refetch } = useFetch(browseUrl);

  const updateParam = (name, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(name, String(value));
    } else {
      next.delete(name);
    }

    next.set("page", "1");
    setSearchParams(next);
  };

  const updatePage = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    const next = new URLSearchParams();

    if (config.defaultSort) {
      next.set("sort", config.defaultSort);
    }

    next.set("page", "1");
    setSearchParams(next);
  };

  const toggleGenre = (genreId) => {
    const id = String(genreId);

    const nextGenres = genreIds.includes(id)
      ? genreIds.filter((currentId) => currentId !== id)
      : [...genreIds, id];

    updateParam("genres", nextGenres.join(","));
  };

  if (error) {
    return (
      <PageError
        title={`Couldn't load ${config.title.toLowerCase()}`}
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  const results = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 1, 500);
  const totalResults = data?.total_results ?? 0;
  const genres = genresQuery.data?.genres ?? [];

  return (
    <>
      <Helmet>
        <title>{`${config.title} | Flickhive`}</title>
        <meta
          name="description"
          content={config.description}
        />
      </Helmet>

      <main className="min-h-screen bg-base-300/30 pb-10">
        <BrowseHeader config={config} />

        <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <BrowseToolbar
            config={config}
            totalResults={totalResults}
            sort={sort}
            activeFilterCount={activeFilterCount}
            openFilters={() => filterDrawerRef.current?.showModal()}
            updateSort={(value) => updateParam("sort", value)}
          />

          {!isPersonPage && activeFilterCount > 0 && (
            <ActiveFilterChips
              genres={genres}
              genreIds={genreIds}
              fromYear={fromYear}
              toYear={toYear}
              rating={rating}
              language={language}
              toggleGenre={toggleGenre}
              clearDate={() => {
                updateParam("from", "");
                updateParam("to", "");
              }}
              clearRating={() => updateParam("rating", "")}
              clearLanguage={() => updateParam("language", "")}
              resetFilters={resetFilters}
            />
          )}

          <div
            className={`mt-6 grid gap-6 ${
              isPersonPage ? "grid-cols-1" : "lg:grid-cols-[240px_1fr]"
            }`}
          >
            {!isPersonPage && (
              <aside className="hidden lg:block">
                <FilterPanel
                  genres={genres}
                  genreIds={genreIds}
                  fromYear={fromYear}
                  toYear={toYear}
                  rating={rating}
                  language={language}
                  toggleGenre={toggleGenre}
                  updateParam={updateParam}
                  resetFilters={resetFilters}
                />
              </aside>
            )}

            <section aria-labelledby="results-title">
              <h2 id="results-title" className="sr-only">
                {config.title} results
              </h2>

              {loading ? (
                <BrowseGridSkeleton personPage={isPersonPage} />
              ) : results.length > 0 ? (
                <BrowseGrid
                  results={results}
                  mediaType={config.mediaType}
                  personPage={isPersonPage}
                />
              ) : (
                <EmptyResults resetFilters={resetFilters} />
              )}

              {!loading && results.length > 0 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  updatePage={updatePage}
                />
              )}
            </section>
          </div>
        </section>

        {!isPersonPage && (
          <MobileFilterDrawer
            drawerRef={filterDrawerRef}
            genres={genres}
            genreIds={genreIds}
            fromYear={fromYear}
            toYear={toYear}
            rating={rating}
            language={language}
            toggleGenre={toggleGenre}
            updateParam={updateParam}
            resetFilters={resetFilters}
          />
        )}
      </main>
    </>
  );
}

function BrowseHeader({ config }) {
  const parentLabel =
    config.mediaType === "movies"
      ? "Movies"
      : config.mediaType === "tv"
        ? "TV Shows"
        : "People";

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
          <li>{parentLabel}</li>
          <li aria-hidden="true">/</li>
          <li className="text-base-content/80">{config.title}</li>
        </ol>
      </nav>

      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
        {config.title}
      </h1>

      <p className="text-base-content/60 mt-2 max-w-2xl">
        {config.description}
      </p>
    </header>
  );
}

function BrowseToolbar({
  config,
  totalResults,
  sort,
  activeFilterCount,
  openFilters,
  updateSort,
}) {
  const isPersonPage = config.mediaType === "people";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-white/10 py-4">
      <p className="text-sm text-base-content/60">
        {totalResults.toLocaleString()} results
      </p>

      {!isPersonPage && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-outline rounded-full lg:hidden"
            onClick={openFilters}
          >
            <LuFilter />
            Filters
            {activeFilterCount > 0 && (
              <span className="badge badge-primary badge-sm">
                {activeFilterCount}
              </span>
            )}
          </button>

          <label className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-base-content/60">
              Sort by:
            </span>

            <select
              className="select select-bordered rounded-full bg-base-200"
              value={sort}
              onChange={(event) => updateSort(event.target.value)}
              aria-label="Sort results"
            >
              <option value="popularity.desc">Popularity: High to Low</option>
              <option value="popularity.asc">Popularity: Low to High</option>
              <option value="vote_average.desc">Rating: High to Low</option>
              <option value="vote_average.asc">Rating: Low to High</option>

              {config.apiMediaType === "movie" ? (
                <>
                  <option value="primary_release_date.desc">
                    Release Date: Newest First
                  </option>
                  <option value="primary_release_date.asc">
                    Release Date: Oldest First
                  </option>
                </>
              ) : (
                <>
                  <option value="first_air_date.desc">
                    First Air Date: Newest First
                  </option>
                  <option value="first_air_date.asc">
                    First Air Date: Oldest First
                  </option>
                </>
              )}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

function BrowseGrid({ results, mediaType, personPage }) {
  return (
    <div
      className={
        personPage
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
      }
    >
      {results.map((item) =>
        personPage ? (
          <PersonBrowseCard key={item.id} person={item} />
        ) : (
          <BrowseMediaCard key={item.id} item={item} mediaType={mediaType} />
        ),
      )}
    </div>
  );
}

function FilterPanel({
  genres,
  genreIds,
  fromYear,
  toYear,
  rating,
  language,
  toggleGenre,
  updateParam,
  resetFilters,
}) {
  return (
    <div className="rounded-box bg-primary/12 border border-white/10 p-4 sticky top-20">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">Filters</h2>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={resetFilters}
        >
          <LuRotateCcw />
          Reset
        </button>
      </div>

      <GenreFilters
        genres={genres}
        genreIds={genreIds}
        toggleGenre={toggleGenre}
      />

      <div className="divider" />

      <YearFilters
        fromYear={fromYear}
        toYear={toYear}
        updateParam={updateParam}
      />

      <div className="divider" />

      <RatingFilter rating={rating} updateParam={updateParam} />

      <div className="divider" />

      <LanguageFilter language={language} updateParam={updateParam} />
    </div>
  );
}

function GenreFilters({ genres, genreIds, toggleGenre }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-semibold mb-3">Genres</legend>

      <div className="space-y-2">
        {genres.map((genre) => (
          <label
            key={genre.id}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={genreIds.includes(String(genre.id))}
              onChange={() => toggleGenre(genre.id)}
            />
            <span className="text-base-content/70">{genre.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function YearFilters({ fromYear, toYear, updateParam }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-3">Release Year</legend>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          inputMode="numeric"
          min="1900"
          max="2100"
          className="input input-bordered w-full bg-base-200"
          placeholder="From"
          value={fromYear}
          onChange={(event) => updateParam("from", event.target.value)}
          aria-label="Release year from"
        />

        <input
          type="number"
          inputMode="numeric"
          min="1900"
          max="2100"
          className="input input-bordered w-full bg-base-200"
          placeholder="To"
          value={toYear}
          onChange={(event) => updateParam("to", event.target.value)}
          aria-label="Release year to"
        />
      </div>
    </fieldset>
  );
}

function RatingFilter({ rating, updateParam }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-3">Minimum Rating</legend>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          className="range range-primary range-sm"
          value={rating || 0}
          onChange={(event) => updateParam("rating", event.target.value)}
          aria-label="Minimum rating"
        />

        <span className="text-sm text-primary font-bold w-6">
          {rating || 0}
        </span>
      </div>
    </fieldset>
  );
}

function LanguageFilter({ language, updateParam }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold block mb-3">
        Original Language
      </span>

      <select
        className="select select-bordered w-full bg-base-200"
        value={language}
        onChange={(event) => updateParam("language", event.target.value)}
      >
        <option value="">Any Language</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="ko">Korean</option>
        <option value="ja">Japanese</option>
        <option value="zh">Chinese</option>
      </select>
    </label>
  );
}

function ActiveFilterChips({
  genres,
  genreIds,
  fromYear,
  toYear,
  rating,
  language,
  toggleGenre,
  clearDate,
  clearRating,
  clearLanguage,
  resetFilters,
}) {
  const genreMap = Object.fromEntries(
    genres.map((genre) => [String(genre.id), genre.name]),
  );

  return (
    <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
      {genreIds.map((genreId) => (
        <FilterChip
          key={genreId}
          label={genreMap[genreId] || "Genre"}
          onRemove={() => toggleGenre(genreId)}
        />
      ))}

      {(fromYear || toYear) && (
        <FilterChip
          label={`${fromYear || "Any"}–${toYear || "Now"}`}
          onRemove={clearDate}
        />
      )}

      {rating && (
        <FilterChip label={`Rating: ${rating}+`} onRemove={clearRating} />
      )}

      {language && (
        <FilterChip
          label={`Language: ${language.toUpperCase()}`}
          onRemove={clearLanguage}
        />
      )}

      <button
        type="button"
        className="btn btn-ghost btn-sm rounded-full shrink-0"
        onClick={resetFilters}
      >
        Clear all
      </button>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      className="badge badge-primary badge-outline gap-1 py-3 shrink-0"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
    >
      {label}
      <LuX size={13} />
    </button>
  );
}

function MobileFilterDrawer({
  drawerRef,
  genres,
  genreIds,
  fromYear,
  toYear,
  rating,
  language,
  toggleGenre,
  updateParam,
  resetFilters,
}) {
  return (
    <dialog ref={drawerRef} className="modal modal-bottom lg:hidden">
      <div className="modal-box bg-base-200 max-h-[88vh]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Filters</h2>
            <p className="text-sm text-base-content/60">Refine your results.</p>
          </div>

          <form method="dialog">
            <button
              type="submit"
              className="btn btn-circle btn-ghost btn-sm"
              aria-label="Close filters"
            >
              <LuX />
            </button>
          </form>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold mb-3">Genres</legend>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const active = genreIds.includes(String(genre.id));

              return (
                <button
                  key={genre.id}
                  type="button"
                  className={`btn btn-sm rounded-full ${
                    active ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="divider" />

        <YearFilters
          fromYear={fromYear}
          toYear={toYear}
          updateParam={updateParam}
        />

        <div className="divider" />

        <RatingFilter rating={rating} updateParam={updateParam} />

        <div className="divider" />

        <LanguageFilter language={language} updateParam={updateParam} />

        <div className="modal-action grid grid-cols-2 gap-3">
          <button
            type="button"
            className="btn btn-outline rounded-full"
            onClick={resetFilters}
          >
            Reset
          </button>

          <form method="dialog">
            <button
              type="submit"
              className="btn btn-primary rounded-full w-full"
            >
              Show Results
            </button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Close filters">
          close
        </button>
      </form>
    </dialog>
  );
}

function Pagination({ page, totalPages, updatePage }) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Results pagination"
      className="flex justify-center items-center gap-2 mt-10"
    >
      <button
        type="button"
        className="btn btn-sm btn-outline rounded-full"
        disabled={page <= 1}
        onClick={() => updatePage(page - 1)}
        aria-label="Previous page"
      >
        <LuChevronLeft />
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={`btn btn-sm btn-circle ${
            pageNumber === page ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => updatePage(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        className="btn btn-sm btn-outline rounded-full"
        disabled={page >= totalPages}
        onClick={() => updatePage(page + 1)}
        aria-label="Next page"
      >
        <LuChevronRight />
      </button>
    </nav>
  );
}

function EmptyResults({ resetFilters }) {
  return (
    <section className="rounded-box border border-white/10 bg-primary/10 p-8 text-center">
      <h2 className="text-xl font-bold">No results found</h2>

      <p className="text-base-content/60 mt-2">
        Try removing one or more filters to see more titles.
      </p>

      <button
        type="button"
        className="btn btn-primary rounded-full mt-5"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </section>
  );
}

function getVisiblePages(currentPage, totalPages) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
