# Current Task

## Current goal
Wire up the **Watchlist** feature end-to-end. The backend API is fully built
(`/api/watchlist` — add/list/delete), and the frontend already has UI elements
that *reference* it (nav link, "Add to Watchlist" buttons), but none of them
are actually connected. Authentication (signup/login/logout/refresh) was just
finished across the last ~15 commits and is the foundation this depends on.

## Done
- **Backend** (`backend/src/`) — layered `routes → controllers → services →
  repositories → models`, fully built for both features:
  - Auth: signup, login (with optional "remember me" refresh token), logout,
    refresh, `/auth/me`. JWT access token (15m, httpOnly cookie) + refresh
    token (7d, httpOnly cookie, bcrypt-hashed at rest, rotated on refresh).
  - Watchlist: `POST/GET /api/watchlist`, `DELETE /api/watchlist/:mediaId`
    (all behind `validateAccessToken`). Stores arbitrary `mediaData`
    (`Mixed` type) per user.
- **Frontend auth** — `AuthProvider`/`useAuth` context, axios interceptor that
  auto-refreshes on 401 and queues concurrent requests, `Login`/`Signup`
  pages + `AuthForm`/`SignupForm`, `AuthLayout` with background art,
  navbar Login/Logout state.
- **Frontend browsing** — Home (trending/top-rated/popular/discover
  carousels), Browse (movies/tv/people with filters, sort, pagination),
  Search, Movie/TV/Season/Person details, Full Cast & Crew — all reading
  directly from TMDB via `tmdbInstance` (client-side, `VITE_TMDB_TOKEN`).
  Route-level code splitting + skeleton loaders throughout.
- Nav already has a `/watchlist` link and "Add to Watchlist" buttons
  scattered across `HeroSlideshow`, `MediaDetails` (`ActionButtons`) — these
  are placeholders with no `onClick` / no route yet.

## Next
1. Build a `Watchlist` page (`frontend/src/pages/Watchlist.jsx`) + route in
   `App.jsx` so the existing nav link resolves instead of 404-ing.
2. Wire "Add to Watchlist" buttons (`HeroSlideshow.jsx`, `MediaDetails.jsx`
   `ActionButtons`) to call `POST /api/watchlist` via `FlickhiveInstance`,
   with optimistic UI / toast feedback (pattern already used in `Auth.jsx`).
3. Add a way to remove items (call existing `DELETE /api/watchlist/:mediaId`)
   and reflect current watchlist state on buttons (e.g. filled vs outline
   icon) — needs a way to know "is this item already saved" cheaply (likely
   fetch watchlist once into context/state rather than per-card).
4. Decide what `mediaData` shape to store (see Decisions below) before
   wiring the add call, since backend just persists whatever is sent.
5. Work through the Known Issues / Cleanup Backlog below — not blocking the
   watchlist work, but fix opportunistically while touching nearby files.

## Known Issues / Cleanup Backlog

### Security
- [ ] `backend/src/schemas/user.js` — `password` isn't `.required()` in the
      shared Joi `baseSchema`, so signup can currently pass without a
      password and blow up as an uncaught Mongoose `ValidationError` (500)
      instead of a clean 400.
- [ ] CORS origin is hardcoded to `http://localhost:5173`
      (`backend/src/server.js:16-21`) — needs to come from an env var
      before any deployment.
- [ ] No rate limiting on `/auth/login` or `/auth/signup` — brute-forceable.
- [ ] `Watchlist.mediaData` is unvalidated `Schema.Types.Mixed`
      (`backend/src/models/Watchlist.js:10`) — any JSON blob can be stored,
      no shape/size constraints. Should get a real schema once we decide
      what to store (see Decisions).
- [ ] `VITE_TMDB_TOKEN` is bundled client-side (any `VITE_`-prefixed var
      ships to the browser) — anyone can pull it from devtools and burn our
      TMDB quota. Fine for now, but if this goes further, proxy TMDB calls
      through the backend so the token isn't public.
- [ ] Inconsistent error status codes for the same failure class in
      `backend/src/services/auth.js` — wrong password → 400 (line 73),
      unknown email/bad token → 401 (line 33) — pick one convention.

### Correctness / dead code
- [ ] Watchlist nav link (`Layout.jsx:197`) points to `/watchlist`, which
      has no route in `App.jsx` — currently falls through to the 404 page.
      (Covered by the Next steps above, tracked here so it isn't lost.)
- [ ] Every "Add to Watchlist" button (`HeroSlideshow.jsx:257-266`,
      `MediaDetails.jsx` `ActionButtons`) has no `onClick` — pure UI
      placeholder.
- [ ] `repositories/common.js`'s `validateQueryOptions` doesn't validate
      anything, it applies query modifiers (select/populate/sort/lean) —
      rename to something like `applyQueryOptions` to stop the confusion.
- [ ] `SignupForm.jsx:19-26` — `handleConfirmPasswordChange` has an empty
      branch with a "silently check" comment that does nothing. Either
      remove the dead branch or implement the inline validation it implies.

### Duplicated code
- [ ] **TMDB image URL / `srcSet` construction** — copy-pasted near-verbatim
      in ~10 files: `MovieCard.jsx`, `BrowseMediaCard.jsx`,
      `PersonBrowseCard.jsx`, `SearchMediaCard.jsx`, `SearchResults.jsx`
      (x2: `MediaResultCard`/`PersonResultCard`), `HeroSlideshow.jsx`,
      `MovieDetails.jsx`, `TvShowDetails.jsx`, `SeasonDetails.jsx`,
      `PersonDetails.jsx`, `FullCastCrew.jsx`, `MediaDetails.jsx`
      (`CastSection`). Extract a single `buildImageProps(path, fallback)`
      helper into `helpers/media.js`. Biggest single cleanup win in the repo.
- [ ] **Hero/banner section markup** (backdrop + gradient overlays + poster
      + title/meta row) reimplemented separately in `MovieDetails`,
      `TvShowDetails`, `SeasonDetails`, `FullCastCrew` — collapse into one
      parameterized `HeroSection` component.
- [ ] **Loading/error/empty-data guard block**
      (`if (loading) return <Skeleton/>; if (error) return <PageError/>; ...`)
      repeated identically at the top of every details/browse page — pull
      into a shared hook or wrapper component.
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
- Known duplicated pattern across ~10 files: manual TMDB `srcSet`/poster
  fallback construction (`hasPoster ? ... : "/movie.svg"`). Not blocking
  anything — worth extracting to a helper only if touching several of
  those files in the same change; not a prerequisite for the watchlist work.
