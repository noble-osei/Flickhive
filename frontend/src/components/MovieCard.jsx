import { Link } from "react-router-dom";
import { formatDate, formatProfession } from "../helpers/media.js";

export default function MovieCard({ item }) {
  return (
    <Link
      to={`/${item.media_type === "movie" || item.title ? "movies" : "tv"}/${item.id}`}
      className="group flex flex-none flex-col snap-start w-38 transition-all duration-300 
        hover:scale-105"
    >
      <img
        className="w-full h-56 object-cover rounded-lg shadow-lg mb-4 transition-all duration-300 
          group-hover:shadow-2xl"
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.title ? item.title : item.name}
        loading="lazy"
      />

      <h4 className="text-sm font-bold line-clamp-2 group-hover:link">
        {item.title ? item.title : item.name}
      </h4>
      <p className="text-sm font-light text-base-content/70">
        {formatDate(item.release_date ?? item.first_air_date)}
      </p>
    </Link>
  );
}

export function SearchMediaCard({ item, closeSearchBar }) {
  return (
    <Link
      to={`/${item.media_type === "movie" ? "movies" : "tv"}/${item.id}`}
      className="group h-22 flex gap-4 py-2 px-4 hover:bg-secondary/10 border-b border-white/10"
      onClick={closeSearchBar}
    >
      <img
        className="w-12 h-full shadow-2xl border border-white/13 object-cover rounded-lg 
          transition-all duration-300 group-hover:shadow-2xl"
        src={`https://image.tmdb.org/t/p/w154${item.poster_path || item.profile_path}`}
        onError={(e) => (e.target.src = `/${item.media_type}.svg`)}
        alt={item.title ? item.title : item.name}
        loading="lazy"
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
