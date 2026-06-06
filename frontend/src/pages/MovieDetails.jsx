import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuStar } from "react-icons/lu";
import { Helmet } from "react-helmet-async";

import useFetch from "../hooks/useFetch.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";
import {
  ActionButtons,
  CastSection,
  InfoBox,
  InfoRow,
  OverviewSection,
  SimilarShowsSection,
  StatCard,
  TrailerPreview,
  VideosSection,
} from "../components/MediaDetails.jsx";
import DetailsSkeleton from "../components/ui/skeletons/Details.jsx";
import PageError from "../components/ui/PageError.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { formatDate } from "../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

export default function MovieDetails() {
  const { movieId } = useParams();
  const [activeVideo, setActiveVideo] = useState(null);

  const { data, loading, error, refetch } = useFetch(
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

  if (loading) return <DetailsSkeleton />;
  if (error) {
    return (
      <PageError
        title="Movie not found"
        message="We couldn't load this movie. It may have been removed or your connection failed."
        onRetry={refetch}
      />
    )
  };
  if ( !data || !details) return <PageError title="No data found" />;

  const year = data.release_date?.slice(0, 4);
  const poster = data.poster_path
    ? `${IMG}/w500${data.poster_path}`
    : "/movie.svg";
  const backdrop = data.backdrop_path
    ? `${IMG}/original${data.backdrop_path}`
    : poster;

  return (
    <>
      <Helmet>
        <title>{`${data.title} (${year}) | Flickhive`}</title>
        <meta
          name="description"
          content={data.overview || `View details, cast, trailer, and similar movies for ${data.title}.`}
        />
      </Helmet>

      <main className="bg-base-300/30 pb-10">
        <section className="relative">
          <div className="relative h-56 lg:h-96 overflow-hidden">
            <img
              src={backdrop}
              alt=""
              className="h-full w-full object-cover object-top brightness-50"
              fetchPriority="high"
              decoding="async"
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
                decoding="async"
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

                <ActionButtons
                  title={data.title}
                  mainTrailer={details.mainTrailer}
                  onPlayTrailer={setActiveVideo}
                  desktop
                />
              </div>
            </div>

            <ActionButtons
              title={data.title}
              mainTrailer={details.mainTrailer}
              onPlayTrailer={setActiveVideo}
              mobile
            />
          </div>
        </section>

        <div
          className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-6 grid grid-cols-1 lg:grid-cols-5 
          gap-6"
        >
          <div className="lg:col-span-4 space-y-8">
            <OverviewSection overview={data.overview} />

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Rating"
                value={
                  data.vote_average > 0
                    ? `${data.vote_average?.toFixed(1)}/10`
                    : "—"
                }
              />
              <StatCard label="Votes" value={data.vote_count?.toLocaleString()} />
              <StatCard label="Budget" value={money(data.budget)} />
              <StatCard label="Revenue" value={money(data.revenue)} />
            </section>

            {details.cast.length === 0 ? (
              <EmptyState 
                title="No cast availble"
                message="We couldn't find cast information for this movie"
              />
            ) : (
              <CastSection cast={details.cast} mediaId={movieId} />
            )}

            {details.mainTrailer && (
              <TrailerPreview
                video={details.mainTrailer}
                onPlay={setActiveVideo}
              />
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
                        decoding="async"
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

        <VideosSection
          trailers={details.trailers}
          teasers={details.teasers}
          clips={details.clips}
          featurettes={details.featurettes}
          setActiveVideo={setActiveVideo}
        />

        {data.similar?.results?.length > 0 && (
          <SimilarShowsSection
            media={data?.similar?.results}
            media_type="movie"
          />
        )}

        <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
      </main>
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
