export default function BrowseGridSkeleton({ personPage = false }) {
  return (
    <div
      className={`animate-pulse ${
        personPage
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
      }`}
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-2/3 rounded-lg bg-base-200" />
          <div className="h-4 w-4/5 rounded bg-base-200 mt-3" />
          <div className="h-3 w-1/2 rounded bg-base-200 mt-2" />
        </div>
      ))}
    </div>
  );
}