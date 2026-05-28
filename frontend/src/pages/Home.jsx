import { useEffect, useRef, useState } from "react";
import HeroSlideShow from "../components/HeroSlideshow.jsx";
import MovieCard from "../components/MovieCard.jsx";
import useFetch from "../hooks/useFetch.jsx";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

function Home() {
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const trendingToday = useFetch("/trending/all/day");
  const topRatedMovies = useFetch("/movie/top_rated?page=1");
  const populartTVShow = useFetch("/tv/popular?page=1");
  const hiddenGems = useFetch(
    `/discover/movie?include_adult=false&include_video=false&page=1` +
      `&primary_release_date.gte=2000-01-01&primary_release_date.lte=2020-12-31` +
      `&sort_by=vote_average.desc&vote_average.gte=7.2&vote_average.lte=8.2` +
      `&vote_count.gte=200&vote_count.lte=800&without_genres=99,10755,18` +
      `&with_original_language=en|fr|ko|ja|es&with_runtime.gte=40`, // broaden beyond Hollywood
  );
  const comingSoon = useFetch(
    `/discover/movie?include_adult=false&include_video=false&page=1&sort_by=popularity.desc` +
      `&with_release_type=2|3&primary_release_date.gte=${minDate}&primary_release_date.lte=${maxDate}`,
  );

  useEffect(() => {
    const updateDates = () => {
      const min = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const max = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      setMinDate(min);
      setMaxDate(max);
    };

    updateDates();
  }, []);

  return (
    <main>
      <HeroSlideShow />

      {/* Trending Today Carousel */}
      <Carousel title="Trending Today" data={trendingToday.data} />

      {/* Top Rated Movies Carousel */}
      <Carousel title="Top Rated Movies" data={topRatedMovies.data} />

      {/* Popular TV Show Carousel */}
      <Carousel title="Popular TV Show" data={populartTVShow.data} />

      {/* Coming Soon */}
      <Carousel title="Coming Soon" data={comingSoon.data} />

      {/* Hidden Gems */}
      <Carousel title="Hidden Gems" data={hiddenGems.data} />
    </main>
  );
}

export default Home;

function Carousel({ title, data }) {
  const trackRef = useRef(null);
  const mediaWidth = 168; // Movie card width + gap
  const [skipWidth, setSkipWidth] = useState(mediaWidth * 2); // Initial value set for small screens
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const readWidth = () => {
      if (!trackRef.current) return;

      let skipItems = Math.floor(trackRef.current.clientWidth / mediaWidth);
      setSkipWidth((skipItems >= 2 ? skipItems : 2) * mediaWidth);
    };

    readWidth();
    window.addEventListener("resize", readWidth);
    return () => window.removeEventListener("resize", readWidth);
  }, []);

  const updateChevrons = () => {
    const t = trackRef.current;
    if (!t) return;
    setAtStart(t.scrollLeft < 1);
    setAtEnd(t.scrollLeft >= t.scrollWidth - t.clientWidth - 1);
  };

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * skipWidth, behavior: "smooth" });
  };

  return (
    <section className="px-4 my-8 lg:px-16 max-w-7xl xl:px-0 mx-auto relative">
      <h3 className="text-2xl font-semibold text-base-content mb-2">{title}</h3>

      <div className="relative">
        {!atStart && (
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-4 top-25 z-10 w-9 h-9 rounded-full bg-black/40 
              hover:bg-black/60 border border-transparent text-base-content flex items-center 
              justify-center transition-colors"
            aria-label="Scroll Left"
          >
            <LuChevronLeft />
          </button>
        )}

        <div
          ref={trackRef}
          onScroll={updateChevrons}
          className="flex gap-4 overflow-x-auto py-2 no-scrollbar snap-x snap-proximity scroll-smooth"
        >
          {data && data.results?.map((r, i) => <MovieCard key={i} item={r} />)}
        </div>

        {!atEnd && (
          <button
            onClick={() => scroll(1)}
            className="absolute -right-4 top-25 z-10 w-9 h-9 rounded-full bg-black/40 
              hover:bg-black/60 border border-transparent text-base-content flex items-center 
              justify-center transition-colors"
            aria-label="Scroll Right"
          >
            <LuChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}
