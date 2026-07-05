# Suroy-Suroy — The Project Story

> A readable guide to what this project is, how it's built, and why — written
> so you (Nathaniel) can answer any question about it with confidence.

---

## The elevator pitch (30 seconds)

**Suroy-Suroy** (Cebuano: *to wander around for the joy of it*) is a light,
local-first travel planner for Philippine trips. You plan your days, drop
stops on a real map, trace the driving route between them, track your budget
in pesos, and tick off a packing list — **with no signup, no account, and no
server storing your data**. Everything lives in your browser. Open it and
start planning.

It's my second portfolio project, deliberately different from my first (a
gamified portfolio with a retro pixel world) to show range: different
architecture, different design language, different problem.

---

## Why "local-first"? (the most important answer)

Most apps make you create an account so *they* can store your data on *their*
server. Suroy-Suroy flips that: **your data never leaves your device**. It's
stored in the browser's localStorage, structured and versioned.

Why this is a genuine engineering decision and not a shortcut:

1. **Zero friction** — a trip planner you can use 10 seconds after hearing
   about it. No signup wall, no password to forget.
2. **Privacy by architecture** — I can't leak user data because I never have
   it. There is no database to breach.
3. **Zero running cost** — no backend means it runs free on Vercel's hobby
   tier forever. "Light by architecture, not just by marketing."
4. **Honest constraint handling** — the tradeoff (data is per-device) is
   solved the local-first way: trips can be exported/imported as JSON files
   (v1 feature), and a future sync layer can be added because ALL persistence
   goes through one module (see Architecture below).

**If someone asks: "So it's just localStorage?"** — the answer: localStorage
is the *medium*; the engineering is the versioned schema (`{ v: 1, trips }`),
the single-module discipline (no component touches storage directly), and the
migration path that lets stored data survive app updates. That's the same
discipline you'd need for a database — applied client-side.

---

## Tech stack (and why each piece)

| Piece | What it does | Why chosen |
|---|---|---|
| **Next.js 16** (App Router) | React framework: routing, rendering, build | Industry standard; same stack as my portfolio so skills compound. Static-renders every page for speed |
| **TypeScript** | Types across the whole codebase | Catches bugs at compile time; makes the data model (Trip, Stop, Route) explicit and self-documenting |
| **Tailwind CSS v4** | Styling | Design tokens defined once in CSS (`@theme`), used as utilities everywhere; v4 is the CSS-first config generation |
| **MapLibre GL** | Interactive map rendering | Open-source (no Google Maps bill, no API key). Same engine my portfolio's travel page uses — proven pattern |
| **CARTO Voyager tiles** | The map imagery | Free raster tiles, no key, just attribution. Warm look that fits the design |
| **Nominatim (OpenStreetMap)** | Place search → coordinates | Free geocoding, used respectfully: user-triggered, debounced |
| **OSRM demo server** | Route calculation between stops | Free routing (driving/walking), no key. Isolated in `lib/routing.ts` so it can be swapped for OpenRouteService if the demo server ever becomes unreliable |
| **Vercel** | Hosting + CI/CD | Push to `main` → auto-deploy. Free tier is plenty because there's no server code |

**Notable absences (by design):** no database, no auth library, no state
management library (React state + one storage module is enough), no chart
library (budget bars are plain CSS/SVG), no component kit (the design system
is hand-built).

---

## Architecture (how the code is organized)

```
app/                    → pages (Next.js App Router)
  page.tsx              → landing
  trips/                → trip list, day-by-day builder, map view
lib/
  types.ts              → the data model (Trip, Stop, Day, RouteCache…)
  storage.ts            → THE only module that touches persistence
  routing.ts            → THE only module that talks to OSRM
design-system/
  MASTER.md             → the design system (tokens, rules, anti-patterns)
design-import/          → Claude Design explorations (kept as process evidence)
```

Three rules hold it together:

1. **One door to storage.** No component reads or writes localStorage
   directly — everything goes through `lib/storage.ts`'s typed helpers
   (`getTrips`, `saveTrip`, `deleteTrip`…). The stored blob is versioned
   (`{ v: 1, ... }`) so a future version can migrate old data instead of
   breaking it. This is also exactly where a cloud-sync layer would plug in.
2. **One door to routing.** OSRM specifics live in `lib/routing.ts`. Routes
   are only fetched when the user asks ("Route this day" button — being a
   good citizen on a free public server) and results are cached inside the
   trip data so re-opening a trip doesn't re-fetch.
3. **The design system is law.** `design-system/MASTER.md` defines every
   color (WCAG-contrast-checked), font, spacing, and interaction rule, plus
   anti-patterns to reject in review. UI code uses semantic tokens
   (`bg-paper`, `text-ink`), never raw hex.

---

## The design story (a great interview answer)

The design went through a real, documented decision process:

1. **v1 — "tropical modern":** clean teal/white, airy, friendly. Shipped
   with M0.
2. **Exploration:** I generated four design directions with Claude Design
   (an AI design tool) — including a retro pixel version and five trip-screen
   concepts. They're kept in `design-import/`.
3. **The catch:** the AI's retro proposal used a pixel font + emerald green —
   which is literally my *first* project's visual identity. Shipping it would
   have made my two portfolio pieces look like one project.
4. **v2 — "vintage travel poster":** I compared two alternative retro
   directions (travel-poster vs "jeepney pop") and chose the poster: cream
   paper, deep-sea ink outlines, sunset coral, mango accents, slab-serif
   display type, hard offset shadows like printed layers. Retro — but *my
   own* retro.
5. **Accessibility save:** the bright coral (#E4572E) failed WCAG contrast
   as a button color (3.6:1 vs required 4.5:1), so buttons use a deepened
   coral (#C2410C, 5.2:1) and the bright coral stays decorative. The design
   is loud AND readable.

**Talking point:** "I used AI to explore directions fast, but the *decisions*
— rejecting the option that clashed with my existing brand, fixing the
contrast failure — were design judgment, not generation."

---

## How it was built (process)

- **Milestones, shipped whole.** M0 foundation → M1 itinerary → M2 map &
  routes → M3 budget → M4 packing → M5 share/polish. Each milestone ends
  deployed and usable — no half-features on `main`.
- **AI-assisted, human-directed.** I build with Claude Code as a pair
  programmer. The division of labor: I own decisions, direction, review, and
  every git push; the AI writes code following two rule files checked into
  the repo (`CLAUDE.md` — standing rules, `PROJECT_BRIEF.md` — locked
  decisions). Rules include: verify against the *installed* framework docs
  (never trust memorized APIs), all persistence through one module, WCAG
  contrast floors, mobile-first always.
- **Mobile-first, verified.** Every screen is built for a 375px phone first
  and checked for horizontal overflow, ≥44px touch targets, and real device
  ergonomics (travelers plan on phones). `npm run build` must pass before
  any push.

---

## Quick Q&A (likely questions, confident answers)

**"Where's the backend?"**
There isn't one — deliberately. It's a local-first app: data lives in the
browser behind a versioned storage module. Sharing works via JSON
export/import. If sync is ever needed, the storage module is the seam where
it plugs in.

**"What happens if I clear my browser data?"**
Your trips go with it — same as clearing any app's data. That's the honest
tradeoff of local-first, and it's why trip export/import (a JSON file you
keep) is a v1 feature, not an afterthought.

**"Why not Google Maps?"**
Cost and openness. MapLibre + OpenStreetMap-based tiles and routing are free,
keyless, and open-source. The swap-friendly design (routing isolated in one
module) means a paid provider could replace OSRM in an afternoon if the
project ever needed SLAs.

**"Is it responsive?"**
It's mobile-*first* — designed at 375px and scaled up, not shrunk down.
Touch targets are 44px minimum per Apple/Material guidelines.

**"What was the hardest part?"**
Discipline, not code: keeping every feature behind the same storage module,
keeping a free-tier routing service happy (user-triggered calls + caching),
and holding the design to WCAG contrast when the "prettier" color failed it.

**"Two projects — why do they look so different?"**
On purpose. The portfolio is a retro pixel game world; Suroy-Suroy is a
vintage travel poster. Two visual languages, two architectures (server-backed
CMS vs local-first), one developer showing range.

---

*Live site: (Vercel URL) · Repo: github.com/Mang-Natty/Suroy-suroy ·
Sibling project: natty-devtravels.vercel.app*
