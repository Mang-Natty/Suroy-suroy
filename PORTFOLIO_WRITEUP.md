# Portfolio entry for Suroy-Suroy

> Copy-paste material for natty-devtravels.vercel.app/admin/projects.
> Adjust freely; it's your voice that ships.

## Title

Suroy-Suroy

## Short tagline (for the project card)

A light, local-first travel planner for Philippine adventures. No signup,
no server: your whole trip lives in your browser.

## Tags

Next.js · TypeScript · Tailwind v4 · MapLibre GL · Local-first · OpenStreetMap

## Links

- Live: (your Vercel URL)
- Repo: https://github.com/Mang-Natty/Suroy-suroy

## Long write-up (for the project detail page)

Suroy-suroy is Cebuano for wandering around just for the joy of it. This app
plans that kind of trip: day-by-day itineraries, stops pinned on a real map,
driving and walking routes with distance and time, a budget tracked in pesos,
and packing checklists. It is Philippines-first in its data, its copy, and
its personality.

The defining decision is that there is no backend. All data lives in the
visitor's browser behind a single versioned storage module, so the app is
usable ten seconds after you hear about it: no account, no signup wall, and
no database that can leak your plans. Sharing and backup work the local-first
way, through JSON export and import. The storage module is the seam where a
future sync layer could plug in without touching a single component.

The map stack is fully open: MapLibre GL for rendering, CARTO Voyager tiles,
Photon (komoot's geocoder) for finding cafés, inns, waterfalls, and dive
shops, and OSRM for routing. Every external call is user-triggered and
cached, out of respect for free public infrastructure. Routing is isolated in
one module, which paid off immediately: the walking profile points at a
different server than driving because the OSRM demo quietly routes everything
as a car.

The design is a vintage Philippine travel poster: cream paper, deep-sea ink
outlines, sunset coral, mango accents, slab-serif display type, and hard
offset shadows like printed layers. It was chosen deliberately over an
AI-proposed pixel-retro direction that would have twinned this project with
my first portfolio piece. Every color pairing passes WCAG AA contrast, all
touch targets are at least 44px, and the whole app is built mobile-first at
375px, because travelers plan on phones.

Built milestone by milestone (foundation, itinerary, map and routes, budget,
packing, wishlist and export), each shipped whole and deployed before the
next began. My first project is a server-backed CMS world; this one is
local-first and serverless. Two architectures, two visual languages, one
developer.

## Suggested cover screenshot

The trip plan page (day-by-day with sticker covers) or the map page with a
drawn route. Take it at phone width for the authentic mobile-first look, or
desktop if the portfolio card crops wide.
