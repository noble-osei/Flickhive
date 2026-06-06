export default function HomeSkeleton() {
  return (
    <main className="min-h-screen bg-base-300/30 animate-pulse">
      <section className="h-115 lg:h-screen lg:max-h-215 lg:min-h-150 bg-base-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-base-300 via-base-300/70 to-transparent" />

        <div className="absolute bottom-6 lg:bottom-16 left-4 right-4 lg:left-16 xl:left-0 max-w-7xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="lg:hidden w-20 h-28 rounded-xl bg-base-100/70" />

            <div className="max-w-xl flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-base-100/70" />
                <div className="h-5 w-20 rounded-full bg-base-100/70" />
                <div className="h-5 w-14 rounded-full bg-base-100/70" />
              </div>

              <div className="h-8 lg:h-14 w-4/5 rounded bg-base-100/70" />
              <div className="h-3 lg:h-4 w-full rounded bg-base-100/60" />
              <div className="h-3 lg:h-4 w-2/3 rounded bg-base-100/60" />

              <div className="flex gap-2 pt-2">
                <div className="h-9 lg:h-12 w-28 lg:w-36 rounded-full bg-base-100/70" />
                <div className="h-9 lg:h-12 w-9 lg:w-12 rounded-full bg-base-100/70" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <div className="h-8 w-8 lg:h-11 lg:w-11 rounded-full bg-base-100/60" />
            <div className="flex-1 flex justify-center gap-2">
              <div className="h-1 w-10 rounded-full bg-base-100/70" />
              <div className="h-1 w-4 rounded-full bg-base-100/50" />
              <div className="h-1 w-4 rounded-full bg-base-100/50" />
              <div className="h-1 w-4 rounded-full bg-base-100/50" />
            </div>
            <div className="h-8 w-8 lg:h-11 lg:w-11 rounded-full bg-base-100/60" />
          </div>
        </div>
      </section>

      <div className="space-y-8 py-8">
        {["Trending Today", "Top Rated Movies", "Popular TV Shows", "Coming Soon"].map(
          (title) => (
            <SkeletonRow key={title} />
          )
        )}
      </div>
    </main>
  );
}

function SkeletonRow() {
  return (
    <section className="px-4 lg:px-16 xl:px-0 max-w-7xl mx-auto">
      <div className="h-7 w-48 rounded bg-base-200 mb-4" />

      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="w-38 flex-none">
            <div className="w-full h-56 rounded-lg bg-base-200" />
            <div className="h-4 w-full rounded bg-base-200 mt-4" />
            <div className="h-3 w-2/3 rounded bg-base-200 mt-2" />
          </div>
        ))}
      </div>
    </section>
  );
}