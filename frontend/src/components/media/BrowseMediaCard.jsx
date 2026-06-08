import { Link } from "react-router-dom";
import { LuStar } from "react-icons/lu";
import { formatDate } from "../../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

export default function BrowseMediaCard({ item, mediaType }) {
  const isMovie = mediaType === "movies";
  const title = isMovie ? item.title : item.name;
  const date = isMovie ? item.release_date : item.first_air_date;

  const poster = item.poster_path
    ? `${IMG}/w342${item.poster_path}`
    : `/${isMovie ? "movie" : "tv"}.svg`;

  return (
    <Link
      to={`/${mediaType}/${item.id}`}
      className="group min-w-0"
    >
      <div className="relative overflow-hidden rounded-lg bg-base-200 aspect-2/3">
        <img
          src={poster}
          alt={`${title} poster`}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {item.vote_average > 0 && (
          <span className="absolute bottom-2 right-2 badge badge-neutral gap-1 border-white/10 bg-black/65 text-accent">
            <LuStar size={12} fill="currentColor" />
            {item.vote_average.toFixed(1)}
          </span>
        )}
      </div>

      <h2 className="mt-3 text-sm font-bold line-clamp-2 group-hover:text-primary transition">
        {title}
      </h2>

      <p className="text-sm text-base-content/55">
        {formatDate(date) || "Unknown year"}
      </p>
    </Link>
  );
}