@AGENTS.md

# Project: Suroy-Suroy — light travel planner

**Read `PROJECT_BRIEF.md` first** — it holds the vision, all locked product
decisions, and the M0–M5 milestone plan. This file is the standing rules.

## What this is

A local-first, Philippines-first travel planner (day-by-day itinerary, map with
OSRM routes, ₱ budget, packing lists). No backend, no auth, no signup — all data
in the visitor's browser. Second portfolio project of Nathaniel (nattydev);
sibling of https://natty-devtravels.vercel.app (repo: Mang-Natty on GitHub).

## Hard rules

- **Local-first is an architecture, not a phase.** ALL persistence goes through
  `lib/storage.ts` (versioned schema, typed helpers). No component touches
  localStorage directly. No Supabase/servers/auth in v1 — decline nicely and
  point at the brief's M6+.
- **Don't trust training data for framework APIs.** Check installed versions and
  read `node_modules/next/dist/docs/` before writing Next-specific code. (The
  portfolio project got burned by Next 16 renames; assume this repo's versions
  differ from your memory too.)
- **External services** (all free, all fair-use — be a good citizen):
  - CARTO Voyager tiles: `https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png` — keep the OSM + CARTO attribution visible.
  - Nominatim search: user-triggered only, never on keystroke without debounce.
  - OSRM demo routing: user-triggered ("Route this day" button), cache results in
    trip data, isolate in `lib/routing.ts` (swappable for OpenRouteService).
- **Design system:** generated in M0 via the `ui-ux-pro-max` skill into
  `design-system/MASTER.md` — consult it before building UI. Tropical/fresh
  modern, NOT the portfolio's retro pixel style. **Light-only** in v1;
  **mobile-first** always (build for ~375px, enhance upward).
- **Verify:** `npm run build` must pass before handing anything over for a push.

## Pinned versions & gotchas (verified 2026-07 against node_modules)

- **next 16.2.10 · react 19.2.4 · tailwindcss 4.3.2 · typescript 5.9.3 · Node 22**.
- Docs live in `node_modules/next/dist/docs/01-app/` — read before Next-specific code.
- `params`/`searchParams` are **Promises** (`await params`); middleware is renamed
  **proxy** (`proxy.ts`), same as the portfolio's Next 16.
- Metadata: export a static `Metadata` object from `layout.tsx`/`page.tsx`
  (Server Components only). Charset + responsive viewport meta are automatic.
- Fonts: `next/font/google`, expose as CSS variable, map into Tailwind via
  `@theme` in `globals.css` (Tailwind v4 = CSS-based config, no tailwind.config).
- Light-only: the scaffold's `prefers-color-scheme: dark` block in `globals.css`
  was removed deliberately — do not re-add without a real dark theme.

## Working style (same contract as the portfolio)

The owner is a beginner — **teach the why while building**. **Hand him git and
deploy commands; never run git/deploy yourself.** Interview him (AskUserQuestion)
before big or ambiguous builds. End milestone sessions with a recap + what's next.
Deploy = he pushes to `main`, Vercel auto-deploys.
