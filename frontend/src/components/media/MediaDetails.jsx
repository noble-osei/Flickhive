import { Link } from "react-router-dom";
import {
  LuPlus,
  LuPlay,
  LuBookmarkCheck,
  LuChevronLeft,
  LuChevronRight,
  LuArrowLeft,
} from "react-icons/lu";

import Carousel from "./Carousel.jsx";
import MovieCard from "./MovieCard.jsx";
import Tabs, { Tab } from "../ui/Tabs.jsx";
import {
  AVATAR_WIDTHS,
  BACKDROP_WIDTHS,
  buildImageProps,
  POSTER_WIDTHS,
} from "../../helpers/media.js";

const YOUTUBE_IMG = import.meta.env.VITE_YOUTUBE_THUMBNAIL;

export function HeroSection({
  backdrop,
  backdropAlt,
  poster,
  posterAlt,
  posterFallback,
  children,
  mobileActions,
}) {
  const posterProps = buildImageProps(poster, {
    widths: POSTER_WIDTHS,
    srcWidth: 500,
    fallback: posterFallback,
  });
  const backdropProps = buildImageProps(backdrop, {
    widths: BACKDROP_WIDTHS,
    srcWidth: 780,
    fallback: posterProps.src,
  });

  return (
    <section className="relative">
      <div className="relative h-56 lg:h-96 overflow-hidden">
        <img
          {...backdropProps}
          alt={backdropAlt}
          sizes="100vw"
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
            {...posterProps}
            alt={posterAlt}
            sizes="(max-width: 1024px) 112px, 208px"
            className="w-28 h-42 lg:w-52 lg:h-78 object-cover rounded-xl shadow-2xl border
              border-white/10 shrink-0"
            fetchPriority="high"
            decoding="async"
          />

          <div className="pt-16 lg:pt-30 min-w-0 flex-1">{children}</div>
        </div>

        {mobileActions}
      </div>
    </section>
  );
}

export function HeroTitle({ eyebrow, title, year, subtitle }) {
  return (
    <>
      {eyebrow && (
        <p className="text-primary font-semibold text-sm lg:text-base">
          {eyebrow}
        </p>
      )}

      <div className="flex flex-wrap items-baseline gap-x-3">
        <h1 className="text-2xl lg:text-5xl font-bold leading-tight tracking-tight line-clamp-2">
          {title}
        </h1>
        {year && (
          <span className="text-base-content/50 text-lg lg:text-2xl">
            ({year})
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-primary font-semibold">{subtitle}</p>
      )}
    </>
  );
}

export function HeroMeta({ children }) {
  return (
    <div
      className="mt-2 flex flex-wrap text-sm text-base-content/70
      [&_span]:after:content-['•'] [&_span]:after:mx-2 [&_span]:last:after:content-none"
    >
      {children}
    </div>
  );
}

export function HeroGenres({ genres }) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
      {genres.map((genre) => (
        <span
          key={genre.id}
          className="shrink-0 text-[10px] lg:text-xs font-bold uppercase tracking-wider
            px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25"
        >
          {genre.name}
        </span>
      ))}
    </div>
  );
}

export function HeroTagline({ tagline }) {
  if (!tagline) return null;

  return (
    <p className="mt-3 hidden lg:block italic text-base-content/50">
      “{tagline}”
    </p>
  );
}

export function HeroBackLink({ to, label, desktop, mobile }) {
  return (
    <Link
      to={to}
      className={`btn btn-outline rounded-full ${
        desktop ? "mt-5 hidden lg:inline-flex" : ""
      } ${mobile ? "mt-4 lg:hidden" : ""}`}
    >
      <LuArrowLeft />
      {label}
    </Link>
  );
}

export function ActionButtons({
  title,
  mainTrailer,
  onPlayTrailer,
  isWatching,
  onToggleWatchlist,
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
        aria-label={
          isWatching
            ? `Remove ${title} from watchlist`
            : `Add ${title} to watchlist`
        }
        onClick={onToggleWatchlist}
      >
        {isWatching ? <LuBookmarkCheck /> : <LuPlus />}
        {isWatching ? "In Watchlist" : "Watchlist"}
      </button>

      <button
        type="button"
        className="btn btn-circle btn-outline lg:hidden"
        aria-label={
          isWatching
            ? `Remove ${title} from Watchlist`
            : `Add ${title} to Watchlist`
        }
        onClick={onToggleWatchlist}
      >
        {isWatching ? <LuBookmarkCheck /> : <LuPlus />}
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
      <p className="mt-1 font-bold text-primary">{value || "—"}</p>
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
              {...buildImageProps(person.profile_path, {
                widths: AVATAR_WIDTHS,
                srcWidth: 185,
                fallback: "/person.svg",
              })}
              alt={person.name}
              sizes="78px"
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
          src={`${YOUTUBE_IMG}/${video.key}/maxresdefault.jpg`}
          alt=""
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `${YOUTUBE_IMG}/${video.key}/hqdefault.jpg`;
          }}
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
  const videoGroups = [
    { label: "Trailers", videos: trailers, defaultChecked: true },
    { label: "Teasers", videos: teasers },
    { label: "Clips", videos: clips },
    { label: "Featurettes", videos: featurettes },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-10">
      <h2 className="text-xl font-semibold mb-2">Videos</h2>

      <Tabs>
        {videoGroups.map(({ label, videos, defaultChecked }) => (
          <Tab
            key={label}
            name="videos"
            label={label}
            count={videos.length}
            defaultChecked={defaultChecked}
            contentClassName="pt-4"
          >
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
                      src={`${YOUTUBE_IMG}/${video.key}/sddefault.jpg`}
                      alt=""
                      className="w-full aspect-video object-cover group-hover:scale-105 transition"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `${YOUTUBE_IMG}/${video.key}/hqdefault.jpg`;
                      }}
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
          </Tab>
        ))}
      </Tabs>
    </section>
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

export function Pagination({ page, totalPages, updatePage }) {
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

function getVisiblePages(currentPage, totalPages) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
