export default function PersonDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-base-300/30 pb-10 animate-pulse">
      <section className="relative">
        <div className="h-48 lg:h-80 bg-base-200" />

        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <div
            className="flex flex-col items-center lg:flex-row lg:items-end gap-4 lg:gap-6 
            -mt-24 lg:-mt-36 relative z-10"
          >
            <div
              className="w-36 h-52 lg:w-52 lg:h-78 rounded-xl bg-base-200 border 
              border-white/10 shrink-0"
            />

            <div className="lg:pb-5 w-full max-w-xl space-y-3">
              <div className="h-8 lg:h-12 w-3/4 rounded bg-base-200 mx-auto lg:mx-0" />
              <div className="h-4 w-28 rounded bg-base-200 mx-auto lg:mx-0" />
              <div className="h-4 w-full rounded bg-base-200" />
            </div>
          </div>
        </div>
      </section>

      <div
        className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-8 grid 
        grid-cols-1 lg:grid-cols-5 gap-8"
      >
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-3">
            <div className="h-6 w-32 rounded bg-base-200" />
            <div className="h-4 w-full rounded bg-base-200" />
            <div className="h-4 w-5/6 rounded bg-base-200" />
            <div className="h-4 w-2/3 rounded bg-base-200" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 rounded-box bg-base-200" />
            ))}
          </div>

          <div>
            <div className="h-6 w-32 rounded bg-base-200 mb-4" />

            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="w-38 shrink-0">
                  <div className="h-56 rounded-lg bg-base-200" />
                  <div className="h-4 rounded bg-base-200 mt-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <div className="h-52 rounded-box bg-base-200" />
          <div className="h-36 rounded-box bg-base-200" />
        </aside>
      </div>
    </main>
  );
}