export default function DetailsSkeleton() {
  return (
    <main className="bg-base-300/30 min-h-screen animate-pulse">
      <section className="relative">
        <div className="h-56 lg:h-96 bg-base-200" />

        <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <div className="flex gap-4 lg:gap-6 -mt-16 lg:-mt-28 relative z-10">
            <div className="w-28 h-42 lg:w-52 lg:h-78 rounded-xl bg-base-200 border border-white/10" />

            <div className="pt-16 lg:pt-30 flex-1 space-y-3">
              <div className="h-8 lg:h-12 w-3/4 bg-base-200 rounded" />
              <div className="h-4 w-1/2 bg-base-200 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-base-200 rounded-full" />
                <div className="h-6 w-24 bg-base-200 rounded-full" />
                <div className="h-6 w-16 bg-base-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-3">
            <div className="h-6 w-36 bg-base-200 rounded" />
            <div className="h-4 w-full bg-base-200 rounded" />
            <div className="h-4 w-5/6 bg-base-200 rounded" />
            <div className="h-4 w-2/3 bg-base-200 rounded" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 rounded-box bg-base-200" />
            ))}
          </div>

          <div>
            <div className="h-6 w-40 bg-base-200 rounded mb-4" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="w-24 flex-none">
                  <div className="w-20 h-20 rounded-full bg-base-200 mx-auto" />
                  <div className="h-3 bg-base-200 rounded mt-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="hidden lg:block space-y-4">
          <div className="h-28 rounded-box bg-base-200" />
          <div className="h-36 rounded-box bg-base-200" />
          <div className="h-32 rounded-box bg-base-200" />
        </aside>
      </div>
    </main>
  );
}