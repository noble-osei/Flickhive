import { Link, Outlet } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export default function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-base-200">
      {/* Background */}
      <Background />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="px-4 lg:px-16 xl:px-0">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between">
            <Link to="/" className="text-3xl font-bold">
              Flick<span className="text-primary">hive</span>
            </Link>

            <Link
              to="/"
              className="btn btn-ghost btn-sm rounded-full hover:bg-white/10"
            >
              <LuArrowLeft size={18} />
              Browse
            </Link>
          </div>
        </header>

        {/* Page */}
        <section className="flex flex-1 items-center justify-center px-4 py-8">
          <Outlet />
        </section>

        {/* Footer */}
        <footer className="px-4 py-6 lg:px-16 xl:px-0">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center text-sm 
            text-base-content/55 md:flex-row md:justify-between">
            <span>© {new Date().getFullYear()} Flickhive</span>

            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src="/auth-bg.webp"
        alt=""
        aria-hidden="true"
        className="
          h-full
          w-full
          object-cover
          object-center
          brightness-50
          scale-105
          animate-[slowZoom_20s_linear_infinite_alternate]
        "
      />

      {/* Top → Bottom gradient */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-b
          from-base-200/20
          via-transparent
          to-base-200
        "
      />

      {/* Left → Right gradient */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-r
          from-base-200/70
          via-base-200/20
          to-transparent
        "
      />
    </div>
  );
}