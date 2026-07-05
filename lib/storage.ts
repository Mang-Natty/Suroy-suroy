import type { StorageSchema, Trip } from "./types";

/**
 * THE only module that touches persistence (hard rule — see CLAUDE.md).
 * localStorage today; the versioned schema means a future migration or a
 * sync layer plugs in here without touching any component.
 */

const KEY = "suroy-suroy:data";

const EMPTY: StorageSchema = { v: 1, trips: [] };

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function load(): StorageSchema {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as { v?: number };
    // Future schema versions migrate here (v1 -> v2 -> ...), never in components.
    if (parsed.v === 1) return parsed as StorageSchema;
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(data: StorageSchema): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getTrips(): Trip[] {
  return load().trips;
}

export function getTrip(id: string): Trip | undefined {
  return load().trips.find((t) => t.id === id);
}

/** Insert or update; stamps updatedAt. Returns the saved trip. */
export function saveTrip(trip: Trip): Trip {
  const data = load();
  const stamped: Trip = { ...trip, updatedAt: new Date().toISOString() };
  const i = data.trips.findIndex((t) => t.id === trip.id);
  if (i === -1) data.trips.push(stamped);
  else data.trips[i] = stamped;
  persist(data);
  return stamped;
}

export function deleteTrip(id: string): void {
  const data = load();
  data.trips = data.trips.filter((t) => t.id !== id);
  persist(data);
}

/** M5 export/import will serialize single trips through here too, so the
    file format stays in the storage module's control. */
export function exportData(): string {
  return JSON.stringify(load(), null, 2);
}
