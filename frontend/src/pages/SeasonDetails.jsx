import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { LuArrowLeft, LuStar } from "react-icons/lu";

import useFetch from "../hooks/useFetch.jsx";
import Carousel from "../components/media/Carousel.jsx";
import { InfoBox, InfoRow, OverviewSection, StatCard } from "../components/media/MediaDetails.jsx";
import SeasonDetailsSkeleton from "../components/ui/skeletons/SeasonDetails.jsx";
import { formatDate } from "../helpers/media.js";
import PageError from "../components/ui/PageError.jsx";

const IMG = import.meta.env.VITE_IMG;

export default function SeasonDetails() {
  const { tvShowId, seasonNumber } = useParams();

  const showQuery = useFetch(`/tv/${tvShowId}`);
  const seasonQuery = useFetch(`/tv/${tvShowId}/season/${seasonNumber}`);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tvShowId, seasonNumber]);

  const show = showQuery.data;
  const season = seasonQuery.data;

  const loading = showQuery.loading || seasonQuery.loading;
  const error = showQuery.error || seasonQuery.error;

  const details = useMemo(() => {
    if (!show || !season) return null;

    const episodes = season.episodes ?? [];

    const averageRuntime = Math.round(
      episodes
        .filter((ep) => ep.runtime)
        .reduce((sum, ep) => sum + ep.runtime, 0) /
        episodes.filter((ep) => ep.runtime).length
    );

    const averageRating =
      episodes.length > 0
        ? (
            episodes.reduce((sum, ep) => sum + (ep.vote_average || 0), 0) /
            episodes.length
          ).toFixed(1)
        : null;

    return {
      episodes,
      averageRuntime: Number.isNaN(averageRuntime) ? null : averageRuntime,
      averageRating,
    };
  }, [show, season]);

  if (loading) return <SeasonDetailsSkeleton />;
  if (error) {
    return (
      <PageError
        onRetry={() => {
          showQuery.refetch();
          seasonQuery.refetch();
        }}
      />
    )
  };
  if ( !show || !season || !details) return <PageError title="No data found" />;

  const backdrop = show.backdrop_path
    ? `${IMG}/original${show.backdrop_path}`
    : "/tv.svg";

  const poster = season.poster_path
    ? `${IMG}/w500${season.poster_path}`
    : show.poster_path
      ? `${IMG}/w500${show.poster_path}`
      : "/tv.svg";

  return (
    <main className="bg-base-300/30 pb-10">
      <SeasonHero
        show={show}
        season={season}
        poster={poster}
        backdrop={backdrop}
        averageRating={details.averageRating}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 space-y-8">
          <OverviewSection overview={season.overview} />

          <SeasonStats
            season={season}
            averageRating={details.averageRating}
            averageRuntime={details.averageRuntime}
          />

          <EpisodesSection episodes={details.episodes} />
        </div>

        <SeasonSidebar
          show={show}
          season={season}
          tvShowId={tvShowId}
          activeSeason={Number(seasonNumber)}
        />
      </div>

      <BackToShowCTA show={show} tvShowId={tvShowId} />
    </main>
  );
}

function SeasonHero({ show, season, poster, backdrop, averageRating }) {
  return (
    <section className="relative">
      <div className="relative h-56 lg:h-96 overflow-hidden">
        <img
          src={backdrop}
          alt=""
          className="h-full w-full object-cover object-top brightness-50"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-t from-base-300 via-base-300/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
        <div className="flex gap-4 lg:gap-6 -mt-16 lg:-mt-28 relative z-10">
          <img
            src={poster}
            alt={`${season.name} poster`}
            className="w-28 h-42 lg:w-52 lg:h-78 object-cover rounded-xl shadow-2xl border border-white/10 shrink-0"
            fetchPriority="high"
          />

          <div className="pt-16 lg:pt-30 min-w-0 flex-1">
            <p className="text-primary font-semibold text-sm lg:text-base">
              {show.name}
            </p>

            <h1 className="text-2xl lg:text-5xl font-bold leading-tight tracking-tight">
              {season.name}
            </h1>

            <div className="mt-2 flex flex-wrap text-sm text-base-content/70 [&_span]:after:content-['•'] [&_span]:after:mx-2 [&_span]:last:after:content-none">
              {season.air_date && <span>{season.air_date.slice(0, 4)}</span>}
              <span>{season.episodes?.length ?? 0} Episodes</span>
              {averageRating && (
                <span className="inline-flex items-center gap-1 text-accent font-semibold">
                  <LuStar size={15} fill="currentColor" />
                  {averageRating}/10
                </span>
              )}
            </div>

            <Link
              to={`/tv/${show.id}`}
              className="btn btn-outline rounded-full mt-5 hidden lg:inline-flex"
            >
              <LuArrowLeft />
              Back to Show
            </Link>
          </div>
        </div>

        <Link
          to={`/tv/${show.id}`}
          className="btn btn-outline rounded-full mt-4 lg:hidden"
        >
          <LuArrowLeft />
          Back to Show
        </Link>
      </div>
    </section>
  );
}

function SeasonStats({ season, averageRating, averageRuntime }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Episodes" value={season.episodes?.length ?? 0} />
      <StatCard
        label="Air Date"
        value={season.air_date ? formatDate(season.air_date) : "—"}
      />
      <StatCard
        label="Rating"
        value={averageRating ? `${averageRating}/10` : "—"}
      />
      <StatCard
        label="Runtime"
        value={averageRuntime ? `${averageRuntime}m avg` : "—"}
      />
    </section>
  );
}

function EpisodesSection({ episodes }) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <section aria-labelledby="episodes-title">
      <h2 id="episodes-title" className="text-xl font-semibold mb-3">
        Episodes
      </h2>

      <div className="space-y-4">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>
    </section>
  );
}

function EpisodeCard({ episode }) {
  const still = episode.still_path
    ? `${IMG}/w500${episode.still_path}`
    : "/tv.svg";

  return (
    <article className="rounded-box overflow-hidden bg-primary/12 border border-white/10 flex flex-col md:flex-row">
      <img
        src={still}
        alt=""
        className="w-full md:w-56 h-44 md:h-auto object-cover bg-base-200"
        loading="lazy"
      />

      <div className="p-4 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs text-primary font-bold">
              S{episode.season_number}E{episode.episode_number}
            </p>

            <h3 className="font-bold text-lg leading-tight">{episode.name}</h3>
          </div>

          {episode.vote_average > 0 && (
            <span className="inline-flex items-center gap-1 text-accent text-sm font-bold">
              <LuStar size={14} fill="currentColor" />
              {episode.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        <p className="text-sm text-base-content/50 mt-1">
          {episode.air_date ? formatDate(episode.air_date) : "Unknown air date"}
          {episode.runtime ? ` · ${episode.runtime}m` : ""}
        </p>

        <p className="text-base-content/70 mt-3 leading-relaxed line-clamp-4">
          {episode.overview || "No overview available for this episode."}
        </p>
      </div>
    </article>
  );
}

function SeasonSidebar({ show, season, tvShowId, activeSeason }) {
  const seasons = show.seasons?.filter((s) => s.season_number > 0) ?? [];
  const activeItemRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const activeItem = activeItemRef.current;

    if (!container || !activeItem) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeItem.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          })

          observer.unobserve(container)
        }
      })
    }, { threshold: 0.1 });

    observer.observe(container);
    return () => observer.disconnect();
  }, [activeSeason])

  return (
    <aside className="lg:col-span-1 space-y-4">
      <InfoBox title="Season Info">
        <InfoRow label="Season" value={season.season_number} />
        <InfoRow
          label="Air Date"
          value={season.air_date ? formatDate(season.air_date) : "—"}
        />
        <InfoRow label="Episodes" value={season.episodes?.length ?? 0} />
        <InfoRow label="Show Status" value={show.status} />
      </InfoBox>

      {seasons.length > 0 && (
        <InfoBox title="Other Seasons">
          <div className="hidden lg:flex flex-col gap-2">
            {seasons.map((s) => (
              <Link
                key={s.id}
                to={`/tv/${tvShowId}/season/${s.season_number}`}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  s.season_number === activeSeason
                    ? "bg-primary text-primary-content font-bold"
                    : "bg-white/5 hover:bg-white/10 text-base-content/70"
                }`}
              >
                {s.name}
              </Link>
            ))}
          </div>

          <div className="lg:hidden" ref={containerRef}>
            <Carousel mediaWidthNum={120}>
              {seasons.map((s) => (
                <Link
                  key={s.id}
                  ref={s.season_number === activeSeason ? activeItemRef : null}
                  to={`/tv/${tvShowId}/season/${s.season_number}`}
                  className={`w-30 flex-none rounded-lg px-3 py-2 text-sm text-center transition ${
                    s.season_number === activeSeason
                      ? "bg-primary text-primary-content font-bold"
                      : "bg-white/5 hover:bg-white/10 text-base-content/70"
                  }`}
                >
                  {s.name}
                </Link>
              ))}
            </Carousel>
          </div>
        </InfoBox>
      )}
    </aside>
  );
}

function BackToShowCTA({ show, tvShowId }) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10">
      <Link
        to={`/tv/${tvShowId}`}
        className="btn btn-primary rounded-full w-full sm:w-auto"
      >
        <LuArrowLeft />
        Back to {show.name}
      </Link>
    </section>
  );
}