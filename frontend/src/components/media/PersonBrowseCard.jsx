import { Link } from "react-router-dom";
import { formatProfession } from "../../helpers/media.js";

const IMG = import.meta.env.VITE_IMG;

export default function PersonBrowseCard({ person, i }) {
  const hasProfile = !!person.profile_path;
  const profile = hasProfile
    ? `${IMG}/w342${person.profile_path}`
    : `/person.svg`;
  const profileSrcset = hasProfile
    ? `${IMG}/w342${person.profile_path} 342w, ${IMG}/w500${person.profile_path} 500w, ` +
      `${IMG}/w780${person.profile_path} 780w, ${IMG}/w185${person.profile_path} 185w, ` +
      `${IMG}/w154${person.profile_path} 154w`
    : undefined;

  const knownFor = person.known_for?.[0];
  const knownForTitle = knownFor?.title ?? knownFor?.name;

  return (
    <Link to={`/people/${person.id}`} className="group min-w-0">
      <div className="overflow-hidden rounded-lg bg-base-200 aspect-2/3">
        <img
          src={profile}
          alt={person.name}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          srcSet={profileSrcset}
          loading={i < 5 ? "eager" : "lazy"}
          decoding={i < 5 ? "sync" : "async"}
          fetchPriority={i < 5 ? "auto" : "low"}
          className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
          onError={(e) => (e.target.src = "/person.svg")}
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
