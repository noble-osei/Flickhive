import { Link } from "react-router-dom";
import { buildImageProps, formatProfession, POSTER_WIDTHS } from "../../helpers/media.js";

export default function SearchMediaCard({ item, closeSearchBar }) {
  const posterPath = item.poster_path || item.profile_path;
  const posterProps = buildImageProps(posterPath, {
    widths: [92, ...POSTER_WIDTHS],
    srcWidth: 342,
    fallback: `/${item.media_type === "movie" ? "movie" : item.media_type === "tv" ? "tv" : "person"}.svg`,
  });

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
        {...posterProps}
        sizes=" 48px"
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
