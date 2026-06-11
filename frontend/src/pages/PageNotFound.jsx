import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LuArrowLeft,
  LuClapperboard,
  LuTv,
} from "react-icons/lu";
import { FaHome } from "react-icons/fa";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page Not Found | Flickhive</title>
        <meta
          name="description"
          content="The page you requested could not be found."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-300/30 px-4 py-12 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-linear-to-b from-base-200/40 via-transparent 
            to-base-300/40"
          aria-hidden="true"
        />

        <div
          className="absolute text-[13rem] sm:text-[18rem] lg:text-[26rem] font-black 
            tracking-tighter text-primary/5 select-none"
          aria-hidden="true"
        >
          404
        </div>

        <section
          className="relative z-10 w-full max-w-xl rounded-box border border-white/10 
            bg-base-200/75 backdrop-blur-md px-6 py-9 sm:px-10 sm:py-11 text-center shadow-2xl"
          aria-labelledby="not-found-title"
        >
          <div
            className="mx-auto w-16 h-16 rounded-full bg-primary/15 text-primary 
              flex items-center justify-center mb-5"
            aria-hidden="true"
          >
            <LuClapperboard size={30} />
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Error 404
          </p>

          <h1
            id="not-found-title"
            className="mt-2 text-3xl sm:text-4xl font-black tracking-tight"
          >
            This scene is missing
          </h1>

          <p className="mt-3 text-base-content/60 leading-relaxed">
            The page may have been removed, renamed, or never existed. Return
            home or continue exploring Flickhive.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/" className="btn btn-primary rounded-full">
              <FaHome aria-hidden="true" />
              Back to Home
            </Link>

            <button
              type="button"
              className="btn btn-outline rounded-full"
              onClick={() => navigate(-1)}
            >
              <LuArrowLeft aria-hidden="true" />
              Go Back
            </button>
          </div>

          <div className="divider my-7 text-base-content/30">or explore</div>

          <nav
            aria-label="Explore Flickhive"
            className="flex flex-wrap justify-center gap-2"
          >
            <Link
              to="/movies/popular"
              className="btn btn-ghost btn-sm rounded-full border border-white/10"
            >
              <LuClapperboard aria-hidden="true" />
              Popular Movies
            </Link>

            <Link
              to="/tv/popular"
              className="btn btn-ghost btn-sm rounded-full border border-white/10"
            >
              <LuTv aria-hidden="true" />
              Popular TV Shows
            </Link>
          </nav>
        </section>
      </main>
    </>
  );
}