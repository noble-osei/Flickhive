import HeroSlideShow from "../components/HeroSlideshow.jsx";
import MovieCard from "../components/MovieCard.jsx";
import useFetch from "../hooks/useFetch.jsx";

function Home() {
  const trendingToday = useFetch("/trending/all/day");

  return (
    <>
      <HeroSlideShow />

      <div className="px-5 py-8 lg:px-16 max-w-7xl xl:px-0 mx-auto relative">
        <h3 className="text-2xl font-semibold text-base-content mb-2">
          Trending Today
        </h3>

        <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar snap-x snap-proximity scroll-smooth">
          {trendingToday.data &&
            trendingToday.data.results.map((r, i) => (
              <MovieCard key={i} item={r} />
            ))}
        </div>
      </div>
    </>
  );
}

export default Home;
