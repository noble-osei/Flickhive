import { Link } from "react-router-dom";
import { formatDate } from "../../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

export default function MovieCard({ item }) {
  const hasPoster = !!item.poster_path;
  const poster = hasPoster
    ? `${IMG}/w342${item.poster_path}`
    : `/${item.media_type === "tv" ? "tv" : "movie"}.svg`;
  const posterSrcset = hasPoster
    ? `${IMG}/w342${item.poster_path} 342w, ${IMG}/w500${item.poster_path} 500w, ` +
      `${IMG}/w780${item.poster_path} 780w, ${IMG}/w185${item.poster_path} 185w, ` +
      `${IMG}/w154${item.poster_path} 154w`
    : undefined;

  return (
    <Link
      to={`/${item.media_type === "movie" || item.title ? "movies" : "tv"}/${item.id}`}
      className="group flex flex-none flex-col snap-start w-38 transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-lg bg-base-200 aspect-2/3 mb-4">
        <img
          className="w-full h-full object-cover rounded-lg transition-all duration-300 
            group-hover:scale-105"
          src={poster}
          alt={item.title ?? item.name}
          sizes="152px"
          srcSet={posterSrcset}
          loading="lazy"
          decoding="async"
          onError={(e) =>
            (e.target.src = `/${item.media_type === "tv" ? "tv" : "movie"}.svg`)
          }
        />
      </div>

      <h3 className="text-sm font-bold line-clamp-2 group-hover:link-primary">
        {item.title ? item.title : item.name}
      </h3>
      <p className="text-sm font-light text-base-content/70">
        {formatDate(item.release_date ?? item.first_air_date)}
      </p>
    </Link>
  );
}
