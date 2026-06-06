export default function SeasonDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-base-300/30 pb-10 animate-pulse">
      <section className="relative">
        <div className="h-56 lg:h-96 bg-base-200" />

        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <div className="flex gap-4 lg:gap-6 -mt-16 lg:-mt-28 relative z-10">
            <div className="w-28 h-42 lg:w-52 lg:h-78 rounded-xl bg-base-200 border border-white/10 shrink-0" />

            <div className="pt-16 lg:pt-30 flex-1 space-y-3">
              <div className="h-4 w-32 rounded bg-base-200" />
              <div className="h-8 lg:h-12 w-3/4 rounded bg-base-200" />
              <div className="h-4 w-1/2 rounded bg-base-200" />
              <div className="hidden lg:block h-12 w-36 rounded-full bg-base-200 mt-5" />
            </div>
          </div>

          <div className="lg:hidden h-10 w-36 rounded-full bg-base-200 mt-4" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 space-y-8">
          <section>
            <div className="h-6 w-32 rounded bg-base-200 mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-base-200" />
              <div className="h-4 w-5/6 rounded bg-base-200" />
              <div className="h-4 w-2/3 rounded bg-base-200" />
            </div>
          </section>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 rounded-box bg-base-200" />
            ))}
          </section>

          <section>
            <div className="h-6 w-32 rounded bg-base-200 mb-4" />

            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <EpisodeSkeletonCard key={index} />
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <div className="h-36 rounded-box bg-base-200" />
          <div className="h-80 rounded-box bg-base-200" />
        </aside>
      </div>
    </main>
  );
}

function EpisodeSkeletonCard() {
  return (
    <article className="rounded-box overflow-hidden bg-primary/12 border border-white/10 flex flex-col md:flex-row">
      <div className="w-full md:w-56 h-44 bg-base-200 shrink-0" />

      <div className="p-4 flex-1 space-y-3">
        <div className="flex justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-16 rounded bg-base-200" />
            <div className="h-5 w-3/4 rounded bg-base-200" />
          </div>

          <div className="h-5 w-12 rounded bg-base-200" />
        </div>

        <div className="h-3 w-1/2 rounded bg-base-200" />

        <div className="space-y-2 pt-2">
          <div className="h-3 w-full rounded bg-base-200" />
          <div className="h-3 w-5/6 rounded bg-base-200" />
          <div className="h-3 w-2/3 rounded bg-base-200" />
        </div>
      </div>
    </article>
  );
}