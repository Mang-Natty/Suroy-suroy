import type { DayRoute, RouteProfile, Stop } from "./types";

/**
 * THE only module that talks to routing servers (hard rule — CLAUDE.md).
 * Free public servers, used politely: calls are user-triggered only
 * ("Route this day" button) and results are cached in trip data.
 * Swap for OpenRouteService here if these ever become unreliable.
 */

const BASES: Record<RouteProfile, string> = {
  // OSRM demo — hosts the car profile
  driving: "https://router.project-osrm.org/route/v1/driving",
  // FOSSGIS/OSM Germany demo — real foot profile (OSRM demo aliases
  // everything to car, so "walking" there would lie)
  walking: "https://routing.openstreetmap.de/routed-foot/route/v1/driving",
};

type OsrmResponse = {
  code: string;
  routes?: {
    distance: number;
    duration: number;
    geometry: { coordinates: [number, number][] };
    legs: { distance: number; duration: number }[];
  }[];
};

export type RoutableStop = Stop & { lat: number; lng: number };

export function routableStops(stops: Stop[]): RoutableStop[] {
  return stops.filter(
    (s): s is RoutableStop => typeof s.lat === "number" && typeof s.lng === "number",
  );
}

/** Fingerprint of what the route depends on — used to detect stale caches. */
export function stopKey(stops: RoutableStop[], profile: RouteProfile): string {
  return `${profile}|${stops.map((s) => `${s.lng.toFixed(5)},${s.lat.toFixed(5)}`).join(";")}`;
}

export async function routeDay(
  stops: RoutableStop[],
  profile: RouteProfile,
): Promise<DayRoute> {
  if (stops.length < 2) {
    throw new Error("Need at least 2 located stops to route a day.");
  }
  const coords = stops.map((s) => `${s.lng},${s.lat}`).join(";");
  const url = `${BASES[profile]}/${coords}?overview=full&geometries=geojson&steps=false`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Routing server said ${res.status}. Try again in a bit.`);
  }
  const data = (await res.json()) as OsrmResponse;
  const route = data.routes?.[0];
  if (data.code !== "Ok" || !route) {
    throw new Error("No route found between these stops.");
  }

  return {
    profile,
    distanceM: route.distance,
    durationS: route.duration,
    legs: route.legs.map((l) => ({ distanceM: l.distance, durationS: l.duration })),
    geometry: route.geometry.coordinates,
    stopKey: stopKey(stops, profile),
    fetchedAt: new Date().toISOString(),
  };
}

export function formatDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

export function formatDuration(s: number): string {
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `${h} h` : `${h} h ${rem} min`;
}
