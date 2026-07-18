import { useMemo, useState } from "react";
import HeroSlideShow from "../components/media/HeroSlideshow.jsx";
import MovieCard from "../components/media/MovieCard.jsx";
import useFetch from "../hooks/useFetch.jsx";
import Carousel from "../components/media/Carousel.jsx";
import { SkeletonRow } from "../components/ui/skeletons/Home.jsx";
import { Helmet } from "react-helmet-async";

function Home() {
  const [now] = useState(() => Date.now());

  const { minDate, maxDate } = useMemo(() => {
    const min = new Date(now + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const max = new Date(now + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    return { minDate: min, maxDate: max };
  }, [now]);

  const trendingThisWeek = useFetch("/trending/all/week");
  const trendingToday = useFetch("/trending/all/day");
  const topRatedMovies = useFetch("/movie/top_rated?page=1");
  const popularTVShows = useFetch("/tv/popular?page=1");

  const comingSoon = useFetch(
    `/discover/movie?include_adult=false&include_video=false&page=1` +
      `&sort_by=popularity.desc` +
      `&with_release_type=2|3` +
      `&primary_release_date.gte=${minDate}` +
      `&primary_release_date.lte=${maxDate}`,
  );

  const hiddenGems = useFetch(
    `/discover/movie?include_adult=false&include_video=false&page=1` +
      `&primary_release_date.gte=2000-01-01` +
      `&primary_release_date.lte=2020-12-31` +
      `&sort_by=vote_average.desc` +
      `&vote_average.gte=7.2` +
      `&vote_average.lte=8.2` +
      `&vote_count.gte=200` +
      `&vote_count.lte=800` +
      `&without_genres=99,10755,18` +
      `&with_original_language=en|fr|ko|ja|es` +
      `&with_runtime.gte=40`,
  );

  return (
    <>
      <Helmet>
        <title>Flickhive | Discover Movies and TV Shows</title>
        <meta
          name="description"
          content="Discover trending movies, top-rated films, popular TV shows, upcoming releases, and hidden gems on Flickhive."
        />
      </Helmet>
      <main className="min-h-screen">
        <h1 className="sr-only">Flickhive movie and TV discovery homepage</h1>

        <HeroSlideShow data={trendingThisWeek.data} loading={trendingThisWeek.loading} />

        <MediaSection title="Trending Today" data={trendingToday.data} loading={trendingToday.loading} />
        <MediaSection title="Top Rated Movies" data={topRatedMovies.data} loading={topRatedMovies.loading} />
        <MediaSection title="Popular TV Shows" data={popularTVShows.data} loading={popularTVShows.loading} />
        <MediaSection title="Coming Soon" data={comingSoon.data} loading={comingSoon.loading} />
        <MediaSection title="Hidden Gems" data={hiddenGems.data} loading={hiddenGems.loading} />
      </main>
    </>
  );
}

export default Home;

function MediaSection({ title, data, loading }) {
  const results = data?.results?.filter(
    (item) => item.poster_path && item.media_type !== "person",
  ).slice(0, 10);

  if (loading) return <SkeletonRow />
  if (!results || results.length === 0) return null;

  return (
    <section className="px-4 my-8 lg:px-16 xl:px-0 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-base-content mb-2">{title}</h2>

      <Carousel mediaWidthNum={152}>
        {results.map((item) => (
          <MovieCard
            key={`${item.media_type ?? "movie"}-${item.id}`}
            item={item}
          />
        ))}
      </Carousel>
    </section>
  );
}
