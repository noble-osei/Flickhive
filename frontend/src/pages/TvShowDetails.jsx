import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import useFetch from "../hooks/useFetch.jsx";
import useFetchGuard from "../hooks/useFetchGuard.jsx";
import useWatch from "../hooks/useWatch.jsx";
import Carousel from "../components/media/Carousel.jsx";
import VideoPlayer from "../components/media/VideoPlayer.jsx";
import {
  ActionButtons,
  CastSection,
  HeroGenres,
  HeroMeta,
  HeroSection,
  HeroTagline,
  HeroTitle,
  InfoBox,
  InfoRow,
  OverviewSection,
  SimilarShowsSection,
  StatCard,
  TrailerPreview,
  VideosSection,
} from "../components/media/MediaDetails.jsx";
import DetailsSkeleton from "../components/ui/skeletons/Details.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import {
  buildImageProps,
  formatDate,
  IMG,
  POSTER_WIDTHS,
} from "../helpers/media.js";

export default function TVShowDetailsPage() {
  const { tvShowId } = useParams();
  const [activeVideo, setActiveVideo] = useState(null);

  const { data, loading, error, refetch } = useFetch(
    `/tv/${tvShowId}?append_to_response=credits,videos,similar,content_ratings,watch/providers`,
  );

  const details = useMemo(() => {
    if (!data) return null;

    const videos = data.videos?.results ?? [];

    const officialYoutube = videos.filter(
      (video) => video.site === "YouTube" && video.official,
    );

    const trailers = officialYoutube.filter(
      (video) => video.type === "Trailer",
    );
    const teasers = officialYoutube.filter((video) => video.type === "Teaser");
    const clips = officialYoutube.filter((video) => video.type === "Clip");
    const featurettes = officialYoutube.filter(
      (video) => video.type === "Featurette",
    );

    const mainTrailer = trailers[0] ?? officialYoutube[0];

    const usRating = data.content_ratings?.results?.find(
      (rating) => rating.iso_3166_1 === "US",
    )?.rating;

    const cast =
      data.credits?.cast
        ?.filter((person) => person.profile_path)
        ?.slice(0, 12) ?? [];

    return {
      trailers,
      teasers,
      clips,
      featurettes,
      mainTrailer,
      usRating,
      cast,
    };
  }, [data]);

  const { isWatching, toggle } = useWatch(data?.id, "tv");

  const guard = useFetchGuard({
    loading,
    error,
    refetch,
    isEmpty: !data || !details,
    skeleton: <DetailsSkeleton />,
    errorTitle: "TV Show not found",
    errorMessage:
      "We couldn't load this tv show. It may have been removed or your connection failed.",
  });
  if (guard) return guard;

  const title = data.name;
  const year = data.first_air_date?.slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{`${data.name} (${year}) | Flickhive`}</title>
        <meta
          name="description"
          content={
            data.overview ||
            `View seasons, cast, trailer, and similar shows for ${data.name}.`
          }
        />
      </Helmet>

      <main className="bg-base-300/30 pb-10">
        <HeroSection
          backdrop={data.backdrop_path}
          backdropAlt={title || "TV Show banner"}
          poster={data.poster_path}
          posterAlt={`${title} poster`}
          posterFallback="/tv.svg"
          mobileActions={
            <ActionButtons
              title={title}
              mainTrailer={details.mainTrailer}
              onPlayTrailer={setActiveVideo}
              isWatching={isWatching}
              onToggleWatchlist={() =>
                toggle({
                  name: data.name,
                  poster_path: data.poster_path,
                  first_air_date: data.first_air_date,
                  vote_average: data.vote_average,
                })
              }
              mobile
            />
          }
        >
          <HeroTitle title={title} year={year} />

          <HeroMeta>
            {data.first_air_date && (
              <span>{formatDate(data.first_air_date)}</span>
            )}
            {details.usRating && <span>{details.usRating}</span>}
            <span>{data.number_of_seasons} Seasons</span>
            <span>{data.number_of_episodes} Episodes</span>
            {data.status && <span>{data.status}</span>}
          </HeroMeta>

          <HeroGenres genres={data.genres} />
          <HeroTagline tagline={data.tagline} />

          <ActionButtons
            title={title}
            mainTrailer={details.mainTrailer}
            onPlayTrailer={setActiveVideo}
            isWatching={isWatching}
            onToggleWatchlist={() =>
              toggle({
                name: data.name,
                poster_path: data.poster_path,
                first_air_date: data.first_air_date,
                vote_average: data.vote_average,
              })
            }
            desktop
          />
        </HeroSection>

        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4 space-y-8">
            <OverviewSection overview={data.overview} />

            <StatsGrid data={data} />

            {data.next_episode_to_air && (
              <NextEpisodeCard episode={data.next_episode_to_air} />
            )}

            <SeasonsSection seasons={data.seasons} tvShowId={tvShowId} />

            {details.cast.length === 0 ? (
              <EmptyState
                title="No cast availble"
                message="We couldn't find cast information for this movie"
              />
            ) : (
              <CastSection cast={details.cast} mediaId={tvShowId} tvShow />
            )}

            {details.mainTrailer && (
              <TrailerPreview
                video={details.mainTrailer}
                onPlay={setActiveVideo}
              />
            )}
          </div>

          <Sidebar data={data} />
        </div>

        <VideosSection
          trailers={details.trailers}
          teasers={details.teasers}
          clips={details.clips}
          featurettes={details.featurettes}
          setActiveVideo={setActiveVideo}
        />

        <SimilarShowsSection media={data.similar?.results} media_type="tv" />

        <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
      </main>
    </>
  );
}

function StatsGrid({ data }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Rating"
        value={
          data.vote_average > 0 ? `${data.vote_average.toFixed(1)}/10` : "—"
        }
      />
      <StatCard label="Seasons" value={data.number_of_seasons} />
      <StatCard label="Episodes" value={data.number_of_episodes} />
      <StatCard label="Status" value={data.status} />
    </section>
  );
}

function NextEpisodeCard({ episode }) {
  return (
    <section
      aria-labelledby="next-episode-title"
      className="rounded-box bg-primary/15 border border-white/10 p-4"
    >
      <h2 id="next-episode-title" className="text-xl font-semibold mb-2">
        Next Episode
      </h2>

      <p className="text-sm text-primary font-semibold">
        S{episode.season_number}E{episode.episode_number}
      </p>

      <h3 className="text-lg font-bold mt-1">{episode.name}</h3>

      <p className="text-sm text-base-content/50 mt-1">
        {episode.air_date
          ? formatDate(episode.air_date)
          : "Release date unknown"}
        {episode.runtime ? ` · ${episode.runtime}m` : ""}
      </p>

      {episode.overview && (
        <p className="text-base-content/70 mt-3 leading-relaxed">
          {episode.overview}
        </p>
      )}
    </section>
  );
}

function SeasonsSection({ seasons, tvShowId }) {
  const validSeasons =
    seasons?.filter((season) => season.season_number > 0) ?? [];

  if (validSeasons.length === 0) return null;

  return (
    <section aria-labelledby="seasons-title">
      <h2 id="seasons-title" className="text-xl font-semibold mb-2">
        Seasons
      </h2>

      <Carousel mediaWidthNum={140}>
        {validSeasons.map((season) => (
          <Link
            key={season.id}
            to={`/tv/${tvShowId}/season/${season.season_number}`}
            className="w-35 flex flex-none flex-col snap-start group"
          >
            <img
              {...buildImageProps(season.poster_path, {
                widths: POSTER_WIDTHS,
                srcWidth: 342,
                fallback: "/tv.svg",
              })}
              alt={`${season.name} poster`}
              sizes="140px"
              className="w-full h-52 object-cover rounded-lg shadow-lg group-hover:scale-105
                transition"
              loading="lazy"
              decoding="async"
            />

            <h3 className="text-sm font-bold mt-3 line-clamp-2 group-hover:link-primary">
              {season.name}
            </h3>

            <p className="text-xs text-base-content/50">
              {season.air_date?.slice(0, 4) || "Unknown year"} ·{" "}
              {season.episode_count} Episodes
            </p>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}

function Sidebar({ data }) {
  return (
    <aside className="lg:col-span-1 space-y-4">
      <InfoBox title="Created By">
        {data.created_by?.length > 0 ? (
          data.created_by.map((creator) => (
            <Link
              key={creator.id}
              to={`/people/${creator.id}`}
              className="block link"
            >
              {creator.name}
            </Link>
          ))
        ) : (
          <p className="text-base-content/50">Unknown</p>
        )}
      </InfoBox>

      <InfoBox title="Networks">
        <div className="space-y-3">
          {data.networks?.length > 0 ? (
            data.networks.map((network) => (
              <div key={network.id} className="flex items-center gap-2">
                {network.logo_path && (
                  <img
                    src={`${IMG}/w92${network.logo_path}`}
                    alt=""
                    className="w-10 h-6 object-contain bg-white rounded p-1"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="text-sm text-base-content/70">
                  {network.name}
                </span>
              </div>
            ))
          ) : (
            <p className="text-base-content/50">Unknown</p>
          )}
        </div>
      </InfoBox>

      <InfoBox title="Show Info">
        <InfoRow label="Original Name" value={data.original_name} />
        <InfoRow
          label="Language"
          value={data.original_language?.toUpperCase()}
        />
        <InfoRow
          label="First Air Date"
          value={formatDate(data.first_air_date)}
        />
        <InfoRow label="Last Air Date" value={formatDate(data.last_air_date)} />
        <InfoRow label="Type" value={data.type} />
      </InfoBox>
    </aside>
  );
}
