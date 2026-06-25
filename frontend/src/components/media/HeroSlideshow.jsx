import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LuInfo,
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
  LuStar,
} from "react-icons/lu";

import useGenres from "../../hooks/useGenres.jsx";
import HeroSlideSkeleton from "../ui/skeletons/Home.jsx"

const IMG = import.meta.env.VITE_IMG;
const AUTOPLAY_DELAY = 6000;
const HERO_HEIGHT = "h-115 lg:h-screen lg:max-h-215 lg:min-h-150";

const CHEVRON_STYLES = `
  flex items-center justify-center shrink-0 rounded-full w-[34px] h-[34px]
  bg-white/5 border border-white/[0.14] text-white/75 cursor-pointer
  transition-[background,transform] duration-150 hover:bg-white/15 active:scale-90
  lg:w-[44px] lg:h-[44px]
`;

export default function HeroSlideshow({ data, loading }) {
  const genres = useGenres();

  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = useMemo(() => {
    return (data?.results || [])
      .filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.backdrop_path &&
          item.poster_path,
      )
      .slice(0, 5);
  }, [data]);

  const itemsLength = items.length;

  const goTo = useCallback(
    (index) => {
      if (!itemsLength || index === active) return;

      setActive(index);
      setAnimKey((key) => key + 1);
    },
    [active, itemsLength],
  );

  const goNext = useCallback(() => {
    if (!itemsLength) return;
    goTo((active + 1) % itemsLength);
  }, [active, goTo, itemsLength]);

  const goPrev = useCallback(() => {
    if (!itemsLength) return;
    goTo((active - 1 + itemsLength) % itemsLength);
  }, [active, goTo, itemsLength]);

  useEffect(() => {
    if (paused || itemsLength <= 1) return;

    const timerId = setTimeout(goNext, AUTOPLAY_DELAY);
    return () => clearTimeout(timerId);
  }, [active, paused, goNext, itemsLength]);

  useEffect(() => {
    if (active > itemsLength - 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(0);
    }
  }, [active, itemsLength]);

  if (loading) return <HeroSlideSkeleton />
  if (itemsLength === 0) {
    return (
      <section
        className={`${HERO_HEIGHT} bg-base-200 flex items-center justify-center px-4`}
      >
        <p className="text-base-content/60 text-center">
          No featured movies available.
        </p>
      </section>
    );
  }

  const safeActive = Math.min(active, itemsLength - 1);
  const item = items[safeActive];

  const title = item.title ?? item.name;
  const date = item.release_date ?? item.first_air_date;
  const year = date?.slice(0, 4);
  const detailsPath = `/${item.media_type === "movie" ? "movies" : "tv"}/${item.id}`;
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <section
      className={`relative w-full overflow-hidden bg-base-200 ${HERO_HEIGHT}`}
      aria-label="Featured movies and TV shows"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((slide, index) => {
        const slideTitle = slide.title ?? slide.name;
        const isActive = index === safeActive;

        return (
          <div
            key={`${slide.media_type}-${slide.id}`}
            className={`absolute inset-0 transition-opacity duration-700 ease ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={`${IMG}/w1280${slide.backdrop_path}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top scale-105"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding={index === 0 ? "sync" : "auto"}
            />

            <div
              className="absolute inset-0 bg-linear-to-b from-base-200/25 via-transparent via-25%
              to-60% to-base-200/90 lg:from-base-200/20 lg:via-transparent lg:via-20% lg:to-80% 
              lg:to-base-200/85"
            />

            <div
              className="absolute inset-0 bg-linear-to-r from-base-200/85 via-base-200/30 via-55%
              to-transparent to-80% lg:from-base-200/95 lg:via-base-200/60 lg:via-30% 
              lg:to-transparent lg:to-80%"
            />

            <span className="sr-only">{slideTitle}</span>
          </div>
        );
      })}

      <div
        className="absolute inset-0 z-10 flex flex-col justify-end px-4 pb-5.5 lg:px-16 lg:pb-14 
        xl:px-0 max-w-7xl mx-auto"
      >
        <div key={`badge-${animKey}`}>
          <BadgeItem
            optionalStyles="lg:inline-block hidden"
            mediaType={item.media_type}
            date={year}
          />
        </div>

        <div key={animKey} className="flex items-end gap-4">
          <div className="lg:hidden overflow-hidden">
            <BadgeItem
              optionalStyles="inline-block"
              mediaType={item.media_type}
              date={year}
            />

            <img
              src={`${IMG}/w185${item.poster_path}`}
              alt={`${title} poster`}
              className="shrink-0 rounded-xl shadow-2xl shadow-black/70 border border-white/13 
                w-20 h-28 object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="flex-1 max-w-125 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1 lg:mb-2">
              {item.genre_ids
                ?.map((id) => genres?.[id])
                .filter(Boolean)
                .slice(0, 3)
                .map((genre) => (
                  <span
                    key={genre}
                    className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 
                      rounded-full bg-primary/12 text-primary border border-primary/28 
                      lg:text-[11px] lg:px-3"
                  >
                    {genre}
                  </span>
                ))}
            </div>

            {rating && (
              <div
                className="hidden lg:flex items-center gap-1.5 text-accent font-bold text-sm 
                mb-2"
              >
                <LuStar fill="currentColor" />
                {rating}
                <span className="text-white/30 font-normal text-[12px]">
                  /10
                </span>
              </div>
            )}

            <h2
              className="text-white line-clamp-1 lg:line-clamp-2 font-black leading-tight 
              tracking-tight text-2xl mb-1.5 lg:text-5xl lg:mb-3.5"
            >
              <Link to={detailsPath} className="hover:link-primary">
                {title}
              </Link>
            </h2>

            <p
              className="text-white/55 leading-relaxed line-clamp-2 text-[10.5px] mb-3.5 
              lg:text-[15px] lg:line-clamp-3 lg:mb-7 lg:text-white/65"
            >
              {item.overview || "No overview available."}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={detailsPath}
                className="flex items-center gap-1.5 rounded-full font-semibold bg-white/10 
                  text-white text-[11px] tracking-[0.03em] px-4 py-1.75 border border-white/18 
                  cursor-pointer transition-all duration-150 hover:bg-white/18 lg:text-sm lg:px-6 
                  lg:py-3 lg:gap-2"
              >
                <LuInfo size={15} />
                More Info
              </Link>

              <button
                type="button"
                aria-label={`Add ${title} to watchlist`}
                className="flex items-center justify-center rounded-full w-8 h-8 bg-white/10 
                  border border-white/20 text-white cursor-pointer transition-colors 
                  duration-150 hover:bg-white/20 lg:w-12 lg:h-12"
              >
                <LuPlus size={15} />
              </button>

              {rating && (
                <div
                  className="flex lg:hidden items-center gap-1 font-bold text-accent ml-auto 
                  text-xs"
                >
                  <LuStar size={12} fill="currentColor" />
                  {rating}
                </div>
              )}
            </div>
          </div>
        </div>

        {itemsLength > 1 && (
          <div className="flex items-center gap-2.5 mt-5 lg:mt-9">
            <button
              type="button"
              className={CHEVRON_STYLES}
              onClick={goPrev}
              aria-label="Previous hero slide"
            >
              <LuChevronLeft />
            </button>

            <div className="flex items-center justify-center gap-2 flex-1">
              {items.map((slide, index) => {
                const isActive = index === safeActive;
                const slideTitle = slide.title ?? slide.name;

                return (
                  <button
                    key={`${slide.media_type}-${slide.id}-indicator`}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to ${slideTitle}`}
                    aria-current={isActive ? "true" : undefined}
                    className="relative overflow-hidden rounded-full h-0.75 shrink-0 cursor-pointer 
                      bg-white/20 transition-[width] duration-350 ease-in-out lg:h-1"
                    style={{ width: isActive ? 42 : 14 }}
                  >
                    {isActive && (
                      <span
                        key={animKey}
                        className="absolute inset-0 rounded-full bg-primary origin-left"
                        style={{
                          animation: paused
                            ? "none"
                            : `fill-bar ${AUTOPLAY_DELAY}ms linear forwards`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={CHEVRON_STYLES}
              onClick={goNext}
              aria-label="Next hero slide"
            >
              <LuChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function BadgeItem({ mediaType, date, optionalStyles = "" }) {
  return (
    <span
      className={`mb-2.5 lg:mb-4 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 
        rounded-full bg-white/8 border border-white/16 text-white/55 lg:text-[11px] 
        lg:px-3 ${optionalStyles}`}
    >
      {mediaType === "tv" ? "series" : "movie"}
      {date ? ` · ${date}` : ""}
    </span>
  );
}
