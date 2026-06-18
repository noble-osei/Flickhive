import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import {
  LuFilter,
  LuRotateCcw,
  LuX,
} from "react-icons/lu";
import { Helmet } from "react-helmet-async";

import useFetch from "../hooks/useFetch.jsx";
import BrowseMediaCard from "../components/media/BrowseMediaCard.jsx";
import PersonBrowseCard from "../components/media/PersonBrowseCard.jsx";
import BrowseGridSkeleton from "../components/ui/skeletons/BrowseGrid.jsx";
import PageError from "../components/ui/PageError.jsx";
import { Pagination } from "../components/media/MediaDetails.jsx";

const NOW_PLAYING_DAYS_BACK = 30;
const UPCOMING_DAYS_FORWARD = 90;
const ON_THE_AIR_DAYS_FORWARD = 7;

const PAGE_CONFIG = {
  "movies-popular": {
    title: "Popular Movies",
    description: "Discover movies people are watching right now.",
    mediaType: "movies",
    apiMediaType: "movie",
    preset: {
      endpoint: "/discover/movie",
      params: {
        include_adult: "false",
        include_video: "false",
        sort_by: "popularity.desc",
      },
    },
  },

  "movies-upcoming": {
    title: "Upcoming Movies",
    description:
      "Explore theatrical movie releases arriving in the next 90 days.",
    mediaType: "movies",
    apiMediaType: "movie",
    preset: {
      endpoint: "/discover/movie",
      params: () => ({
        include_adult: "false",
        include_video: "false",
        sort_by: "popularity.desc",
        with_release_type: "2|3",
        "primary_release_date.gte": getOffsetDate(1),
        "primary_release_date.lte": getOffsetDate(UPCOMING_DAYS_FORWARD),
      }),
    },
  },

  "movies-now-playing": {
    title: "Now Playing",
    description: "Find popular theatrical movie releases currently showing.",
    mediaType: "movies",
    apiMediaType: "movie",
    preset: {
      endpoint: "/discover/movie",
      params: () => ({
        include_adult: "false",
        include_video: "false",
        sort_by: "popularity.desc",
        with_release_type: "2|3",
        "release_date.gte": getOffsetDate(-NOW_PLAYING_DAYS_BACK),
        "release_date.lte": getOffsetDate(0),
      }),
    },
  },

  "movies-top-rated": {
    title: "Top Rated Movies",
    description: "Browse highly rated movies with enough audience votes.",
    mediaType: "movies",
    apiMediaType: "movie",
    preset: {
      endpoint: "/discover/movie",
      params: {
        include_adult: "false",
        include_video: "false",
        sort_by: "vote_average.desc",
        "vote_count.gte": "200",
        without_genres: "99,10755",
      },
    },
  },

  "tv-popular": {
    title: "Popular TV Shows",
    description: "Discover shows viewers are watching right now.",
    mediaType: "tv",
    apiMediaType: "tv",
    preset: {
      endpoint: "/discover/tv",
      params: {
        include_adult: "false",
        sort_by: "popularity.desc",
      },
    },
  },

  "tv-top-rated": {
    title: "Top Rated TV Shows",
    description: "Browse highly rated series with enough audience votes.",
    mediaType: "tv",
    apiMediaType: "tv",
    preset: {
      endpoint: "/discover/tv",
      params: {
        include_adult: "false",
        sort_by: "vote_average.desc",
        "vote_count.gte": "100",
      },
    },
  },

  "tv-on-the-air": {
    title: "On the Air",
    description:
      "Explore TV shows with episodes airing during the next 7 days.",
    mediaType: "tv",
    apiMediaType: "tv",
    preset: {
      endpoint: "/discover/tv",
      params: () => ({
        include_adult: "false",
        sort_by: "popularity.desc",
        "air_date.gte": getOffsetDate(0),
        "air_date.lte": getOffsetDate(ON_THE_AIR_DAYS_FORWARD),
      }),
    },
  },

  "people-popular": {
    title: "Popular People",
    description: "Explore actors, directors, and creators currently trending.",
    mediaType: "people",
    apiMediaType: "person",
    preset: {
      endpoint: "/person/popular",
      params: {
      },
    },
  },
};

function getOffsetDate(offsetDays = 0) {
  const date = new Date();

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function resolvePresetParams(config) {
  const params =
    typeof config.preset.params === "function"
      ? config.preset.params()
      : config.preset.params;

  return { ...params };
}

function createEmptyFilters() {
  return {
    genres: [],
    from: "",
    to: "",
    rating: "",
    language: "",
  };
}

function readFilters(searchParams) {
  return {
    genres: searchParams.get("genres")?.split(",").filter(Boolean) ?? [],
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    rating: searchParams.get("rating") ?? "",
    language: searchParams.get("language") ?? "",
  };
}

function writeFilters(searchParams, filters) {
  setOrDelete(searchParams, "genres", filters.genres.join(","));
  setOrDelete(searchParams, "from", filters.from);
  setOrDelete(searchParams, "to", filters.to);
  setOrDelete(searchParams, "rating", filters.rating);
  setOrDelete(searchParams, "language", filters.language);
}

function setOrDelete(searchParams, key, value) {
  if (value) {
    searchParams.set(key, String(value));
  } else {
    searchParams.delete(key);
  }
}

export default function BrowsePage({ pageKey }) {
  const config = PAGE_CONFIG[pageKey];

  if (!config) {
    throw new Error(`Unknown browse page configuration: ${pageKey}`);
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const filterDrawerRef = useRef(null);
  const yearFilterLabel =
    config.apiMediaType === "tv" ? "First Air Year" : "Release Year";

  const requestedPage = Number(searchParams.get("page") ?? 1);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const isPersonPage = config.mediaType === "people";

  const presetParams = resolvePresetParams(config);

  const defaultSort = presetParams.sort_by ?? "";
  const sort = searchParams.get("sort") ?? defaultSort;

  const committedFilters = useMemo(
    () => readFilters(searchParams),
    [searchParams],
  );

  const [draftFilters, setDraftFilters] = useState(committedFilters);
  const [prevCommitted, setPrevCommitted] = useState(committedFilters);

  if (committedFilters !== prevCommitted) {
    setPrevCommitted(committedFilters);
    setDraftFilters(committedFilters);
  }

  const {
    genres: genreIds,
    from: fromYear,
    to: toYear,
    rating,
    language,
  } = committedFilters;

  const activeFilterCount =
    genreIds.length +
    Number(Boolean(fromYear || toYear)) +
    Number(Boolean(rating)) +
    Number(Boolean(language));

  const hasDraftChanges =
    JSON.stringify(draftFilters) !== JSON.stringify(committedFilters);

  const browseUrl = useMemo(() => {
    const params = new URLSearchParams({
      ...presetParams,
      page: String(page),
    });

    if (isPersonPage) {
      return `${config.preset.endpoint}?${params.toString()}`;
    }

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
      if (fromYear) {
        params.set("primary_release_date.gte", `${fromYear}-01-01`);
      }

      if (toYear) {
        params.set("primary_release_date.lte", `${toYear}-12-31`);
      }
    }

    if (config.apiMediaType === "tv") {
      if (fromYear) {
        params.set("first_air_date.gte", `${fromYear}-01-01`);
      }

      if (toYear) {
        params.set("first_air_date.lte", `${toYear}-12-31`);
      }
    }

    if (sort) {
      params.set("sort_by", sort);
    }

    return `${config.preset.endpoint}?${params.toString()}`;
  }, [
    config,
    presetParams,
    page,
    isPersonPage,
    genreIds,
    fromYear,
    toYear,
    rating,
    language,
    sort,
  ]);

  const genresQuery = useFetch(
    isPersonPage ? null : `/genre/${config.apiMediaType}/list`,
    !isPersonPage,
  );

  const { data, loading, error, refetch } = useFetch(browseUrl);

  function updateDraftFilter(name, value) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function toggleDraftGenre(genreId) {
    const id = String(genreId);

    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      genres: currentFilters.genres.includes(id)
        ? currentFilters.genres.filter((currentId) => currentId !== id)
        : [...currentFilters.genres, id],
    }));
  }

  function commitFilters(filters, options = { replace: true }) {
    const next = new URLSearchParams(searchParams);

    writeFilters(next, filters);
    next.set("page", "1");

    setSearchParams(next, options);
  }

  function applyFilters() {
    commitFilters(draftFilters);
  }

  function applyAndCloseFilters() {
    applyFilters();
    filterDrawerRef.current?.close();
  }

  function resetDraftFilters() {
    setDraftFilters(createEmptyFilters());
  }

  function resetAppliedFilters() {
    const emptyFilters = createEmptyFilters();

    setDraftFilters(emptyFilters);
    commitFilters(emptyFilters);
  }

  function updateSort(value) {
    const next = new URLSearchParams(searchParams);

    if (value === defaultSort) {
      next.delete("sort");
    } else {
      next.set("sort", value);
    }

    next.set("page", "1");

    setSearchParams(next, { replace: true });
  }

  function updatePage(newPage) {
    const next = new URLSearchParams(searchParams);

    next.set("page", String(newPage));

    setSearchParams(next);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openFilters() {
    setDraftFilters(committedFilters);
    filterDrawerRef.current?.showModal();
  }

  function removeCommittedGenre(genreId) {
    const id = String(genreId);

    commitFilters({
      ...committedFilters,
      genres: committedFilters.genres.filter((currentId) => currentId !== id),
    });
  }

  function clearCommittedDate() {
    commitFilters({
      ...committedFilters,
      from: "",
      to: "",
    });
  }

  function clearCommittedRating() {
    commitFilters({
      ...committedFilters,
      rating: "",
    });
  }

  function clearCommittedLanguage() {
    commitFilters({
      ...committedFilters,
      language: "",
    });
  }

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
        <meta name="description" content={config.description} />
      </Helmet>

      <main className="min-h-screen bg-base-300/30 pb-10">
        <BrowseHeader config={config} />

        <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <BrowseToolbar
            config={config}
            totalResults={totalResults}
            sort={sort}
            activeFilterCount={activeFilterCount}
            openFilters={openFilters}
            updateSort={updateSort}
          />

          {!isPersonPage && activeFilterCount > 0 && (
            <ActiveFilterChips
              genres={genres}
              genreIds={genreIds}
              fromYear={fromYear}
              toYear={toYear}
              rating={rating}
              language={language}
              toggleGenre={removeCommittedGenre}
              clearDate={clearCommittedDate}
              clearRating={clearCommittedRating}
              clearLanguage={clearCommittedLanguage}
              resetFilters={resetAppliedFilters}
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
                  draftFilters={draftFilters}
                  hasDraftChanges={hasDraftChanges}
                  toggleGenre={toggleDraftGenre}
                  updateDraftFilter={updateDraftFilter}
                  resetDraftFilters={resetDraftFilters}
                  applyFilters={applyFilters}
                  yearFilterLabel={yearFilterLabel}
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
                <EmptyResults resetFilters={resetAppliedFilters} />
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
            draftFilters={draftFilters}
            hasDraftChanges={hasDraftChanges}
            toggleGenre={toggleDraftGenre}
            updateDraftFilter={updateDraftFilter}
            resetDraftFilters={resetDraftFilters}
            applyAndCloseFilters={applyAndCloseFilters}
            yearFilterLabel={yearFilterLabel}
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
      {results.map((item, index) =>
        personPage ? (
          <PersonBrowseCard key={item.id} person={item} i={index} />
        ) : (
          <BrowseMediaCard key={item.id} item={item} mediaType={mediaType} i={index} />
        ),
      )}
    </div>
  );
}

function FilterPanel({
  genres,
  draftFilters,
  hasDraftChanges,
  toggleGenre,
  updateDraftFilter,
  resetDraftFilters,
  applyFilters,
  yearFilterLabel,
}) {
  return (
    <div className="rounded-box bg-primary/12 border border-white/10 p-4 sticky top-20">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">Filters</h2>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={resetDraftFilters}
        >
          <LuRotateCcw />
          Reset
        </button>
      </div>

      <GenreFilters
        genres={genres}
        genreIds={draftFilters.genres}
        toggleGenre={toggleGenre}
      />

      <div className="divider" />

      <YearFilters
        fromYear={draftFilters.from}
        toYear={draftFilters.to}
        updateDraftFilter={updateDraftFilter}
        label={yearFilterLabel}
      />

      <div className="divider" />

      <RatingFilter
        rating={draftFilters.rating}
        updateDraftFilter={updateDraftFilter}
      />

      <div className="divider" />

      <LanguageFilter
        language={draftFilters.language}
        updateDraftFilter={updateDraftFilter}
      />

      <button
        type="button"
        className="btn btn-primary rounded-full w-full mt-5"
        onClick={applyFilters}
        disabled={!hasDraftChanges}
      >
        Apply Filters
      </button>
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
            className="flex items-center gap-2 text-sm cursor-pointer group"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={genreIds.includes(String(genre.id))}
              onChange={() => toggleGenre(genre.id)}
            />
            <span className="text-base-content/70 group-hover:text-primary/70">
              {genre.name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function YearFilters({ fromYear, toYear, updateDraftFilter, label }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-3">{label}</legend>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          inputMode="numeric"
          min="1900"
          max="2100"
          className="input input-bordered w-full bg-base-200"
          placeholder="From"
          value={fromYear}
          onChange={(event) => updateDraftFilter("from", event.target.value)}
          aria-label={`${label} from`}
        />

        <input
          type="number"
          inputMode="numeric"
          min="1900"
          max="2100"
          className="input input-bordered w-full bg-base-200"
          placeholder="To"
          value={toYear}
          onChange={(event) => updateDraftFilter("to", event.target.value)}
          aria-label={`${label} to`}
        />
      </div>
    </fieldset>
  );
}

function RatingFilter({ rating, updateDraftFilter }) {
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
          onChange={(event) => updateDraftFilter("rating", event.target.value)}
          aria-label="Minimum rating"
        />

        <span className="text-sm text-primary font-bold w-6">
          {rating || 0}
        </span>
      </div>
    </fieldset>
  );
}

function LanguageFilter({ language, updateDraftFilter }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold block mb-3">
        Original Language
      </span>

      <select
        className="select select-bordered w-full bg-base-200"
        value={language}
        onChange={(event) => updateDraftFilter("language", event.target.value)}
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
  draftFilters,
  hasDraftChanges,
  toggleGenre,
  updateDraftFilter,
  resetDraftFilters,
  applyAndCloseFilters,
  yearFilterLabel,
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
              const active = draftFilters.genres.includes(String(genre.id));

              return (
                <button
                  key={genre.id}
                  type="button"
                  className={`btn btn-sm rounded-full ${
                    active ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => toggleGenre(genre.id)}
                  aria-pressed={active}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="divider" />

        <YearFilters
          fromYear={draftFilters.from}
          toYear={draftFilters.to}
          updateDraftFilter={updateDraftFilter}
          label={yearFilterLabel}
        />

        <div className="divider" />

        <RatingFilter
          rating={draftFilters.rating}
          updateDraftFilter={updateDraftFilter}
        />

        <div className="divider" />

        <LanguageFilter
          language={draftFilters.language}
          updateDraftFilter={updateDraftFilter}
        />

        <div className="modal-action grid grid-cols-2 gap-3">
          <button
            type="button"
            className="btn btn-outline rounded-full"
            onClick={resetDraftFilters}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary rounded-full"
            onClick={applyAndCloseFilters}
            disabled={!hasDraftChanges}
          >
            Show Results
          </button>
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