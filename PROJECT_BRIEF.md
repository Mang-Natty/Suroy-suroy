# Suroy-Suroy — Project Brief

> **suroy-suroy** (Cebuano): to wander around, to stroll for the joy of it.

A **light, local-first travel planner**, Philippines-first, by Nathaniel Nacario
(nattydev). No accounts, no signup wall — open it and start planning. This is
Nathaniel's SECOND portfolio project (the first: his gamified portfolio at
https://natty-devtravels.vercel.app). When v1 ships (end of M5), Suroy-Suroy gets
added to the portfolio's Projects section via its admin.

## Vision

Planning a Philippine trip usually means a chaotic group chat, a half-broken
spreadsheet, and someone's screenshots. Suroy-Suroy is one joyful page per trip:
the days, the stops, the route between them, the budget in pesos, and the packing
list — instantly usable, nothing to install, nothing to sign up for. Light by
architecture, not just by marketing: all data lives in the visitor's browser.

## Product decisions (already made — don't relitigate)

| Decision | Choice |
|---|---|
| Name / repo | Suroy-Suroy / `suroy-suroy` |
| Backend | **None in v1.** Local-first: browser storage behind `lib/storage.ts` |
| Accounts | None. Cloud sync = possible M6+, never a v1 concern |
| Currency | PHP (₱) default, hardcoded fine for v1 |
| Flavor | Philippines-first: PH examples/seeds, Filipino personality in copy |
| Maps | MapLibre GL + CARTO Voyager raster tiles (free, no key, attribution required) |
| Routing | OSRM public demo server (free, no key) — swappable design |
| Design | Fresh/tropical modern UI. Deliberately NOT the portfolio's retro 2-bit — a second visual language shows range |
| Deploy | Vercel hobby, push-to-main deploys |

## Milestones

Ship each milestone fully (build passes, deployed, usable) before starting the
next. One milestone ≈ one working session.

### M0 — Foundation
- `npx create-next-app@latest` (TypeScript, Tailwind, App Router) in this folder.
- **Pin reality:** check installed versions; read `node_modules/next/dist/docs/`
  before writing Next-specific code. Do NOT trust training-data APIs (hard lesson
  from the portfolio: e.g. Next 16 renamed middleware→proxy, async `params`).
- Git repo (Nathaniel runs the git commands himself — see CLAUDE.md), GitHub, Vercel.
- Run the `ui-ux-pro-max` skill: `--design-system --persist -p "Suroy-Suroy"` →
  commit `design-system/MASTER.md`. Direction: tropical, light, friendly; think
  PH sea/sun palette; rounded + airy, NOT pixel-retro.
- A simple landing page: name, tagline, "Start planning →" (no auth, straight in).

### M1 — Trips & day-by-day itinerary (the heart)
- `lib/storage.ts` — THE only module that touches persistence. Versioned schema
  (`{ v: 1, trips: Trip[] }`), typed helpers (`getTrips`, `saveTrip`,
  `deleteTrip`…), so a future sync layer or schema migration slots in cleanly.
- Trip CRUD: name, date range, cover color/emoji.
- Day-by-day builder: days auto-derived from the date range; add stops per day
  (title, note, optional time); reorder stops; delete with confirm.
- Empty states with personality ("Wala pay plano? Tara, suroy ta!").

### M2 — Traveler map & routes (the differentiator)
- Per-trip map view: MapLibre + Voyager tiles (the portfolio's `AtlasMap.tsx` and
  `MapPicker.tsx` are proven reference patterns — same tile URLs, same attribution).
- Add coordinates to stops via Nominatim place search (reference: portfolio
  `MapPicker.tsx`; respect fair use — debounce, identify via header if needed).
- **Routes:** for a selected day, draw the route through its stops via OSRM demo:
  `https://router.project-osrm.org/route/v1/driving/{lng,lat;lng,lat...}?overview=full&geometries=geojson`
  → polyline on the map + per-leg and per-day distance/duration.
- OSRM demo is fair-use, no SLA: keep calls user-triggered (a "Route this day"
  button, not automatic), cache results in the trip data, and isolate the call in
  `lib/routing.ts` so OpenRouteService (free key, 2k req/day) can replace it later.
- v1 = driving profile; walking toggle if cheap.

### M3 — Budget tracker (₱)
- Per-trip budget; expenses with category (food, transpo, lodging, activities,
  pasalubong), amount, note.
- Remaining-funds bar — allowed to be funny. Continuity gag with the portfolio's
  locked passport page ("ABROAD FUND") is encouraged.
- Totals per category; simple, readable; no charts library — CSS/SVG bars.

### M4 — Packing checklist
- Reusable templates (Beach, Hike, City…) + custom items; per-trip check-off with
  a progress indicator. Small, satisfying, quick milestone.

### M5 — Wishlist, share, ship
- Bucket-list places on a mini map (wishlist ≠ trip; simplest possible model).
- **Export/import trip as JSON file** — the local-first answer to sharing/backup.
- Polish pass: responsive audit (375px), dark mode if the design system calls for
  it, a11y pass (labels, focus, reduced-motion).
- **Portfolio integration:** add Suroy-Suroy via the portfolio's `/admin/projects`
  (cover screenshot, tags, live URL + repo URL, long write-up) — it gets its own
  `/projects/suroy-suroy` page there automatically.

### M6+ — Only if wanted later
Supabase sync + accounts, PWA/offline install, collaborative trips, ORS routing
upgrade, transit hints.

## Non-goals for v1 (say no politely)
Auth, servers, databases, real-time collab, currency conversion, flight/hotel
APIs, mobile app. Light means light.

## Owner & working style (same as the portfolio — it worked)
Nathaniel is a beginner leveling up fast: **explain the why** while building.
**Hand him git/deploy commands — never run them for him.** Interview + plan
before big builds. `npm run build` must pass before anything is handed over for
push. Milestone-sized sessions with a written recap at the end.
