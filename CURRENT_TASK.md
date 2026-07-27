# Current Task

## Current goal
**Watchlist feature is now wired end-to-end** (backend + frontend). Next up
is working through the Known Issues / Cleanup Backlog below — nothing is
currently blocking, so pick whichever item is most relevant to what you're
about to touch.

## Done
- **Backend** (`backend/src/`) — layered `routes → controllers → services →
  repositories → models`, fully built for both features:
  - Auth: signup, login (with optional "remember me" refresh token), logout,
    refresh, `/auth/me`. JWT access token (15m, httpOnly cookie) + refresh
    token (7d, httpOnly cookie, bcrypt-hashed at rest, rotated on refresh).
  - Watchlist: `POST/GET /api/watchlist`, `DELETE /api/watchlist/:mediaId`
    (all behind `validateAccessToken`). `POST` body (`tmdbId`, `mediaType`,
    `mediaData`) is Joi-validated; `mediaData` is a real subschema now
    (title/name/poster_path/release_date/first_air_date/vote_average), not
    `Mixed`. Unique compound index on `(userId, tmdbId, mediaType)` blocks
    duplicates at the DB level; the service catches the Mongo 11000 error
    and turns it into a clean `409 Already in watchlist`. `password` is now
    `.required()` in the shared Joi `baseSchema`
    (`backend/src/schemas/user.js`), so signup/login without one return a
    clean 400 instead of an uncaught Mongoose `ValidationError` (500).
    `/auth/login` and `/auth/signup` are now rate-limited via
    `express-rate-limit` (`backend/src/middlewares/rateLimiter.js`) — login
    allows 10 failed attempts / 15 min per IP (`skipSuccessfulRequests`, so
    legitimate rapid successful logins aren't penalized), signup allows 10
    requests / hour per IP. Both return a `429` through the existing
    `AppError`/`errorHandler` pipeline. CORS origin (`backend/src/server.js`)
    now reads from `process.env.CORS_ORIGIN` instead of being hardcoded to
    `http://localhost:5173`, so it's configurable per environment ahead of
    deployment.
- **Frontend auth** — `AuthProvider`/`useAuth` context, axios interceptor that
  auto-refreshes on 401 and queues concurrent requests, `Login`/`Signup`
  pages + `AuthForm`/`SignupForm`, `AuthLayout` with background art,
  navbar Login/Logout state.
- **Frontend browsing** — Home (trending/top-rated/popular/discover
  carousels), Browse (movies/tv/people with filters, sort, pagination),
  Search, Movie/TV/Season/Person details, Full Cast & Crew — all reading
  directly from TMDB via `tmdbInstance` (client-side, `VITE_TMDB_TOKEN`).
  Route-level code splitting + skeleton loaders throughout.
- **Frontend watchlist** — fully wired:
  - `api/watchlist.js` — thin axios wrapper (`getWatchlist`/`addToWatchlist`/
    `removeFromWatchlist`) over `FlickhiveInstance`.
  - `context/Watchlist.jsx` — `WatchlistProvider`/`useWatchlist`, fetches
    the list once on login (race-guarded against overlapping fetches via a
    `cancelled` flag, since a fast user swap can leave a stale request
    in flight), exposes `items`/`loading`/`addItem`/`removeItem`.
  - `hooks/useWatch.jsx` — per-item `useWatch(tmdbId, mediaType)` derives
    `isWatching`/`add`/`remove`/`toggle` from context state, used by every
    "Add to Watchlist" button so they don't each refetch.
  - `pages/Watchlist.jsx` + `/watchlist` route in `App.jsx` — grid of
    `MovieCard`s built from stored `mediaData`, with a remove button, an
    empty state, and a logged-out prompt to log in.
  - "Add to Watchlist" buttons in `HeroSlideshow` and `MediaDetails`
    `ActionButtons` (used by `MovieDetails`/`TvShowDetails`) now call
    `toggle()` and swap icon/label between add and in-watchlist states.
  - `MovieCard`'s remove button calls `preventDefault`/`stopPropagation`
    since the card itself is a `react-router` `Link` — otherwise removing
    an item would also navigate to its details page.
- **Security backlog closed** — `validatePassword` (`backend/src/services/auth.js`)
  now throws `401` (was `400`) so wrong password and unknown email both
  return `401` + "Invalid credentials", closing a status-code-based
  user-enumeration side channel. Verified against `frontend/src/context/Auth.jsx`
  and the 401-triggered refresh interceptor in `frontend/src/api/axios.js` —
  both already treat this consistently.
- **Correctness / dead code backlog closed**:
  - `repositories/common.js`'s `validateQueryOptions` (which didn't validate
    anything) renamed to `applyQueryOptions` (and its two call sites in
    `repositories/user.js`/`repositories/watchlist.js`) to match what it
    actually does.
  - `SignupForm.jsx`'s `handleConfirmPasswordChange` empty branch removed;
    the existing `passwordsMatch`-driven `border-error`/"Passwords do not
    match" UI already covers this, no new logic needed.
- **TMDB image URL / `srcSet` duplication resolved** — extracted a single
  `buildImageProps(path, fallback)` helper into `helpers/media.js` and
  migrated all ~12 call sites (`MovieCard.jsx`, `BrowseMediaCard.jsx`,
  `PersonBrowseCard.jsx`, `SearchMediaCard.jsx`, `SearchResults.jsx`
  (`MediaResultCard`/`PersonResultCard`), `HeroSlideshow.jsx`,
  `MovieDetails.jsx`, `TvShowDetails.jsx`, `SeasonDetails.jsx`,
  `PersonDetails.jsx`, `FullCastCrew.jsx`, `MediaDetails.jsx`
  `CastSection`) over to it.
- **Hero/banner section markup duplication resolved** — extracted
  `HeroSection`/`HeroTitle`/`HeroMeta`/`HeroGenres`/`HeroTagline`/
  `HeroBackLink` into `components/media/MediaDetails.jsx` and migrated
  `MovieDetails`, `TvShowDetails`, `SeasonDetails`, `FullCastCrew` over to
  them. `HeroSection` owns the backdrop+gradient+poster wrapper and takes a
  `children` slot for the varying title/meta/genre content plus a
  `mobileActions` slot for the responsive action row (`ActionButtons` or
  `HeroBackLink`) — net -88 lines across the five files despite adding the
  new shared components. Verified visually with Playwright screenshots
  (desktop + mobile) against a running dev server for all four pages; no
  console errors beyond the expected backend-not-running ones.
- **Loading/error/empty-data guard block duplication resolved** — extracted
  `useFetchGuard` (`frontend/src/hooks/useFetchGuard.jsx`), a plain
  function (not a true hook internally, just named/called like one) that
  takes `{ loading, error, refetch, isEmpty, skeleton, errorTitle,
  errorMessage, emptyTitle, emptyMessage }` and returns either the
  skeleton, a `PageError`, or `null`. Migrated `MovieDetails`,
  `TvShowDetails`, `SeasonDetails`, `FullCastCrew`, `PersonDetails` to
  `const guard = useFetchGuard({...}); if (guard) return guard;`,
  preserving each page's existing custom error copy verbatim.
  `SeasonDetails` previously had no custom error copy (relied on
  `PageError`'s generic defaults) — gave it matching "Season not found"
  copy for consistency with the other four, a deliberate small behavior
  change bundled into the refactor. `Browse.jsx`, `SearchResults.jsx`,
  `Home.jsx`, `Watchlist.jsx` were surveyed but left alone — they have a
  meaningfully different shape (inline loading, no empty-data guard, or a
  different data source via `useAuth`/`useWatchlist`) and forcing them
  into this abstraction would have changed their UX. Verified via lint,
  build, and Playwright screenshots of both the happy path and a forced
  error path (bad movie ID, bad season number) for all 5 pages.

## Next
Work through the Known Issues / Cleanup Backlog below opportunistically —
none of it is currently blocking. Security, Correctness, and the
Duplicated-code items involving TMDB images / hero markup / fetch guards
are now clear; the remaining Duplicated-code items (auth middleware
factory, cookie-options factory, shared Tabs component) are the
highest-value next targets if picking where to start.

## Known Issues / Cleanup Backlog

### Security
- [ ] `VITE_TMDB_TOKEN` is bundled client-side (any `VITE_`-prefixed var
      ships to the browser) — anyone can pull it from devtools and burn our
      TMDB quota. Fine for now, but if this goes further, proxy TMDB calls
      through the backend so the token isn't public.

### Duplicated code
- [ ] `validateAccessToken` / `validateRefreshToken`
      (`backend/src/middlewares/auth.js`) are identical except for cookie
      name and secret — collapse into one factory function.
- [ ] `sendAccessTokenCookie` / `sendRefreshTokenCookie`
      (`backend/src/utils/authHelper.js`) share the same cookie-options
      shape — factor out the common options.
- [ ] Three separate hand-rolled implementations of the same DaisyUI
      radio-tab pattern: `VideoTab` (`MediaDetails.jsx`), `CreditsTab`
      (`PersonDetails.jsx`), cast/crew tabs (`FullCastCrew.jsx`) — worth a
      shared `Tabs` component if a fourth instance shows up.

### Performance
- [ ] `Home.jsx` fires 6 independent TMDB requests on every mount with no
      caching — revisiting `/` always refetches everything.
- [ ] No caching/dedup layer for TMDB calls in general (`useFetch` has no
      stale-time or cache) — navigating back to an already-fetched page
      always refetches. Consider React Query or a simple in-memory
      URL-keyed cache.
- [ ] `useGenres`'s `localStorage` cache (`frontend/src/hooks/useGenres.jsx:16`)
      never expires — no TTL/versioning, so genre renames on TMDB's side
      never show up until the user clears storage.
- [ ] Bundle has an unusually high number of near-duplicate vendor chunks
      (`dist/assets/react-*.js` × 9) — worth checking `vite.config.js`
      manual chunking to confirm React isn't being duplicated across
      chunks. Not yet root-caused, needs a bundle visualizer.

## Decisions
- **TMDB is called directly from the browser**, not proxied through the
  backend. The backend only owns auth + watchlist. Keep this split unless
  the TMDB token exposure becomes a real concern.
- **Auth tokens live in httpOnly cookies**, not localStorage/JS-readable
  state — access token 15m, refresh token 7d and only issued if
  "remember me" is checked at login.
- **Repository pattern on the backend** (`repositories/common.js`'s
  `validateQueryOptions` applies select/populate/sort/lean) — keep new
  Mongoose queries going through this rather than calling models directly
  in services.
- **Styling**: Tailwind v4 + DaisyUI, single `flickhive` theme
  (`main.jsx`), no CSS modules/styled-components — stay consistent with
  that.
- **Data fetching**: plain `useFetch` hook (abort-controller based, no
  cache/dedup layer, no React Query). Known limitation, not yet worth
  fixing unless refetching becomes a visible perf problem.
