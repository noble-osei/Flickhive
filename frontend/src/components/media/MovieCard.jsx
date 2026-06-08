import { Link } from "react-router-dom";
import { formatDate } from "../../helpers/media.js";

export default function MovieCard({ item }) {
  return (
    <Link
      to={`/${item.media_type === "movie" || item.title ? "movies" : "tv"}/${item.id}`}
      className="group flex flex-none flex-col snap-start w-38 transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-lg bg-base-200 aspect-2/3 mb-4">
        <img
          className="w-full h-full object-cover rounded-lg transition-all duration-300 
            group-hover:scale-105"
          src={
            item.poster_path
              ? `${import.meta.env.VITE_IMG}/w342${item.poster_path}`
              : `/${item.media_type === "tv" ? "tv" : "movie"}.svg`
          }
          alt={item.title ?? item.name}
          loading="lazy"
          decoding="async"
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
