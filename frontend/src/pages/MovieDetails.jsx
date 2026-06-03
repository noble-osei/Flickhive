import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuStar, LuPlay, LuPlus } from "react-icons/lu";

import useFetch from "../hooks/useFetch.jsx";
import Carousel from "../components/Carousel.jsx";
import MovieCard from "../components/MovieCard.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { formatDate } from "../helpers/media.js";

const IMG = "https://image.tmdb.org/t/p";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [activeVideo, setActiveVideo] = useState(null);

  const { data, loading } = useFetch(
    `/movie/${movieId}?append_to_response=credits,videos,similar,release_dates,watch/providers`,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [movieId]);

  const details = useMemo(() => {
    if (!data) return null;

    const runtime =
      data.runtime > 0
        ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
        : null;

    const usRelease = data.release_dates?.results?.find(
      (r) => r.iso_3166_1 === "US",
    );

    const certification = usRelease?.release_dates?.find(
      (r) => r.certification,
    )?.certification;

    const videos = data.videos?.results ?? [];

    const officialYoutube = videos.filter(
      (v) => v.site === "YouTube" && v.official,
    );

    const trailers = officialYoutube.filter((v) => v.type === "Trailer");
    const teasers = officialYoutube.filter((v) => v.type === "Teaser");
    const clips = officialYoutube.filter((v) => v.type === "Clip");
    const featurettes = officialYoutube.filter((v) => v.type === "Featurette");

    const mainTrailer = trailers[0] ?? officialYoutube[0];

    const directors =
      data.credits?.crew?.filter((person) => person.job === "Director") ?? [];

    const cast =
      data.credits?.cast
        ?.filter((person) => person.profile_path)
        ?.slice(0, 12) ?? [];

    return {
      runtime,
      certification,
      trailers,
      teasers,
      clips,
      featurettes,
      mainTrailer,
      directors,
      cast,
    };
  }, [data]);

  if (loading || !data || !details) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center">
        <span
          className="loading loading-dots loading-xl"
          aria-label="Loading movie details"
        />
      </main>
    );
  }

  const year = data.release_date?.slice(0, 4);
  const poster = data.poster_path
    ? `${IMG}/w500${data.poster_path}`
    : "/movie.svg";
  const backdrop = data.backdrop_path
    ? `${IMG}/original${data.backdrop_path}`
    : poster;

  return (
    <main className="bg-base-300/30 pb-10">
      <section className="relative">
        <div className="relative h-56 lg:h-96 overflow-hidden">
          <img
            src={backdrop}
            alt=""
            className="h-full w-full object-cover object-top brightness-50"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-base-300 via-base-300/70 
            to-transparent"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <div className="flex gap-4 lg:gap-6 -mt-16 lg:-mt-28 relative z-10">
            <img
              src={poster}
              alt={`${data.title} poster`}
              className="w-28 h-42 lg:w-52 lg:h-78 object-cover rounded-xl shadow-2xl border 
                border-white/10 shrink-0"
              fetchPriority="high"
            />

            <div className="pt-16 lg:pt-30 min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h1 className="text-2xl lg:text-5xl font-bold leading-tight tracking-tight">
                  {data.title}
                </h1>
                {year && (
                  <span className="text-base-content/50 text-lg lg:text-2xl">
                    ({year})
                  </span>
                )}
              </div>

              <div
                className="mt-2 flex flex-wrap text-sm text-base-content/70 
                [&_span]:after:content-['•'] [&_span]:after:mx-2 [&_span]:last:after:content-none"
              >
                {data.release_date && (
                  <span>{formatDate(data.release_date)}</span>
                )}
                {details.certification && <span>{details.certification}</span>}
                {details.runtime && <span>{details.runtime}</span>}
                {data.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1 text-accent font-semibold">
                    <LuStar size={15} fill="currentColor" />
                    {data.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
                {data.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="shrink-0 text-[10px] lg:text-xs font-bold uppercase tracking-wider 
                      px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {data.tagline && (
                <p className="mt-3 hidden lg:block italic text-base-content/50">
                  “{data.tagline}”
                </p>
              )}

              <div className="hidden lg:flex mt-5 gap-3">
                <button
                  className="btn btn-primary rounded-full"
                  onClick={() => setActiveVideo(details.mainTrailer)}
                  disabled={!details.mainTrailer}
                >
                  <LuPlay fill="currentColor" />
                  Play trailer
                </button>

                <button className="btn btn-outline rounded-full">
                  <LuPlus />
                  Watchlist
                </button>
              </div>
            </div>
          </div>

          <div className="flex lg:hidden mt-4 gap-3">
            <button
              className="btn btn-primary rounded-full flex-1"
              onClick={() => setActiveVideo(details.mainTrailer)}
              disabled={!details.mainTrailer}
            >
              <LuPlay fill="currentColor" />
              Play trailer
            </button>

            <button
              className="btn btn-circle btn-outline"
              aria-label="Add to watchlist"
            >
              <LuPlus />
            </button>
          </div>
        </div>
      </section>

      <div
        className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-6 grid grid-cols-1 lg:grid-cols-5 
        gap-6"
      >
        <div className="lg:col-span-4 space-y-8">
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="text-xl font-semibold mb-2">
              Overview
            </h2>
            <p className="text-base-content/70 leading-relaxed max-w-4xl">
              {data.overview || "No overview available."}
            </p>
          </section>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Rating"
              value={`${data.vote_average?.toFixed(1)}/10`}
            />
            <StatCard label="Votes" value={data.vote_count?.toLocaleString()} />
            <StatCard label="Budget" value={money(data.budget)} />
            <StatCard label="Revenue" value={money(data.revenue)} />
          </section>

          <section aria-labelledby="cast-title">
            <div className="flex items-center justify-between mb-2">
              <h2 id="cast-title" className="text-xl font-semibold">
                Top Billed Cast
              </h2>
              <Link to={`/movies/${movieId}/cast`} className="link text-sm">
                Full Cast & Crew
              </Link>
            </div>

            <Carousel mediaWidthNum={96}>
              {details.cast.map((person) => (
                <Link
                  key={person.cast_id ?? person.id}
                  to={`/people/${person.id}`}
                  className="w-24 flex flex-none flex-col items-center text-center snap-start group"
                >
                  <img
                    src={`${IMG}/w185${person.profile_path}`}
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover object-top border 
                      border-white/10 group-hover:scale-105 transition"
                    loading="lazy"
                  />
                  <h3 className="mt-2 text-sm font-semibold line-clamp-2 group-hover:link">
                    {person.name}
                  </h3>
                  <p className="text-xs text-base-content/50 line-clamp-2">
                    {person.character}
                  </p>
                </Link>
              ))}
            </Carousel>
          </section>

          {details.mainTrailer && (
            <section aria-labelledby="trailer-title">
              <h2 id="trailer-title" className="text-xl font-semibold mb-3">
                Trailer
              </h2>

              <button
                onClick={() => setActiveVideo(details.mainTrailer)}
                className="relative w-full aspect-video rounded-xl overflow-hidden group"
                aria-label={`Play ${details.mainTrailer.name}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${details.mainTrailer.key}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover brightness-75 group-hover:scale-105 
                    transition"
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="w-16 h-16 rounded-full bg-black/60 flex items-center 
                    justify-center"
                  >
                    <LuPlay size={32} fill="currentColor" />
                  </span>
                </span>
              </button>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1 space-y-4">
          <InfoBox
            title={details.directors.length > 1 ? "Directors" : "Director"}
          >
            {details.directors.length > 0 ? (
              details.directors.map((director) => (
                <Link
                  key={director.id}
                  to={`/people/${director.id}`}
                  className="block link"
                >
                  {director.name}
                </Link>
              ))
            ) : (
              <p className="text-base-content/50">Unknown</p>
            )}
          </InfoBox>

          <InfoBox title="Production Companies">
            <div className="space-y-3">
              {data.production_companies?.slice(0, 4).map((company) => (
                <div key={company.id} className="flex items-center gap-2">
                  {company.logo_path && (
                    <img
                      src={`${IMG}/w92${company.logo_path}`}
                      alt=""
                      className="w-10 h-6 object-contain bg-white rounded p-1"
                      loading="lazy"
                    />
                  )}
                  <span className="text-sm text-base-content/70">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </InfoBox>

          <InfoBox title="Movie Info">
            <InfoRow label="Status" value={data.status} />
            <InfoRow
              label="Language"
              value={data.original_language?.toUpperCase()}
            />
            <InfoRow label="Original Title" value={data.original_title} />
          </InfoBox>
        </aside>
      </div>

      <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10">
        <h2 className="text-xl font-semibold mb-2">Videos</h2>

        <div className="tabs tabs-border">
          <VideoTab
            label="Trailers"
            videos={details.trailers}
            setActiveVideo={setActiveVideo}
            defaultChecked
          />
          <VideoTab
            label="Teasers"
            videos={details.teasers}
            setActiveVideo={setActiveVideo}
          />
          <VideoTab
            label="Clips"
            videos={details.clips}
            setActiveVideo={setActiveVideo}
          />
          <VideoTab
            label="Featurettes"
            videos={details.featurettes}
            setActiveVideo={setActiveVideo}
          />
        </div>
      </section>

      {data.similar?.results?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10">
          <h2 className="text-xl font-semibold mb-2">Similar movies</h2>

          <Carousel mediaWidthNum={152}>
            {data.similar.results
              .filter((movie) => movie.poster_path)
              .map((movie) => (
                <MovieCard key={movie.id} item={movie} />
              ))}
          </Carousel>
        </section>
      )}

      <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-box bg-primary/20 px-4 py-3">
      <h3 className="text-xs uppercase tracking-wider text-base-content/50">
        {label}
      </h3>
      <p className="mt-1 font-bold text-primary">{value || "—"}</p>
    </div>
  );
}

function InfoBox({ title, children }) {
  return (
    <section className="rounded-box bg-primary/20 px-4 py-3">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-xs text-base-content/45">{label}</p>
      <p className="text-sm text-base-content/75">{value || "—"}</p>
    </div>
  );
}

function VideoTab({ label, videos, setActiveVideo, defaultChecked = false }) {
  return (
    <>
      <input
        type="radio"
        name="movie-videos"
        className="tab"
        aria-label={`${label} ${videos.length}`}
        defaultChecked={defaultChecked}
      />

      <div className="tab-content pt-4">
        {videos.length > 0 ? (
          <Carousel mediaWidthNum={320}>
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="relative w-80 flex-none text-left rounded-xl overflow-hidden group"
                aria-label={`Play ${video.name}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  alt=""
                  className="w-full aspect-video object-cover group-hover:scale-105 transition"
                  loading="lazy"
                />

                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="w-14 h-14 rounded-full bg-black/60 flex items-center 
                    justify-center">
                    <LuPlay size={28} fill="currentColor" />
                  </span>
                </span>

                <span className="sr-only">{video.name}</span>
              </button>
            ))}
          </Carousel>
        ) : (
          <p className="h-32 flex items-center justify-center text-base-content/50">
            No {label.toLowerCase()} available.
          </p>
        )}
      </div>
    </>
  );
}

function money(amount) {
  if (!amount || amount <= 0) return "—";

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
