import { Link } from "react-router-dom";
import { LuX } from "react-icons/lu";
import { buildImageProps, formatDate, POSTER_WIDTHS } from "../../helpers/media.js";

export default function MovieCard({ item, onRemove }) {
  const posterFallback = `/${item.media_type === "tv" ? "tv" : "movie"}.svg`;
  const posterProps = buildImageProps(item.poster_path, {
    widths: POSTER_WIDTHS,
    srcWidth: 342,
    fallback: posterFallback,
  });

  return (
    <Link
      to={`/${item.media_type === "movie" || item.title ? "movies" : "tv"}/${item.id}`}
      className="group flex flex-none flex-col snap-start w-38 transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-lg bg-base-200 aspect-2/3 mb-4">
        <img
          className="w-full h-full object-cover rounded-lg transition-all duration-300
            group-hover:scale-105"
          {...posterProps}
          alt={item.title ?? item.name}
          sizes="152px"
          loading="lazy"
          decoding="async"
        />

        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${item.title ?? item.name} from watchlist`}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7
              rounded-full bg-black/60 text-white cursor-pointer transition-colors
              duration-150 hover:bg-error"
          >
            <LuX size={14} />
          </button>
        )}
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
