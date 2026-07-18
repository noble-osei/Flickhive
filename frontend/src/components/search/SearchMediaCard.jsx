import { Link } from "react-router-dom";
import { formatProfession } from "../../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

export default function SearchMediaCard({ item, closeSearchBar }) {
  const posterPath = item.poster_path || item.profile_path;
  const hasPoster = !!posterPath;
  const poster = hasPoster
    ? `${IMG}/w342${posterPath}`
    : `/${item.media_type === "movie" ? "movie" : item.media_type === "tv" ? "tv" : "person"}.svg`;
  const posterSrcset = hasPoster
    ? `${IMG}/w342${posterPath} 342w, ${IMG}/w500${posterPath} 500w, ` +
      `${IMG}/w780${posterPath} 780w, ${IMG}/w185${posterPath} 185w, ` +
      `${IMG}/w154${posterPath} 154w, ${IMG}/w92${posterPath} 92w`
    : undefined; 

  return (
    <Link
      to={
        `/${item.media_type === "movie" ? "movies" : item.media_type === "tv" ? "tv" : "people"}` +
        `/${item.id}`
      }
      className="group h-22 flex gap-4 py-2 px-4 hover:bg-secondary/10 border-b border-white/10"
      onClick={closeSearchBar}
    >
      <img
        className="w-12 h-full shadow-2xl border border-white/13 object-cover rounded-lg 
          transition-all duration-300 group-hover:shadow-2xl"
        src={poster}
        srcSet={posterSrcset}
        sizes=" 48px"
        onError={(e) => (e.target.src = `/${item.media_type === "movie" ? "movie" : item.media_type === "tv" ? "tv" : "person"}.svg`)}
        alt={item.title ? item.title : item.name}
        loading="lazy"
        decoding="async"
      />

      <div>
        <h4 className="text-sm font-bold line-clamp-1">
          {item.title ? item.title : item.name}
        </h4>
        {item.media_type !== "person" && (
          <p className="text-xs font-light text-base-content/70">
            {item.media_type === "tv" ? "Series" : "Movie"} ·{" "}
            {item.release_date?.slice(0, 4) ?? item.first_air_date?.slice(0, 4)}
          </p>
        )}

        {item.media_type === "person" && item.known_for.length > 0 && (
          <p className="text-xs font-light text-base-content/70">{`
            ${formatProfession(item.known_for_department)} ·
            ${item.known_for[0].title ?? item.known_for[0].name}
            (${
              item.known_for[0].release_date?.slice(0, 4) ??
              item.known_for[0].first_air_date?.slice(0, 4)
            })
          `}</p>
        )}
      </div>
    </Link>
  );
}
