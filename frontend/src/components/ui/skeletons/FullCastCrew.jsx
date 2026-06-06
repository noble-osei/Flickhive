export default function FullCastCrewSkeleton() {
  return (
    <main className="bg-base-300/30 min-h-screen pb-10 animate-pulse">
      <section className="relative">
        <div className="relative h-56 lg:h-96 overflow-hidden bg-base-200" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          <div className="flex gap-4 lg:gap-6 -mt-16 lg:-mt-28 relative z-10">
            <div className="w-28 h-42 lg:w-52 lg:h-78 rounded-xl bg-base-200 border border-white/10 shrink-0" />

            <div className="pt-16 lg:pt-30 min-w-0 flex-1 space-y-3">
              <div className="h-8 lg:h-12 w-3/4 rounded bg-base-200" />
              <div className="h-5 w-40 rounded bg-base-200" />

              <div className="flex gap-2">
                <div className="h-4 w-16 rounded bg-base-200" />
                <div className="h-4 w-20 rounded bg-base-200" />
                <div className="h-4 w-24 rounded bg-base-200" />
              </div>

              <div className="hidden lg:block h-12 w-40 rounded-full bg-base-200 mt-5" />
            </div>
          </div>

          <div className="lg:hidden h-10 w-36 rounded-full bg-base-200 mt-4" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4 space-y-8">
          <div className="h-12 w-full rounded-full bg-base-200" />

          <div>
            <div className="flex gap-3 border-b border-white/10 pb-2">
              <div className="h-8 w-20 rounded bg-base-200" />
              <div className="h-8 w-20 rounded bg-base-200" />
              <div className="h-8 w-24 rounded bg-base-200" />
            </div>

            <div className="pt-5">
              <div className="h-7 w-28 rounded bg-base-200 mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <PersonCreditCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-4">
          <SidebarBoxSkeleton lines={5} />
          <SidebarBoxSkeleton lines={7} />
        </aside>
      </div>
    </main>
  );
}

function PersonCreditCardSkeleton() {
  return (
    <div className="rounded-box bg-primary/12 border border-white/10 p-3 flex gap-3">
      <div className="w-16 h-16 rounded-full bg-base-200 shrink-0" />

      <div className="min-w-0 flex-1 space-y-2 pt-1">
        <div className="h-4 w-2/3 rounded bg-base-200" />
        <div className="h-3 w-full rounded bg-base-200" />
        <div className="h-3 w-1/2 rounded bg-base-200" />
      </div>
    </div>
  );
}

function SidebarBoxSkeleton({ lines = 4 }) {
  return (
    <div className="rounded-box bg-primary/20 px-4 py-3">
      <div className="h-4 w-24 rounded bg-base-200 mb-4" />

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index}>
            <div className="h-3 w-16 rounded bg-base-200/80 mb-1" />
            <div className="h-3 w-28 rounded bg-base-200" />
          </div>
        ))}
      </div>
    </div>
  );
}