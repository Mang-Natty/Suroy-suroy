export type Stop = {
  id: string;
  title: string;
  note?: string;
  /** Optional "HH:MM" 24h time */
  time?: string;
  /** Set once the stop is geocoded via place search (M2) */
  lat?: number;
  lng?: number;
  placeName?: string;
};

export type RouteLeg = {
  distanceM: number;
  durationS: number;
};

export type RouteProfile = "driving" | "walking";

export type DayRoute = {
  profile: RouteProfile;
  distanceM: number;
  durationS: number;
  /** One leg per consecutive pair of routed stops */
  legs: RouteLeg[];
  /** [lng, lat] polyline from OSRM GeoJSON geometry */
  geometry: [number, number][];
  /** Fingerprint of the stop coordinates the route was computed for —
      lets us detect a stale cache after stops change */
  stopKey: string;
  fetchedAt: string;
};

export type CoverColor = "mango" | "coral" | "sea" | "sand" | "sea-soft";

export type CoverIcon =
  | "palm"
  | "boat"
  | "mountain"
  | "city"
  | "food"
  | "camera"
  | "backpack"
  | "plane";

export type ExpenseCategory =
  | "food"
  | "transpo"
  | "lodging"
  | "activities"
  | "pasalubong";

export type Expense = {
  id: string;
  category: ExpenseCategory;
  /** Whole pesos */
  amount: number;
  note?: string;
  createdAt: string;
};

export type PackingItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Trip = {
  id: string;
  name: string;
  /** "YYYY-MM-DD" inclusive range; the day list is derived from it */
  startDate: string;
  endDate: string;
  coverColor: CoverColor;
  coverIcon: CoverIcon;
  /** Stops keyed by "YYYY-MM-DD". Dates outside the current range are kept
      (not deleted) so shrinking then re-growing a range loses nothing. */
  stopsByDate: Record<string, Stop[]>;
  /** Cached OSRM results keyed by "YYYY-MM-DD" (M2) */
  routesByDate: Record<string, DayRoute>;
  /** M3 — whole-peso trip fund; optional so pre-M3 stored trips stay valid */
  budgetTotal?: number;
  expenses?: Expense[];
  /** M4 — optional for the same backward-compat reason */
  packing?: PackingItem[];
  createdAt: string;
  updatedAt: string;
};

/** The single versioned blob persisted by lib/storage.ts */
export type StorageSchema = {
  v: 1;
  trips: Trip[];
};
