import { Link } from "react-router-dom";
import { formatDate } from "../../helpers/media.js";

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
        src={
          item.poster_path
            ? `${import.meta.env.VITE_IMG}/w342${item.poster_path}`
            : `/${item.media_type === "tv" ? "tv" : "movie"}.svg`
        }
        alt={item.title ?? item.name}
        loading="lazy"
        decoding="async"
      />

      <h3 className="text-sm font-bold line-clamp-2 group-hover:link">
        {item.title ? item.title : item.name}
      </h3>
      <p className="text-sm font-light text-base-content/70">
        {formatDate(item.release_date ?? item.first_air_date)}
      </p>
    </Link>
  );
}
