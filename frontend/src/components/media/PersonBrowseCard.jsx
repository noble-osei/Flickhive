import { Link } from "react-router-dom";
import { formatProfession } from "../../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

export default function PersonBrowseCard({ person, i }) {
  const image = person.profile_path
    ? `${IMG}/w342${person.profile_path}`
    : "/person.svg";

  const knownFor = person.known_for?.[0];
  const knownForTitle = knownFor?.title ?? knownFor?.name;

  return (
    <Link
      to={`/people/${person.id}`}
      className="group min-w-0"
    >
      <div className="overflow-hidden rounded-lg bg-base-200 aspect-2/3">
        <img
          src={image}
          alt={person.name}
          loading={i < 5 ? "eager" : "lazy"}
          decoding={i < 5 ? "sync" : "async"}
          fetchPriority={i < 5 ? "auto" : "low"}
          className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
        />
      </div>

      <h2 className="mt-3 text-sm font-bold line-clamp-2 group-hover:text-primary transition">
        {person.name}
      </h2>

      <p className="text-sm text-base-content/55">
        {formatProfession(person.known_for_department) || "Contributor"}
      </p>

      {knownForTitle && (
        <p className="text-xs text-base-content/45 line-clamp-1 mt-1">
          Known for: {knownForTitle}
        </p>
      )}
    </Link>
  );
}