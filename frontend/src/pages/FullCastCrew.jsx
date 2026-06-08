import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft, LuSearch } from "react-icons/lu";

import useFetch from "../hooks/useFetch.jsx";
import { InfoBox, InfoRow } from "../components/media/MediaDetails.jsx";
import PageError from "../components/ui/PageError.jsx";
import FullCastCrewSkeleton from "../components/ui/skeletons/FullCastCrew.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { Helmet } from "react-helmet-async";

const IMG = import.meta.env.VITE_IMG;

export default function FullCastCrewPage() {
  const { mediaType, mediaId } = useParams();
  const [query, setQuery] = useState("");

  const isMovie = mediaType === "movies";
  const apiMediaType = isMovie ? "movie" : "tv";
  const detailsPath = `/${mediaType}/${mediaId}`;

  const { data, loading, error, refetch } = useFetch(
    `/${apiMediaType}/${mediaId}?append_to_response=credits,aggregate_credits`,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mediaType, mediaId]);

  const credits = useMemo(() => {
    if (!data) return null;

    const rawCast =
      !isMovie && data.aggregate_credits?.cast?.length > 0
        ? data.aggregate_credits.cast
        : (data.credits?.cast ?? []);

    const rawCrew =
      !isMovie && data.aggregate_credits?.crew?.length > 0
        ? data.aggregate_credits.crew
        : (data.credits?.crew ?? []);

    const cast = rawCast.map((person) => ({
      id: person.id,
      name: person.name,
      profile_path: person.profile_path,
      role:
        person.character || person.roles?.map((r) => r.character).join(", "),
      episodes: person.total_episode_count,
    }));

    const crew = rawCrew.map((person) => ({
      id: person.id,
      name: person.name,
      profile_path: person.profile_path,
      department: person.department || "Other",
      role: person.job || person.jobs?.map((j) => j.job).join(", "),
      episodes: person.total_episode_count,
    }));

    const creators =
      data.created_by?.map((person) => ({
        id: person.id,
        name: person.name,
        profile_path: person.profile_path,
        role: "Creator",
      })) ?? [];

    return { cast, crew, creators };
  }, [data, isMovie]);

  const filteredCredits = useMemo(() => {
    if (!credits) return null;

    const search = query.trim().toLowerCase();

    const matches = (person) => {
      if (!search) return true;

      return (
        person.name?.toLowerCase().includes(search) ||
        person.role?.toLowerCase().includes(search) ||
        person.department?.toLowerCase().includes(search)
      );
    };

    const cast = credits.cast.filter(matches);
    const crew = credits.crew.filter(matches);
    const creators = credits.creators.filter(matches);

    const groupedCrew = crew.reduce((groups, person) => {
      const department = person.department || "Other";
      groups[department] ??= [];
      groups[department].push(person);
      return groups;
    }, {});

    return { cast, crew, creators, groupedCrew };
  }, [credits, query]);

  if (loading) return <FullCastCrewSkeleton />;
  if (error) {
    return (
      <PageError 
        title="Couldn't load cast and crew"
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  };
  if ( !data || !credits || !filteredCredits) {
    return (
      <PageError title="No data found" />
    );
  }


  const title = isMovie ? data.title : data.name;
  const date = isMovie ? data.release_date : data.first_air_date;
  const year = date?.slice(0, 4);
  const poster = data.poster_path
    ? `${IMG}/w342${data.poster_path}`
    : `/${apiMediaType}.svg`;
  const backdrop = data.backdrop_path
    ? `${IMG}/w1280${data.backdrop_path}`
    : poster;

  return (
    <>
      <Helmet>
        <title>{`${data.name || data.title} (${year}) - Cast & Crew | Flickhive`}</title>
        <meta
          name="description"
          content={
            data.overview ||
            `View full cast and crew for ${data.name || data.title}.`
          }
        />
      </Helmet>
      <main className="bg-base-300/30 pb-10">
        <CastCrewHero
          title={title}
          year={year}
          poster={poster}
          backdrop={backdrop}
          isMovie={isMovie}
          data={data}
          detailsPath={detailsPath}
        />

        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4 space-y-8">
            <SearchBox query={query} setQuery={setQuery} />

            <div className="tabs tabs-border">
              <input
                type="radio"
                name="cast-crew-tabs"
                className="tab"
                aria-label={`Cast ${filteredCredits.cast.length}`}
                defaultChecked
              />
              <div className="tab-content pt-5">
                <PeopleSection
                  title="Cast"
                  people={filteredCredits.cast}
                  emptyMessage="No cast members match your search."
                />
              </div>

              <input
                type="radio"
                name="cast-crew-tabs"
                className="tab"
                aria-label={`Crew ${filteredCredits.crew.length}`}
              />
              <div className="tab-content pt-5">
                <CrewSection title="Crew" groupedCrew={filteredCredits.groupedCrew} />
              </div>

              {!isMovie && (
                <>
                  <input
                    type="radio"
                    name="cast-crew-tabs"
                    className="tab"
                    aria-label={`Creators ${filteredCredits.creators.length}`}
                  />
                  <div className="tab-content pt-5">
                    <PeopleSection
                      title="Creators"
                      people={filteredCredits.creators}
                      emptyMessage="No creators match your search."
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <CastCrewSidebar
            isMovie={isMovie}
            year={year}
            castCount={credits.cast.length}
            crewCount={credits.crew.length}
            creatorCount={credits.creators.length}
            groupedCrew={filteredCredits.groupedCrew}
          />
        </div>
      </main>
    </>
  );
}

function CastCrewHero({
  data,
  title,
  year,
  poster,
  backdrop,
  isMovie,
  detailsPath,
}) {
  return (
    <section className="relative">
      <div className="relative h-56 lg:h-96 overflow-hidden">
        <img
          src={backdrop}
          alt=""
          className="h-full w-full object-cover object-top brightness-50"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-linear-to-t from-base-300 via-base-300/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
        <div className="flex gap-4 lg:gap-6 -mt-16 lg:-mt-28 relative z-10">
          <img
            src={poster}
            alt={`${title} poster`}
            className="w-28 h-42 lg:w-52 lg:h-78 object-cover rounded-xl shadow-2xl border border-white/10 shrink-0"
            fetchPriority="high"
            decoding="async"
          />

          <div className="pt-16 lg:pt-30 min-w-0 flex-1">
            <h1 className="text-2xl lg:text-5xl font-bold leading-tight tracking-tight line-clamp-2">
              {title}
            </h1>

            <p className="mt-1 text-primary font-semibold">Full Cast & Crew</p>

            <div className="mt-2 flex flex-wrap text-sm text-base-content/70 [&_span]:after:content-['•'] [&_span]:after:mx-2 [&_span]:last:after:content-none">
              {year && <span>{year}</span>}
              <span>{isMovie ? "Movie" : "TV Show"}</span>

              {isMovie && data.runtime > 0 && (
                <span>
                  {data.runtime > 0
                    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
                    : null}
                </span>
              )}

              {!isMovie && data.number_of_seasons > 0 && (
                <span>
                  {data.number_of_seasons}{" "}
                  {data.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}
            </div>

            <Link
              to={detailsPath}
              className="btn btn-outline rounded-full mt-5 hidden lg:inline-flex"
            >
              <LuArrowLeft />
              Back to {isMovie ? "Movie" : "Show"}
            </Link>
          </div>
        </div>

        <Link
          to={detailsPath}
          className="btn btn-outline rounded-full mt-4 lg:hidden"
        >
          <LuArrowLeft />
          Back to {isMovie ? "Movie" : "Show"}
        </Link>
      </div>
    </section>
  );
}

function SearchBox({ query, setQuery }) {
  return (
    <label className="input input-bordered flex items-center gap-2 rounded-full bg-base-200/80">
      <LuSearch className="text-base-content/50" aria-hidden="true" />
      <input
        type="search"
        className="grow"
        placeholder="Search cast or crew..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </label>
  );
}

function PeopleSection({ title, people, emptyMessage }) {
  return (
    <section aria-labelledby={`${title.toLowerCase()}-title`}>
      <h2
        id={`${title.toLowerCase()}-title`}
        className="text-xl font-semibold mb-4"
      >
        {title}
      </h2>

      {people.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {people.map((person) => (
            <PersonCreditCard
              key={`${person.id}-${person.role}`}
              person={person}
            />
          ))}
        </div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </section>
  );
}

function CrewSection({ title, groupedCrew }) {
  const departments = Object.entries(groupedCrew);

  return (
    <section aria-labelledby="crew-title">
      <h2 id={`${title.toLowerCase()}-title`} className="text-xl font-semibold mb-4">
        {title}
      </h2>

      {departments.length > 0 ? (
        <div className="space-y-8">
          {departments.map(([department, people]) => (
            <section
              key={department}
              id={`department-${slugify(department)}`}
              aria-labelledby={`department-${slugify(department)}-title`}
            >
              <h3
                id={`department-${slugify(department)}-title`}
                className="text-lg font-semibold text-primary mb-3"
              >
                {department}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {people.map((person) => (
                  <PersonCreditCard
                    key={`${person.id}-${person.role}-${department}`}
                    person={person}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (<EmptyState message="No crew members match your search." />)
      }
    </section>
  );
}

function PersonCreditCard({ person }) {
  const image = person.profile_path
    ? `${IMG}/w185${person.profile_path}`
    : "/person.svg";

  return (
    <Link
      to={`/people/${person.id}`}
      className="group rounded-box bg-primary/12 border border-white/10 p-3 flex gap-3 hover:bg-primary/20 transition"
    >
      <img
        src={image}
        alt={person.name}
        className="w-16 h-16 rounded-full object-cover object-top border border-white/10 shrink-0"
        loading="lazy"
        decoding="async"
      />

      <div className="min-w-0">
        <h3 className="font-bold group-hover:link line-clamp-1">
          {person.name}
        </h3>

        <p className="text-sm text-base-content/60 line-clamp-2">
          {person.role || "Role unknown"}
        </p>

        {person.episodes && (
          <p className="text-xs text-primary mt-1">
            {person.episodes} Episodes
          </p>
        )}
      </div>
    </Link>
  );
}

function CastCrewSidebar({
  isMovie,
  year,
  castCount,
  crewCount,
  creatorCount,
  groupedCrew,
}) {
  const departments = Object.keys(groupedCrew);

  return (
    <aside className="lg:col-span-1 space-y-4">
      <InfoBox title="Quick Info">
        <InfoRow label="Type" value={isMovie ? "Movie" : "TV Series"} />
        <InfoRow label="Year" value={year || "—"} />
        <InfoRow label="Cast" value={castCount} />
        <InfoRow label="Crew" value={crewCount} />
        {!isMovie && <InfoRow label="Creators" value={creatorCount} />}
      </InfoBox>

      {departments.length > 0 && (
        <InfoBox title="Departments">
          <div className="flex flex-col gap-2">
            {departments.map((department) => (
              <a
                key={department}
                href={`#department-${slugify(department)}`}
                className="text-sm text-base-content/70 hover:text-primary transition"
              >
                {department}
              </a>
            ))}
          </div>
        </InfoBox>
      )}
    </aside>
  );
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
