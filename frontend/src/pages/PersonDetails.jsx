import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { LuChevronDown, LuChevronUp, LuExternalLink } from "react-icons/lu";
import { Helmet } from "react-helmet-async";

import useFetch from "../hooks/useFetch.jsx";
import Carousel from "../components/media/Carousel.jsx";
import MovieCard from "../components/media/MovieCard.jsx";
import PageError from "../components/ui/PageError.jsx";
import {
  InfoBox,
  InfoRow,
  StatCard,
} from "../components/media/MediaDetails.jsx";
import PersonDetailsSkeleton from "../components/ui/skeletons/PersonDetails.jsx";
import { formatDate, formatProfession } from "../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

const GENDERS = {
  0: "Not specified",
  1: "Female",
  2: "Male",
  3: "Non-binary",
};

export default function PersonDetails() {
  const { personId } = useParams();

  const { data, loading, error, refetch } = useFetch(
    `/person/${personId}?append_to_response=combined_credits,external_ids,images`,
  );

  const credits = useMemo(() => {
    if (!data) return null;

    const castCredits = data.combined_credits?.cast ?? [];
    const crewCredits = data.combined_credits?.crew ?? [];

    const groupedCredits = groupCredits([...castCredits, ...crewCredits]);

    const movieCredits = groupedCredits.filter(
      (credit) => credit.media_type === "movie",
    );

    const tvCredits = groupedCredits.filter(
      (credit) => credit.media_type === "tv",
    );

    const excludeGenres = [10767, 99, 10763, 10764];
    const knownFor = [...groupedCredits]
      .filter(
        (credit) =>
          credit.poster_path &&
          credit.genre_ids.length > 0 &&
          excludeGenres.every((item) => !credit.genre_ids.includes(item)),
      )
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 10);

    return {
      all: groupedCredits,
      movies: movieCredits,
      tv: tvCredits,
      knownFor,
    };
  }, [data]);

  if (loading) {
    return <PersonDetailsSkeleton />;
  }

  if (error) {
    return (
      <PageError
      title="Couldn't load person details"
      message="Please check your connection and try again."
      onRetry={refetch}
      />
    );
  }
  
  if (!data || !credits) {
    return <PageError title="No data found" />;
  }
  
  return (
    <>
      <Helmet>
        <title>{`${data.name} | Flickhive`}</title>
        <meta
          name="description"
          content={
            data.biography ||
            `Explore the biography, movies, TV shows, and credits of ${data.name}.`
          }
        />
      </Helmet>

      <main className="min-h-screen bg-base-300/30 pb-10">
        <PersonHero person={data} knownFor={credits.knownFor} />

        <div
          className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-8 grid 
          grid-cols-1 lg:grid-cols-5 gap-8"
        >
          <div className="lg:col-span-4 space-y-10">
            <BiographySection biography={data.biography} />

            <PersonStats
              movieCount={credits.movies.length}
              tvCount={credits.tv.length}
              totalCount={credits.all.length}
              profession={data.known_for_department}
            />

            <KnownForSection credits={credits.knownFor} />

            <CreditsSection credits={credits} />
          </div>

          <PersonSidebar person={data} />
        </div>

        <ImageGallery images={data.images?.profiles} personName={data.name} />
      </main>
    </>
  );
}

function PersonHero({ person, knownFor }) {
  const profile = person.profile_path
    ? `${IMG}/h632${person.profile_path}`
    : "/person.svg";

  const knownForTitles = knownFor
    .slice(0, 3)
    .map((credit) => credit.title ?? credit.name)
    .filter(Boolean);

  return (
    <section className="relative">
      <div className="relative h-48 lg:h-80 overflow-hidden bg-base-200">
        {person.profile_path && (
          <img
            src={`${IMG}/original${person.profile_path}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top blur-3xl 
              scale-125 opacity-25"
          />
        )}

        <div
          className="absolute inset-0 bg-linear-to-t from-base-300 via-base-300/80 
          to-primary/10"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
        <div
          className="flex flex-col items-center text-center lg:flex-row lg:items-end 
          lg:text-left gap-4 lg:gap-6 -mt-24 lg:-mt-36 relative z-10"
        >
          <img
            src={profile}
            alt={`${person.name} profile`}
            className="w-36 h-52 lg:w-52 lg:h-78 rounded-xl object-cover object-top 
              border border-white/10 shadow-2xl bg-base-200 shrink-0"
            fetchPriority="high"
            decoding="async"
          />

          <div className="lg:pb-5 min-w-0">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
              {person.name}
            </h1>

            <p className="text-primary font-semibold mt-1">
              {formatProfession(person.known_for_department) || "Contributor"}
            </p>

            {knownForTitles.length > 0 && (
              <p className="text-sm text-base-content/60 mt-3 max-w-2xl">
                Known for: {knownForTitles.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BiographySection({ biography }) {
  const [expanded, setExpanded] = useState(false);

  if (!biography) {
    return (
      <section aria-labelledby="biography-title">
        <h2 id="biography-title" className="text-xl font-semibold mb-2">
          Biography
        </h2>

        <p className="text-base-content/60">
          No biography is available for this person.
        </p>
      </section>
    );
  }

  const isLongBiography = biography.length > 700;

  return (
    <section aria-labelledby="biography-title">
      <h2 id="biography-title" className="text-xl font-semibold mb-2">
        Biography
      </h2>

      <p
        className={`text-base-content/70 leading-relaxed whitespace-pre-line ${
          !expanded && isLongBiography ? "line-clamp-6" : ""
        }`}
      >
        {biography}
      </p>

      {isLongBiography && (
        <button
          type="button"
          className="btn btn-ghost btn-sm px-0 mt-2 text-primary"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Show Less <LuChevronUp />
            </>
          ) : (
            <>
              Read More <LuChevronDown />
            </>
          )}
        </button>
      )}
    </section>
  );
}

function PersonStats({ movieCount, tvCount, totalCount, profession }) {
  return (
    <section
      aria-label="Career summary"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
    >
      <StatCard label="Movies" value={movieCount} />
      <StatCard label="TV Shows" value={tvCount} />
      <StatCard label="Total Credits" value={totalCount} />
      <StatCard label="Known For" value={formatProfession(profession) || "—"} />
    </section>
  );
}

function KnownForSection({ credits }) {
  if (credits.length === 0) return null;

  return (
    <section aria-labelledby="known-for-title">
      <h2 id="known-for-title" className="text-xl font-semibold mb-2">
        Known For
      </h2>

      <Carousel mediaWidthNum={152}>
        {credits.map((credit) => (
          <MovieCard key={`${credit.media_type}-${credit.id}`} item={credit} />
        ))}
      </Carousel>
    </section>
  );
}

function CreditsSection({ credits }) {
  return (
    <section aria-labelledby="credits-title">
      <h2 id="credits-title" className="text-xl font-semibold mb-3">
        Credits
      </h2>

      <div className="tabs tabs-border">
        <CreditsTab label="All" credits={credits.all} defaultChecked />

        <CreditsTab label="Movies" credits={credits.movies} />

        <CreditsTab label="TV Shows" credits={credits.tv} />
      </div>
    </section>
  );
}

function CreditsTab({ label, credits, defaultChecked = false }) {
  return (
    <>
      <input
        type="radio"
        name="person-credits"
        className="tab"
        aria-label={`${label} ${credits.length}`}
        defaultChecked={defaultChecked}
      />

      <div className="tab-content pt-5">
        <CreditTimeline credits={credits} />
      </div>
    </>
  );
}

function CreditTimeline({ credits }) {
  const groupedByYear = useMemo(() => {
    return credits.reduce((groups, credit) => {
      const date = credit.release_date ?? credit.first_air_date;
      const year = date?.slice(0, 4) || "Undated";

      groups[year] ??= [];
      groups[year].push(credit);

      return groups;
    }, {});
  }, [credits]);

  const years = Object.keys(groupedByYear).sort((a, b) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;

    return Number(b) - Number(a);
  });

  if (credits.length === 0) {
    return (
      <div
        className="rounded-box bg-primary/10 border border-white/10 p-6 
        text-center text-base-content/60"
      >
        No credits available.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {years.map((year) => (
        <section key={year} aria-labelledby={`credits-${year.toLowerCase()}`}>
          <h3
            id={`credits-${year.toLowerCase()}`}
            className="text-lg font-semibold text-primary mb-3"
          >
            {year}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupedByYear[year].map((credit) => (
              <CreditCard
                key={`${credit.media_type}-${credit.id}`}
                credit={credit}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CreditCard({ credit }) {
  const title = credit.title ?? credit.name;
  const date = credit.release_date ?? credit.first_air_date;
  const isMovie = credit.media_type === "movie";

  const poster = credit.poster_path
    ? `${IMG}/w154${credit.poster_path}`
    : `/${isMovie ? "movie" : "tv"}.svg`;

  return (
    <Link
      to={`/${isMovie ? "movies" : "tv"}/${credit.id}`}
      className="group flex gap-3 rounded-box bg-primary/12 border border-white/10 
        p-3 hover:bg-primary/20 transition"
    >
      <img
        src={poster}
        alt={`${title} poster`}
        className="w-16 h-24 rounded-lg object-cover bg-base-200 shrink-0"
        loading="lazy"
        decoding="async"
      />

      <div className="min-w-0">
        <h4 className="font-bold line-clamp-2 group-hover:text-primary transition">
          {title}
        </h4>

        <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
          {credit.identities.length > 0
            ? credit.identities.join(", ")
            : "Role unavailable"}
        </p>

        <p className="text-xs text-base-content/45 mt-2">
          {isMovie ? "Movie" : "TV Show"}
          {date ? ` • ${date.slice(0, 4)}` : ""}
        </p>
      </div>
    </Link>
  );
}

function PersonSidebar({ person }) {
  const externalLinks = createExternalLinks(person.external_ids);

  return (
    <aside className="lg:col-span-1 space-y-4">
      <InfoBox title="Personal Info">
        <InfoRow
          label="Known For"
          value={formatProfession(person.known_for_department)}
        />

        {GENDERS[person.gender] && (
          <InfoRow label="Gender" value={GENDERS[person.gender]} />
        )}

        {person.birthday && (
          <InfoRow label="Birthday" value={formatDate(person.birthday)} />
        )}

        {person.deathday && (
          <InfoRow label="Died" value={formatDate(person.deathday)} />
        )}

        {person.place_of_birth && (
          <InfoRow label="Place of Birth" value={person.place_of_birth} />
        )}
      </InfoBox>

      {person.also_known_as?.length > 0 && (
        <InfoBox title="Also Known As">
          <ul className="space-y-2">
            {person.also_known_as.map((name) => (
              <li key={name} className="text-sm text-base-content/70">
                {name}
              </li>
            ))}
          </ul>
        </InfoBox>
      )}

      {externalLinks.length > 0 && (
        <InfoBox title="External Links">
          <div className="flex flex-col gap-2">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-base-content/70 
                  hover:text-primary transition"
              >
                {link.label}
                <LuExternalLink size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </InfoBox>
      )}
    </aside>
  );
}

function ImageGallery({ images = [], personName }) {
  if (images.length <= 1) return null;

  return (
    <section
      aria-labelledby="gallery-title"
      className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10"
    >
      <h2 id="gallery-title" className="text-xl font-semibold mb-2">
        Images
      </h2>

      <Carousel mediaWidthNum={160}>
        {images.slice(0, 20).map((image) => (
          <img
            key={image.file_path}
            src={`${IMG}/w342${image.file_path}`}
            alt={`${personName} profile`}
            className="w-40 h-60 rounded-xl object-cover object-top flex-none 
              bg-base-200"
            loading="lazy"
            decoding="async"
          />
        ))}
      </Carousel>
    </section>
  );
}

function groupCredits(credits) {
  const grouped = new Map();

  for (const credit of credits) {
    const key = `${credit.media_type}-${credit.id}`;
    const identity = getIdentity(credit);
    const existing = grouped.get(key);

    if (existing) {
      if (identity && !existing.identities.includes(identity)) {
        existing.identities.push(identity);
      }

      continue;
    }

    grouped.set(key, {
      ...credit,
      identities: identity ? [identity] : [],
    });
  }

  return [...grouped.values()].sort((a, b) => {
    const dateA = a.release_date ?? a.first_air_date ?? "";
    const dateB = b.release_date ?? b.first_air_date ?? "";

    return dateB.localeCompare(dateA);
  });
}

function getIdentity(credit) {
  if (credit.character) return credit.character;

  if (credit.job === "Story") return "Writer";

  return credit.job ?? "";
}

function createExternalLinks(externalIds = {}) {
  return [
    externalIds.imdb_id && {
      label: "IMDb",
      url: `https://www.imdb.com/name/${externalIds.imdb_id}`,
    },

    externalIds.instagram_id && {
      label: "Instagram",
      url: `https://www.instagram.com/${externalIds.instagram_id}`,
    },

    externalIds.facebook_id && {
      label: "Facebook",
      url: `https://www.facebook.com/${externalIds.facebook_id}`,
    },

    externalIds.twitter_id && {
      label: "X",
      url: `https://x.com/${externalIds.twitter_id}`,
    },
  ].filter(Boolean);
}
