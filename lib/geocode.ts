/**
 * THE only module that talks to the geocoder.
 * Photon (photon.komoot.io) — komoot's free OSM geocoder, no key, great at
 * POIs (cafés, inns, waterfalls, dive spots), typo-tolerant. Fair use:
 * calls are user-triggered only (explicit Search button, never on keystroke).
 * Results are biased toward the Philippines and filtered to PH.
 */

export type GeoResult = {
  /** "Wander Cafe Moalboal" */
  name: string;
  /** "Moalboal, Cebu" */
  detail: string;
  /** "cafe", "guest house", "waterfall"… best-effort category */
  kind?: string;
  lat: number;
  lng: number;
};

type PhotonFeature = {
  properties: {
    name?: string;
    street?: string;
    locality?: string;
    city?: string;
    state?: string;
    countrycode?: string;
    osm_value?: string;
    osm_key?: string;
  };
  geometry: { coordinates: [number, number] };
};

// Rough center of the Philippines — biases ranking, not a hard filter
const PH_BIAS = { lat: 12.5, lon: 122.5 };

const SKIP_KINDS = new Set(["yes", "house"]);

function toResult(f: PhotonFeature): GeoResult {
  const p = f.properties;
  const name = p.name ?? p.street ?? p.locality ?? p.city ?? "Unnamed spot";
  const detail = [p.city ?? p.locality, p.state]
    .filter((x): x is string => !!x && x !== name)
    .join(", ");
  const kind =
    p.osm_value && !SKIP_KINDS.has(p.osm_value)
      ? p.osm_value.replaceAll("_", " ")
      : undefined;
  return {
    name,
    detail,
    kind,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  };
}

export async function searchPlaces(query: string): Promise<GeoResult[]> {
  const q = query.trim();
  if (!q) return [];
  const url =
    `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}` +
    `&limit=8&lat=${PH_BIAS.lat}&lon=${PH_BIAS.lon}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Search failed (${res.status}). Try again.`);
  const data = (await res.json()) as { features?: PhotonFeature[] };

  return (data.features ?? [])
    .filter((f) => f.properties.countrycode === "PH" && f.properties.name)
    .slice(0, 6)
    .map(toResult);
}

/** Nearest named place for a tapped map point ("drop a pin"). Keeps the
    pin's exact coordinates — only borrows a human-readable name. */
export async function reversePlace(
  lat: number,
  lng: number,
): Promise<GeoResult | null> {
  const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const data = (await res.json()) as { features?: PhotonFeature[] };
  const f = data.features?.[0];
  if (!f) return null;
  return { ...toResult(f), lat, lng };
}
