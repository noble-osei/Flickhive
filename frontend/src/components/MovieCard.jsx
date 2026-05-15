import { displayTitle, formatDate } from "../helpers/media.js";

export default function MovieCard({ item }) {
  return (
    <div className="group flex flex-none flex-col snap-start w-40 shrink-0 transition-all duration-300 hover:scale-105">
      <img
        className="w-full h-56 object-cover rounded-lg shadow-lg mb-4 transition-all duration-300 group-hover:shadow-2xl"
        src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
        alt={displayTitle(item)}
        loading="lazy"
      />

      <h4 className="text-sm font-bold">{displayTitle(item)}</h4>
      <p className="text-sm font-light text-base-content/70">
        {formatDate(item.release_date || item.first_air_date)}
      </p>
    </div>
  );
}
