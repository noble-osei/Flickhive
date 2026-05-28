import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.jsx";
import { LuStar, LuPlay, LuPlus } from "react-icons/lu";
import Carousel from "../components/Carousel.jsx";
import { formatDate } from "../helpers/media.js";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { useState } from "react";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [activeVideo, setActiveVideo] = useState(null);
  const { data, loading } = useFetch(
    `/movie/${movieId}?append_to_response=credits,videos,similar,release_dates`,
  );

  if (loading || !data)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  const runtime = (() => {
    let hours = Math.floor(data?.runtime / 60);
    let minutes = data?.runtime % (hours * 60);

    return data?.runtime > 0 ? `${hours}h ${minutes}m` : 0;
  })();
  const trailers = data?.videos.results.filter(
    (r) => r.type === "Trailer" && r.site === "YouTube" && r.official,
  );
  const teasers = data?.videos.results.filter(
    (r) => r.type === "Teaser" && r.site === "YouTube" && r.official,
  );
  const clips = data?.videos.results.filter(
    (r) => r.type === "Clip" && r.site === "YouTube" && r.official,
  );
  const featurettes = data?.videos.results.filter(
    (r) => r.type === "Featurette" && r.site === "YouTube" && r.official,
  );
  const certification = data?.release_dates.results
    ?.filter((c) => c.iso_3166_1 === "US")[0]
    ?.release_dates.filter((cert) => cert.type === 3 || cert)[0].certification;

  return (
    <main className="bg-base-300/30">
      <section>
        <img
          src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
          alt=""
          className="w-full max-h-80 aspect-video object-cover brightness-80"
        />
        <div className="lg:px-16 xl:px-0 max-w-7xl mx-auto">
          <div className="p-4 flex gap-4">
            <img
              src={`https://image.tmdb.org/t/p/w185${data.poster_path}`}
              alt=""
              className="rounded-lg shadow-2xl shrink-0 z-10 w-25"
            />

            <div className="w-full min-w-0">
              <h2 className="text-base-content font-semibold leading-tight tracking-tight text-2xl mb-1">
                {data.title}
              </h2>
              <p className="text-white/65 text-sm mb-4">{data.tagline}</p>

              <div
                className="flex w-full flex-nowrap gap-1.5 mb-1 overflow-x-auto no-scrollbar 
                snap-x snap-proximity scroll-smooth"
              >
                {data.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-[9px] shrink-0 font-bold tracking-wider uppercase px-2 py-0.5 
                      rounded-full bg-primary/12 text-primary border border-primary/28"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <div className="inline-flex flex-wrap text-sm font-light text-white/65 [&_span]:after:content-['•'] [&_span]:after:mx-2 [&_span]:last:after:content-none">
                <span>{formatDate(data.release_date)}</span>
                {certification && <span>{certification}</span>}
                {runtime !== 0 && <span>{runtime}</span>}
              </div>
            </div>
          </div>

          <div className="flex p-4 pt-0 gap-4">
            <button
              className="btn btn-outline border-white/18 hover:border-none rounded-full 
              flex-1"
              onClick={() => setActiveVideo(trailers[0])}
            >
              <LuPlay size={15} fill="#fff" />
              Play Trailer
            </button>
            <button
              className="btn btn-outline border-white/18 hover:border-none rounded-full 
              w-(--size) p-0"
            >
              <LuPlus size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-2 border-t border-white/10">
        <h3 className="text-xl font-medium leading-relaxed">Overview</h3>
        <p className="text-white/65">{data.overview}</p>
      </section>

      <section className="flex flex-wrap gap-4 px-4 py-2 border-t border-white/10">
        <div className="px-4 py-2 flex-1 text-center rounded-box bg-primary/32">
          <h4 className="text-sm font-medium tracking-wide">Rating</h4>
          <span className="flex items-center justify-center gap-1 font-bold text-accent">
            <LuStar size={16} fill="#f5c518" />
            {data.vote_average?.toFixed(1)}
            <span className="text-white/30 font-normal text-xs">/10</span>
          </span>
        </div>

        <div className="flex-1 px-4 py-2 text-center rounded-box bg-primary/32">
          <h4 className="text-sm font-medium tracking-wide">Budget</h4>
          <span className="text-primary">
            {data.budget.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>

        <div className="flex-1 px-4 py-2 text-center rounded-box bg-primary/32">
          <h4 className="text-sm font-medium tracking-wide">Status</h4>
          <span className="text-primary">{data.status}</span>
        </div>
      </section>

      <section className="px-4 py-2 border-t border-white/10">
        <h3 className="text-xl font-medium leading-relaxed">Top Billed Cast</h3>
        <Carousel mediaWidthNum={120}>
          {data.credits.cast
            .filter((c, i) => c.order === i)
            .slice(0, 9)
            .map((person) => (
              <div
                key={person.id}
                className="w-30 flex flex-col flex-none text-center"
              >
                <Link to={`/people/${person.id}`} className="w-full h-45 mb-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-full object-cover object-top rounded-lg"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/person.svg")}
                  />
                </Link>

                <Link to={`/people/${person.id}`} className="hover:link">
                  <h4 className="text-sm font-semibold line-clamp-2">
                    {person.name}
                  </h4>
                </Link>
                <p className="text-sm font-light text-base-content/70">
                  {person.character}
                </p>
              </div>
            ))}
        </Carousel>
      </section>

      <section className="px-4 py-2 border-t border-white/10">
        <h3 className="text-xl font-medium">Videos</h3>
        <div className="tabs-border tabs">
          <input
            type="radio"
            name="videos"
            className="tab z-1 bg-inherit"
            aria-label={`Trailers ${trailers.length}`}
            defaultChecked
          />
          <TabContent
            data={trailers}
            name="Trailers"
            setActiveVideo={setActiveVideo}
          />
          <input
            type="radio"
            name="videos"
            className="tab z-1 bg-inherit"
            aria-label={`Teasers ${teasers.length}`}
          />
          <TabContent
            data={teasers}
            name="Teasers"
            setActiveVideo={setActiveVideo}
          />
          <input
            type="radio"
            name="videos"
            className="tab z-1 bg-inherit"
            aria-label={`Clips ${clips.length}`}
          />
          <TabContent
            data={clips}
            name="Clips"
            setActiveVideo={setActiveVideo}
          />
          <input
            type="radio"
            name="videos"
            className="tab z-1 bg-inherit"
            aria-label={`Featurette ${featurettes.length}`}
          />
          <TabContent
            data={featurettes}
            name="Featurettes"
            setActiveVideo={setActiveVideo}
          />
        </div>
      </section>

      <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </main>
  );
}

function TabContent({ data, name, setActiveVideo }) {
  return (
    <div className="sticky inset-s-0 tab-content">
      {data.length > 0 ? (
        <Carousel mediaWidthNum={320}>
          {data.map((item) => (
            <div
              className="relative w-80 flex flex-none cursor-pointer"
              key={item.id}
              onClick={() => setActiveVideo(item)}
            >
              <div className="w-full">
                <img
                  src={`https://img.youtube.com/vi/${item.key}/hqdefault.jpg`}
                  alt={item.name}
                  className="w-full aspect-video object-cover rounded-xl"
                  loading="lazy"
                />
              </div>

              <div
                className="group absolute top-1/2 left-1/2 -translate-1/2 w-15 h-15 rounded-full 
              bg-black/40 flex items-center justify-center hover:bg-black/60 text-white 
                transition-all duration-150 ease"
              >
                <LuPlay
                  size={30}
                  className="fill-current group-hover:scale-90"
                />
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="flex items-center justify-center w-full h-34">
          No {name.toLowerCase()} available
        </div>
      )}
    </div>
  );
}
