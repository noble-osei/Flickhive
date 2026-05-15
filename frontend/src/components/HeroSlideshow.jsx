import { useState, useEffect, useCallback, useRef } from "react";
import useFetch from "../hooks/useFetch.jsx";
import useGenres from "../hooks/useGenres.jsx";
import { FaPlay } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { displayTitle } from "../helpers/media.js";

const AUTOPLAY_DELAY = 6000;
const SLIDESHOWITEMS = Array(5);
const HERO_HEIGHT = "h-115 lg:h-screen lg:max-h-215 lg:min-h-150";
const BADGE_STYLES =
  "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/8 border border-white/16 text-white/55 lg:text-[11px] lg:px-3";
const CHEVRON_STYLES =
  "flex items-center justify-center shrink-0 rounded-full w-[34px] h-[34px] bg-white/5 border border-white/[0.14] text-white/75 cursor-pointer transition-[background,transform] duration-150 hover:bg-white/15 active:scale-90 lg:w-[44px] lg:h-[44px]";
const BadgeItem = ({ mediaType, date, optionalStyles = "" }) => (
  <span className={`mb-2.5 lg:mb-4 ${BADGE_STYLES} ${optionalStyles}`}>
    {mediaType === "tv" ? "series" : "movie"} · {date}
  </span>
);

export default function HeroSlideshow() {
  const { data, loading, error } = useFetch("/trending/all/week");
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());
  const genres = useGenres();

  const goTo = useCallback(
    (index) => {
      if (index === active) return;
      setActive(index);
      setAnimKey((k) => k + 1);
      startRef.current = Date.now();
    },
    [active],
  );

  const goNext = useCallback(
    () => goTo((active + 1) % SLIDESHOWITEMS.length),
    [active, goTo],
  );
  const goPrev = useCallback(
    () => goTo((active - 1 + SLIDESHOWITEMS.length) % SLIDESHOWITEMS.length),
    [active, goTo],
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goNext, AUTOPLAY_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [active, paused, goNext]);

  if (loading) return <div className={HERO_HEIGHT}>Loading...</div>;
  if (error) return <div className={HERO_HEIGHT}>Error: {error}</div>;
  if (!data) return <div className={HERO_HEIGHT}>No data available</div>;

  const ITEMS =
    data.results
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .slice(0, 5) || [];
  if (ITEMS.length === 0)
    return <div className={HERO_HEIGHT}>No items available</div>;

  const safeActive = Math.min(active, ITEMS.length - 1);
  const item = ITEMS[safeActive];

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 h-115 lg:h-screen lg:max-h-215 lg:min-h-150"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* ── Backdrop cross-fade ── */}
      {ITEMS.map((it, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-900 ease ${i === safeActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={`https://image.tmdb.org/t/p/original${it.backdrop_path}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/25 via-transparent via-25% to-65% to-slate-950 lg:from-slate-900/20 lg:via-transparent lg:via-20% lg:to-80% lg:to-slate-950" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/85 via-slate-900/30 via-55% to-transparent to-80% lg:from-slate-900/95 lg:via-slate-900/70 lg:via-30% lg:to-transparent lg:to-80%" />
        </div>
      ))}

      {/* ── Stage ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-0 px-5 pb-5.5 lg:p-0 lg:px-16 lg:pb-14 xl:px-0 xl:max-w-7xl mx-auto">
        {/* Type + year badge xl: */}
        <div key={`badge-${animKey}`} className="duration-650 ease-out">
          <BadgeItem
            optionalStyles={"lg:inline-block hidden"}
            mediaType={item.media_type}
            date={
              item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)
            }
          />
        </div>

        {/* Main content row (poster + meta) */}
        <div
          key={animKey}
          className="duration-650 ease-out flex items-end gap-4"
        >
          {/* Poster — hidden on desktop */}
          <div className="lg:hidden overflow-hidden">
            <BadgeItem
              optionalStyles="inline-block"
              mediaType={item.media_type}
              date={
                item.release_date?.slice(0, 4) ||
                item.first_air_date?.slice(0, 4)
              }
            />
            <img
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={displayTitle(item)}
              className="shrink-0 rounded-xl shadow-2xl shadow-black/70 border border-white/13 w-20 h-28 object-cover"
            />
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0 lg:max-w-145">
            {/* Genre pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.genre_ids
                .map((id) => genres?.[id])
                .filter(Boolean)
                .map((g) => (
                  <span
                    key={g}
                    className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/12 text-primary border border-primary/28 lg:text-[11px] lg:px-3"
                  >
                    {g}
                  </span>
                ))}
            </div>

            {/* Rating — desktop shows above title */}
            <div className="hidden lg:flex items-center gap-1.5 text-accent font-bold text-[14px] mb-2">
              <FaStar />
              {item.vote_average?.toFixed(1)}
              <span className="text-white/30 font-normal text-[12px]">/10</span>
            </div>

            <h2 className="text-white line-clamp-1 lg:line-clamp-2 font-black leading-tight tracking-tight text-[22px] mb-1.5 lg:text-[52px] lg:mb-3.5">
              {displayTitle(item)}
            </h2>

            <p className="text-white/55 leading-relaxed line-clamp-2 text-[10.5px] mb-3.5 lg:text-[15px] lg:line-clamp-3 lg:mb-7 lg:text-white/65">
              {item.overview}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 rounded-full font-semibold bg-white/10 text-white text-[11px] tracking-[0.03em] px-4 py-1.75 border border-white/18 cursor-pointer transition-all duration-150 hover:bg-white/18 hover:scale-[1.02] lg:text-sm lg:px-6 lg:py-3 lg:gap-2">
                <IoMdInformationCircleOutline className="text-[15px]" /> More
                Info
              </button>
              <button className="flex items-center justify-center rounded-full w-8 h-8 bg-white/10 border border-white/20 text-white cursor-pointer transition-colors duration-150 hover:bg-white/20 lg:w-12 lg:h-12">
                <FaPlus className="w-3.5 h-3.5" />
              </button>
              <div className="flex lg:hidden items-center gap-1 font-bold text-accent ml-auto text-xs">
                <FaStar className="w-3.25 h-3.25" />
                {item.vote_average?.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-2.5 mt-5 lg:mt-9">
          <button className={CHEVRON_STYLES} onClick={goPrev}>
            <FaChevronLeft />
          </button>

          <div className="flex items-center justify-center gap-2 flex-1">
            {ITEMS.map((_, i) => {
              const isActive = i === safeActive;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="relative overflow-hidden rounded-full h-0.75 shrink-0 cursor-pointer bg-white/20 transition-[width] duration-350 ease-in-out lg:h-1"
                  style={{ width: isActive ? 42 : 14 }}
                >
                  {isActive && (
                    <div
                      key={animKey}
                      className="absolute inset-0 rounded-full bg-primary origin-left"
                      style={{
                        animation: `fill-bar ${AUTOPLAY_DELAY}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button className={CHEVRON_STYLES} onClick={goNext}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
