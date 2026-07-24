import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useAuth } from "../context/Auth.jsx";
import { useWatchlist } from "../context/Watchlist.jsx";
import MovieCard from "../components/media/MovieCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import BrowseGridSkeleton from "../components/ui/skeletons/BrowseGrid.jsx";

export default function Watchlist() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, removeItem } = useWatchlist();

  if (authLoading) return <BrowseGridSkeleton />;

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-base-300/30">
        <section className="max-w-md w-full text-center rounded-box bg-primary/15 border border-white/10 p-6">
          <h1 className="text-2xl font-bold">Log in to see your watchlist</h1>
          <p className="text-base-content/60 mt-2">
            Save movies and shows to watch later — log in to get started.
          </p>
          <Link to="/login" className="btn btn-primary rounded-full mt-5">
            Log In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Watchlist | Flickhive</title>
        <meta
          name="description"
          content="Movies and TV shows you've saved to watch later."
        />
      </Helmet>

      <main className="min-h-screen bg-base-300/30 pb-10">
        <header className="max-w-7xl mx-auto px-4 pt-8 pb-6 lg:px-16 xl:px-0">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            My Watchlist
          </h1>
          <p className="text-base-content/60 mt-2">
            {items.length} saved title{items.length === 1 ? "" : "s"}
          </p>
        </header>

        <section className="max-w-7xl mx-auto px-4 lg:px-16 xl:px-0">
          {loading ? (
            <BrowseGridSkeleton />
          ) : items.length === 0 ? (
            <EmptyState
              title="Your watchlist is empty"
              message="Add movies and TV shows to your watchlist to see them here."
            />
          ) : (
            <div className="flex flex-wrap gap-4 lg:gap-6">
              {items.map((doc) => (
                <MovieCard
                  key={doc._id}
                  item={{
                    id: doc.tmdbId,
                    media_type: doc.mediaType,
                    ...doc.mediaData,
                  }}
                  onRemove={() => removeItem(doc._id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
