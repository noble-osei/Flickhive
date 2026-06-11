import { Link } from "react-router-dom";
import { LuPlus, LuPlay } from "react-icons/lu";

import Carousel from "./Carousel.jsx";
import MovieCard from "./MovieCard.jsx";

const IMG = import.meta.env.VITE_IMG;

export function ActionButtons({
  title,
  mainTrailer,
  onPlayTrailer,
  desktop,
  mobile,
}) {
  return (
    <div
      className={`${desktop ? "hidden lg:flex mt-5" : ""} ${
        mobile ? "flex lg:hidden mt-4" : ""
      } gap-3`}
    >
      <button
        type="button"
        className="btn btn-primary rounded-full flex-1 lg:flex-none"
        disabled={!mainTrailer}
        onClick={() => onPlayTrailer(mainTrailer)}
      >
        <LuPlay fill="currentColor" />
        Play trailer
      </button>

      <button
        type="button"
        className="btn btn-outline rounded-full hidden lg:inline-flex"
        aria-label={`Add ${title} to watchlist`}
      >
        <LuPlus />
        Watchlist
      </button>

      <button
        type="button"
        className="btn btn-circle btn-outline lg:hidden"
        aria-label={`Add ${title} to Watchlist`}
      >
        <LuPlus />
      </button>
    </div>
  );
}

export function OverviewSection({ overview }) {
  return (
    <section aria-labelledby="overview-title">
      <h2 id="overview-title" className="text-xl font-semibold mb-2">
        Overview
      </h2>
      <p className="text-base-content/70 leading-relaxed max-w-4xl">
        {overview || "No overview available."}
      </p>
    </section>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-box bg-primary/20 px-4 py-3">
      <h3 className="text-xs uppercase tracking-wider text-base-content/50">
        {label}
      </h3>
      <p className="mt-1 font-bold text-primary">
        {value || "—"}
      </p>
    </div>
  );
}

export function CastSection({ cast, mediaId, tvShow }) {
  if (cast.length === 0) return null;

  return (
    <section aria-labelledby="cast-title">
      <div className="flex items-center justify-between mb-2">
        <h2 id="cast-title" className="text-xl font-semibold">
          Top Billed Cast
        </h2>

        <Link
          to={`/${tvShow ? "tv" : "movies"}/${mediaId}/cast`}
          className="link text-sm"
        >
          Full Cast & Crew
        </Link>
      </div>

      <Carousel mediaWidthNum={96} title="cast">
        {cast.map((person) => (
          <Link
            key={person.cast_id ?? person.id}
            to={`/people/${person.id}`}
            className="w-24 flex flex-none flex-col items-center text-center snap-start group"
          >
            <img
              src={`${IMG}/w185${person.profile_path}`}
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover object-top border border-white/10 
                group-hover:scale-105 transition"
              loading="lazy"
              decoding="async"
            />

            <h3 className="mt-2 text-sm font-semibold line-clamp-2 group-hover:link-primary">
              {person.name}
            </h3>

            <p className="text-xs text-base-content/50 line-clamp-2">
              {person.character}
            </p>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}

export function TrailerPreview({ video, onPlay }) {
  return (
    <section aria-labelledby="trailer-title">
      <h2 id="trailer-title" className="text-xl font-semibold mb-3">
        Trailer
      </h2>

      <button
        type="button"
        onClick={() => onPlay(video)}
        className="relative w-full aspect-video rounded-xl overflow-hidden group"
        aria-label={`Play ${video.name}`}
      >
        <img
          src={`https://res.cloudinary.com/dbu9plfk1/image/fetch/f_auto,q_auto/` +
               `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
          alt=""
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition"
          loading="lazy"
          decoding="async"
        />

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
            <LuPlay size={32} fill="currentColor" />
          </span>
        </span>
      </button>
    </section>
  );
}

export function InfoBox({ title, children }) {
  return (
    <section className="rounded-box bg-primary/20 px-4 py-3">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      {children}
    </section>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-xs text-base-content/45">{label}</p>
      <p className="text-sm text-base-content/75">{value || "—"}</p>
    </div>
  );
}

export function VideosSection({
  trailers,
  teasers,
  clips,
  featurettes,
  setActiveVideo,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10">
      <h2 className="text-xl font-semibold mb-2">Videos</h2>

      <div className="tabs tabs-border">
        <VideoTab
          label="Trailers"
          videos={trailers}
          setActiveVideo={setActiveVideo}
          defaultChecked
        />
        <VideoTab
          label="Teasers"
          videos={teasers}
          setActiveVideo={setActiveVideo}
        />
        <VideoTab
          label="Clips"
          videos={clips}
          setActiveVideo={setActiveVideo}
        />
        <VideoTab
          label="Featurettes"
          videos={featurettes}
          setActiveVideo={setActiveVideo}
        />
      </div>
    </section>
  );
}

function VideoTab({ label, videos, setActiveVideo, defaultChecked = false }) {
  return (
    <>
      <input
        type="radio"
        name="videos"
        className="tab"
        aria-label={`${label} ${videos.length}`}
        defaultChecked={defaultChecked}
      />

      <div className="tab-content pt-4">
        {videos.length > 0 ? (
          <Carousel mediaWidthNum={320} title={label}>
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideo(video)}
                className="relative w-80 flex-none text-left rounded-xl overflow-hidden group"
                aria-label={`Play ${video.name}`}
              >
                <img
                  src={`https://res.cloudinary.com/dbu9plfk1/image/fetch/f_auto,q_auto/` + 
                      `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  alt=""
                  className="w-full aspect-video object-cover group-hover:scale-105 transition"
                  loading="lazy"
                  decoding="async"
                />

                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span
                    className="w-14 h-14 rounded-full bg-black/60 flex items-center 
                    justify-center"
                  >
                    <LuPlay size={28} fill="currentColor" />
                  </span>
                </span>
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

export function SimilarShowsSection({ media, media_type }) {
  const validMedia = media?.filter((medium) => medium.poster_path) ?? [];

  if (validMedia.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10">
      <h2 className="text-xl font-semibold mb-2">
        Similar {media_type === "tv" ? "Shows" : "Movies"}
      </h2>

      <Carousel
        mediaWidthNum={152}
        title={"similar" + media_type === "tv" ? "Shows" : "Movies"}
      >
        {validMedia.map((medium) => (
          <MovieCard key={medium.id} item={{ ...medium, media_type }} />
        ))}
      </Carousel>
    </section>
  );
}
