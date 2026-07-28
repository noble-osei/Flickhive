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
- **Auth middleware duplication resolved** — `validateAccessToken` and
  `validateRefreshToken` (`backend/src/middlewares/auth.js`) now share a
  `createTokenValidator({ cookieName, secretEnvVar, attachToken })`
  factory; only the cookie name, JWT secret env var, and whether
  `req.token` gets attached (refresh only) differ. The secret is still
  looked up as `process.env[secretEnvVar]` inside the per-request
  handler rather than resolved at factory-call time, since `dotenv.config()`
  in `server.js` runs after route/middleware imports are evaluated (ESM
  import hoisting) — resolving eagerly would have baked in `undefined`.
  Exported names/behavior unchanged; verified with `node --check`.
- **Cookie-options duplication resolved** — `sendAccessTokenCookie` and
  `sendRefreshTokenCookie` (`backend/src/utils/authHelper.js`) now spread
  a shared `baseCookieOptions()` (`httpOnly`/`secure`/`sameSite`) and only
  set their own `maxAge`. Kept as a function (not a plain object) so
  `secure: process.env.NODE_ENV === "production"` is still evaluated
  per-call rather than baked in at module load. Method names/signatures
  unchanged; verified with `node --check`.
- **Shared `Tabs` component extracted** — new
  `frontend/src/components/ui/Tabs.jsx` exports `Tabs` (the
  `tabs tabs-border` wrapper) and `Tab` (the `input[type=radio].tab` +
  `tab-content` pair, with the `aria-label="{label} {count}"` convention
  centralized). Migrated all three hand-rolled instances:
  `VideosSection`'s `VideoTab` (`components/media/MediaDetails.jsx`),
  `CreditsSection`'s `CreditsTab` (`pages/PersonDetails.jsx`), and the
  previously-never-extracted inline cast/crew tabs
  (`pages/FullCastCrew.jsx`) — the latter's conditional third `Creators`
  tab (TV only, `{!isMovie && <Tab>...}`) works unchanged since `Tab` is
  just a normal child. `VideoTab`/`CreditsTab` wrapper functions removed
  entirely (they added nothing beyond forwarding to the shared shell);
  each page's own content shape and empty-state markup stayed untouched,
  passed as `Tab`'s `children`. `contentClassName` prop preserves the one
  real markup difference (`pt-4` in videos vs `pt-5` elsewhere).
  `pages/SearchResults.jsx`'s `tabs tabs-border` usage was surveyed and
  deliberately left alone — it's `<button role="tab">`s driven by
  `useSearchParams`, not radio inputs, with no `tab-content` panels, a
  structurally different pattern. Verified with lint and build (both
  clean); Playwright visual verification against a running dev server
  attempted but blocked by a slow/flaky Chromium binary download in this
  environment — same DOM output (classes, `aria-label` text, conditional
  tab count) confirmed by direct code comparison instead.
- **TMDB fetch caching added (Performance items 1+2 closed)** —
  `frontend/src/hooks/useFetch.jsx` now has a module-level `cache`
  (`url -> { data, timestamp }`, 5-minute `STALE_TIME`) and `inFlight`
  (`url -> { promise, controller, refCount }`) Map. A fresh cache hit for
  a URL is derived directly at render time (no fetch, no re-render churn);
  concurrent callers for the same URL share one in-flight request via
  `refCount`, and the shared `AbortController` is only aborted once every
  subscriber has unmounted, so one component leaving doesn't cancel
  another's still-pending fetch. `refetch()` deletes the URL's cache entry
  before bumping `retryKey`, so it always forces a real network call.
  Errors are never written to `cache`, so a failed request can't poison
  later retries. Public signature `useFetch(url, enabled)` → `{ data,
  loading, error, refetch }` is unchanged — all 11 existing call sites
  (`Home.jsx` ×6, `MovieDetails`, `TvShowDetails`, `SeasonDetails` ×2,
  `PersonDetails`, `FullCastCrew`, `SearchResults`, `Browse`, `SearchBar`)
  needed zero changes, including `SearchBar`'s `enabled`-gated debounce
  and `Browse`'s null-url-on-person-tab pattern. Verified manually against
  a running dev server: navigating away from `/` and back no longer
  refetches any of Home's 6 TMDB requests. Cache/in-flight Maps are
  intentionally unbounded (no LRU eviction) — a deliberate scoping choice
  for a single-session browsing SPA, not an oversight.
- **`useGenres` TTL added (Performance item 3 closed)** —
  `frontend/src/hooks/useGenres.jsx`'s `localStorage` cache now stores
  `{ version, timestamp, data }` instead of a bare merged-genres object.
  A missing/version-mismatched/expired (>24h `TTL`) entry is treated as a
  cache miss and refetched, fixing the old `if (genres) return` behavior
  that cached forever. `CACHE_VERSION` bump transparently migrates old
  unwrapped blobs (they fail the version check and get rewritten). Public
  API (`useGenres()` → `genres | null`) unchanged; its only consumer,
  `HeroSlideshow.jsx`, needed no changes.
- **Vendor-chunk "duplication" (Performance item 4) investigated and closed
  as a false alarm** — used `rollup-plugin-visualizer` plus a temporary
  `build.sourcemap: true` to inspect the actual module contents of each
  `dist/assets/react-*.js` chunk (both reverted after; `dist/` is
  gitignored so nothing landed in git). Only one of the 9 chunks
  (`react-DSvSf3Zy.js`, ~8kB) is the real `react` package. The other 8 are
  unrelated per-provider packages pulled in by `react-player`
  (`components/media/VideoPlayer.jsx`) — `youtube-video-element`,
  `vimeo-video-element`, `hls-video-element`, `dash-video-element`,
  `twitch-video-element`, `wistia-video-element`, `spotify-audio-element`,
  `tiktok-video-element` — each of which ships its own tiny wrapper file
  literally named `react.js`, which is what Vite's default chunk-naming
  heuristic (derives the name from the facade module) latches onto,
  producing the misleading `react-<hash>.js` names. `react-player` already
  wraps each provider in its own `React.lazy(() => import(...))`
  internally (`node_modules/react-player/dist/players.js`) and only
  invokes the one whose `canPlay(src)` matches at render time — since
  `VideoPlayer.jsx` only ever passes a `youtube.com/watch?v=` URL, only the
  YouTube provider chunk is ever fetched by the browser in practice; the
  other 7 exist in `dist/` but are dead weight that's never requested.
  React is not duplicated across chunks. No `manualChunks` change needed;
  eliminating the other 7 unused provider chunks entirely would require
  reimplementing `react-player`'s internal (non-exported-API) player
  wiring, which is fragile and disproportionate for build-output-only
  clutter with no real user-facing cost — not worth doing unless it
  becomes an actual network-transfer problem.

## Next
All Duplicated-code and Performance backlog items are now closed. The one
remaining open item is the Security one below (`VITE_TMDB_TOKEN` exposed
client-side) — not urgent per the existing Decisions entry, but it's the
last thing on the backlog if picking where to start next.

## Known Issues / Cleanup Backlog

### Security
- [ ] `VITE_TMDB_TOKEN` is bundled client-side (any `VITE_`-prefixed var
      ships to the browser) — anyone can pull it from devtools and burn our
      TMDB quota. Fine for now, but if this goes further, proxy TMDB calls
      through the backend so the token isn't public.

### Duplicated code
- [x] `validateAccessToken` / `validateRefreshToken`
      (`backend/src/middlewares/auth.js`) are identical except for cookie
      name and secret — collapse into one factory function.
- [x] `sendAccessTokenCookie` / `sendRefreshTokenCookie`
      (`backend/src/utils/authHelper.js`) share the same cookie-options
      shape — factor out the common options.
- [x] Three separate hand-rolled implementations of the same DaisyUI
      radio-tab pattern: `VideoTab` (`MediaDetails.jsx`), `CreditsTab`
      (`PersonDetails.jsx`), cast/crew tabs (`FullCastCrew.jsx`) — worth a
      shared `Tabs` component if a fourth instance shows up.

### Performance
- [x] `Home.jsx` fires 6 independent TMDB requests on every mount with no
      caching — revisiting `/` always refetches everything.
- [x] No caching/dedup layer for TMDB calls in general (`useFetch` has no
      stale-time or cache) — navigating back to an already-fetched page
      always refetches. Consider React Query or a simple in-memory
      URL-keyed cache.
- [x] `useGenres`'s `localStorage` cache (`frontend/src/hooks/useGenres.jsx:16`)
      never expires — no TTL/versioning, so genre renames on TMDB's side
      never show up until the user clears storage.
- [x] Bundle has an unusually high number of near-duplicate vendor chunks
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
- **Data fetching**: plain `useFetch` hook (abort-controller based), now
  with a hand-rolled module-level cache + in-flight dedup (5-minute
  stale-time, no LRU eviction) rather than React Query — proportionate to
  the app's current size (no mutations/pagination/offline needs yet that
  would justify a library). Revisit if those needs show up.
