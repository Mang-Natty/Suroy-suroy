"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { RouteProfile, Stop, Trip } from "@/lib/types";
import { getTrip, newId, saveTrip } from "@/lib/storage";
import { dateRange, formatDay } from "@/lib/dates";
import { reversePlace, searchPlaces, type GeoResult } from "@/lib/geocode";
import {
  formatDistance,
  formatDuration,
  routableStops,
  routeDay,
  stopKey,
} from "@/lib/routing";
import type { MapStop } from "@/components/TripMap";
import BackLink from "@/components/BackLink";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[45dvh] min-h-72 w-full items-center justify-center rounded-2xl border-2 border-ink bg-sea-soft text-sm font-extrabold text-ink shadow-poster">
      Loading the map…
    </div>
  ),
});

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-card px-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2";

export default function TripMapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [locatingId, setLocatingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [profile, setProfile] = useState<RouteProfile>("driving");
  const [routing, setRouting] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [finderQuery, setFinderQuery] = useState("");
  const [finderResults, setFinderResults] = useState<GeoResult[] | null>(null);
  const [finderBusy, setFinderBusy] = useState(false);
  const [finderError, setFinderError] = useState<string | null>(null);
  const [pendingPin, setPendingPin] = useState<{
    lat: number;
    lng: number;
    name?: string;
    busy: boolean;
  } | null>(null);

  useEffect(() => {
    const t = getTrip(id) ?? null;
    setTrip(t);
    if (t) setSelectedDate(dateRange(t.startDate, t.endDate)[0] ?? null);
  }, [id]);

  const days = useMemo(
    () => (trip ? dateRange(trip.startDate, trip.endDate) : []),
    [trip],
  );

  if (trip === undefined) return null;
  if (trip === null || !selectedDate) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl text-ink">Trip not found</h1>
        <Link
          href="/trips"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster hover:bg-coral-press"
        >
          Back to your trips
        </Link>
      </main>
    );
  }

  const stops = trip.stopsByDate[selectedDate] ?? [];
  const located = routableStops(stops);
  const cached = trip.routesByDate[selectedDate];
  const cacheKey = stopKey(located, cached?.profile ?? profile);
  const cacheStale = !!cached && cached.stopKey !== cacheKey;

  const mapStops: MapStop[] = located.map((s, i) => ({
    id: s.id,
    title: s.title,
    lat: s.lat,
    lng: s.lng,
    index: i + 1,
  }));

  function update(next: Trip) {
    setTrip(saveTrip(next));
  }

  function openLocator(stopId: string) {
    setLocatingId(stopId);
    const stop = stops.find((s) => s.id === stopId);
    setQuery(stop?.placeName ?? stop?.title ?? "");
    setResults(null);
    setSearchError(null);
  }

  async function doSearch() {
    setSearching(true);
    setSearchError(null);
    try {
      const found = await searchPlaces(query);
      setResults(found);
      if (found.length === 0) {
        setSearchError("Nothing found — try the town or landmark name.");
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed.");
      setResults(null);
    } finally {
      setSearching(false);
    }
  }

  function pickPlace(geo: GeoResult) {
    if (!locatingId || !trip || !selectedDate) return;
    const nextStops = stops.map((s) =>
      s.id === locatingId
        ? {
            ...s,
            lat: geo.lat,
            lng: geo.lng,
            placeName: [geo.name, geo.detail.split(",")[0]]
              .filter(Boolean)
              .join(", "),
          }
        : s,
    );
    update({
      ...trip,
      stopsByDate: { ...trip.stopsByDate, [selectedDate]: nextStops },
    });
    setLocatingId(null);
    setResults(null);
  }

  function addStopHere(geo: {
    lat: number;
    lng: number;
    name?: string;
    detail?: string;
  }) {
    if (!trip || !selectedDate) return;
    const placeName = [geo.name?.trim(), geo.detail?.split(",")[0]?.trim()]
      .filter(Boolean)
      .join(", ");
    const stop: Stop = {
      id: newId(),
      title: geo.name ?? "Dropped pin",
      lat: geo.lat,
      lng: geo.lng,
      placeName: placeName || undefined,
    };
    update({
      ...trip,
      stopsByDate: {
        ...trip.stopsByDate,
        [selectedDate]: [...(trip.stopsByDate[selectedDate] ?? []), stop],
      },
    });
    setFinderResults(null);
    setFinderQuery("");
    setPendingPin(null);
  }

  async function doFinderSearch() {
    setFinderBusy(true);
    setFinderError(null);
    try {
      const found = await searchPlaces(finderQuery);
      setFinderResults(found);
      if (found.length === 0) {
        setFinderError("Nothing found — try the spot plus its town.");
      }
    } catch (err) {
      setFinderError(err instanceof Error ? err.message : "Search failed.");
      setFinderResults(null);
    } finally {
      setFinderBusy(false);
    }
  }

  function onMapTap(lat: number, lng: number) {
    setPendingPin({ lat, lng, busy: true });
    reversePlace(lat, lng)
      .then((r) =>
        setPendingPin((p) =>
          p && p.lat === lat
            ? {
                ...p,
                busy: false,
                name: r
                  ? [r.name, r.detail.split(",")[0]].filter(Boolean).join(", ")
                  : undefined,
              }
            : p,
        ),
      )
      .catch(() =>
        setPendingPin((p) => (p && p.lat === lat ? { ...p, busy: false } : p)),
      );
  }

  async function doRoute() {
    if (!trip || !selectedDate) return;
    setRouting(true);
    setRouteError(null);
    try {
      const route = await routeDay(located, profile);
      update({
        ...trip,
        routesByDate: { ...trip.routesByDate, [selectedDate]: route },
      });
    } catch (err) {
      setRouteError(err instanceof Error ? err.message : "Routing failed.");
    } finally {
      setRouting(false);
    }
  }

  const dayIndex = days.indexOf(selectedDate);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href={`/trips/${trip.id}`} label={trip.name} />
      <h1 className="mt-3 font-display text-3xl text-ink">MAP & ROUTES</h1>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Trip days">
        {days.map((date, i) => (
          <button
            key={date}
            type="button"
            role="tab"
            aria-selected={date === selectedDate}
            onClick={() => {
              setSelectedDate(date);
              setLocatingId(null);
              setResults(null);
              setRouteError(null);
              setFinderResults(null);
              setFinderError(null);
              setPendingPin(null);
            }}
            className={`inline-flex h-11 shrink-0 items-center rounded-full border-2 border-ink px-4 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
              date === selectedDate
                ? "bg-ink text-card"
                : "bg-card text-ink hover:bg-sand"
            }`}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      <p className="mb-3 mt-1 text-sm font-extrabold text-ink">
        Day {dayIndex + 1} · {formatDay(selectedDate)}
      </p>

      <section className="mb-4 rounded-2xl border-2 border-ink bg-card p-4 shadow-poster">
        <label htmlFor="spot-finder" className="mb-1.5 block text-sm font-extrabold text-ink">
          Find a spot & add it to this day
        </label>
        <div className="flex gap-2">
          <input
            id="spot-finder"
            type="search"
            value={finderQuery}
            onChange={(e) => setFinderQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doFinderSearch();
              }
            }}
            placeholder="Cafés, inns, falls, dive shops…"
            className={inputCls}
          />
          <button
            type="button"
            onClick={doFinderSearch}
            disabled={finderBusy || !finderQuery.trim()}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sea px-5 text-sm font-extrabold text-card hover:bg-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-40"
          >
            {finderBusy ? "…" : "Search"}
          </button>
        </div>
        {finderError && (
          <p role="alert" className="mt-2 text-sm font-semibold text-danger">
            {finderError}
          </p>
        )}
        {finderResults && finderResults.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {finderResults.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="min-w-0 flex-1 rounded-lg border-2 border-ink bg-paper px-3 py-2">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="truncate text-sm font-extrabold text-ink">{r.name}</span>
                    {r.kind && (
                      <span className="rounded-full border border-ink bg-sea-soft px-2 py-0.5 text-xs font-semibold text-ink">
                        {r.kind}
                      </span>
                    )}
                  </span>
                  {r.detail && (
                    <span className="block truncate text-xs text-muted">{r.detail}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addStopHere(r)}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-4 text-sm font-extrabold text-card shadow-poster-sm hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <TripMap
        stops={mapStops}
        route={cached && !cacheStale ? cached.geometry : undefined}
        pending={pendingPin}
        onMapClick={onMapTap}
      />
      <p className="mt-2 text-xs text-muted">
        Tip: tap anywhere on the map to drop a pin.
      </p>

      {pendingPin && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink bg-sand p-4 shadow-poster-sm">
          <p className="min-w-0 flex-1 text-sm font-extrabold text-ink">
            {pendingPin.busy
              ? "Finding out what's here…"
              : pendingPin.name
                ? `Add a stop at ${pendingPin.name}?`
                : "Add a stop at this pin?"}
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() =>
                addStopHere({
                  lat: pendingPin.lat,
                  lng: pendingPin.lng,
                  name: pendingPin.name?.split(",")[0],
                  detail: pendingPin.name?.split(",").slice(1).join(","),
                })
              }
              disabled={pendingPin.busy}
              className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-5 text-sm font-extrabold text-card shadow-poster-sm hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-40"
            >
              Add stop
            </button>
            <button
              type="button"
              onClick={() => setPendingPin(null)}
              className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-card px-5 text-sm font-extrabold text-ink hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <section className="mt-5 rounded-2xl border-2 border-ink bg-card p-4 shadow-poster-sea">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 rounded-full border-2 border-ink bg-paper p-1" role="group" aria-label="Route profile">
            {(["driving", "walking"] as RouteProfile[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={profile === p}
                onClick={() => setProfile(p)}
                className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                  profile === p ? "bg-ink text-card" : "text-ink hover:bg-sand"
                }`}
              >
                {p === "driving" ? "Drive" : "Walk"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={doRoute}
            disabled={located.length < 2 || routing}
            className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-6 text-sm font-extrabold text-card shadow-poster-sm transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40"
            style={{ touchAction: "manipulation" }}
          >
            {routing ? "Routing…" : "Route this day"}
          </button>
        </div>

        {located.length < 2 && (
          <p className="mt-3 text-sm text-muted">
            Pin at least 2 stops below and the route button wakes up.
          </p>
        )}
        {cacheStale && (
          <p className="mt-3 text-sm font-semibold text-sun-ink">
            Stops changed since this route was drawn — hit “Route this day”
            to refresh it.
          </p>
        )}
        {routeError && (
          <p role="alert" className="mt-3 text-sm font-semibold text-danger">
            {routeError}
          </p>
        )}
        {cached && !cacheStale && (
          <div className="mt-3 border-t-2 border-line pt-3">
            <p className="text-base font-extrabold text-ink">
              {cached.profile === "driving" ? "Drive" : "Walk"} ·{" "}
              <span className="tabular-nums">{formatDistance(cached.distanceM)}</span> ·{" "}
              <span className="tabular-nums">{formatDuration(cached.durationS)}</span>
            </p>
            {cached.legs.length > 1 && (
              <ol className="mt-2 space-y-1">
                {cached.legs.map((leg, i) => (
                  <li key={i} className="text-sm tabular-nums text-body">
                    {i + 1} → {i + 2}: {formatDistance(leg.distanceM)} ·{" "}
                    {formatDuration(leg.durationS)}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-extrabold text-ink">
          Stops on this day
        </h2>
        {stops.length === 0 ? (
          <p className="text-sm text-muted">
            No stops yet —{" "}
            <Link
              href={`/trips/${trip.id}`}
              className="font-extrabold text-sea underline-offset-4 hover:underline"
            >
              add some in the plan
            </Link>{" "}
            first.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {stops.map((stop) => {
              const locIndex = located.findIndex((s) => s.id === stop.id);
              return (
                <li key={stop.id} className="rounded-xl border-2 border-ink bg-card p-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm font-extrabold ${
                        locIndex !== -1 ? "bg-mango text-ink" : "bg-paper text-muted"
                      }`}
                    >
                      {locIndex !== -1 ? locIndex + 1 : "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold text-ink">{stop.title}</p>
                      <p className="truncate text-xs text-muted">
                        {stop.placeName ?? "Not on the map yet"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        locatingId === stop.id
                          ? setLocatingId(null)
                          : openLocator(stop.id)
                      }
                      className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-sea-soft px-4 text-sm font-extrabold text-ink hover:bg-sea hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                    >
                      {stop.lat !== undefined ? "Move pin" : "Set location"}
                    </button>
                  </div>

                  {locatingId === stop.id && (
                    <div className="mt-3 rounded-xl border-2 border-ink bg-sand p-3">
                      <label
                        htmlFor="place-search"
                        className="mb-1.5 block text-sm font-extrabold text-ink"
                      >
                        Search a spot — cafés, inns, falls, dive shops…
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="place-search"
                          type="search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              doSearch();
                            }
                          }}
                          placeholder="Wander Cafe Moalboal"
                          className={inputCls}
                        />
                        <button
                          type="button"
                          onClick={doSearch}
                          disabled={searching || !query.trim()}
                          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sea px-5 text-sm font-extrabold text-card hover:bg-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-40"
                        >
                          {searching ? "…" : "Search"}
                        </button>
                      </div>
                      {searchError && (
                        <p role="alert" className="mt-2 text-sm font-semibold text-danger">
                          {searchError}
                        </p>
                      )}
                      {results && results.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {results.map((r, i) => (
                            <li key={i}>
                              <button
                                type="button"
                                onClick={() => pickPlace(r)}
                                className="w-full rounded-lg border-2 border-ink bg-card px-3 py-2.5 text-left hover:bg-sea-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                              >
                                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="text-sm font-extrabold text-ink">
                                    {r.name}
                                  </span>
                                  {r.kind && (
                                    <span className="rounded-full border border-ink bg-sea-soft px-2 py-0.5 text-xs font-semibold text-ink">
                                      {r.kind}
                                    </span>
                                  )}
                                </span>
                                {r.detail && (
                                  <span className="mt-0.5 block text-xs text-muted">
                                    {r.detail}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted">
          Map data © OpenStreetMap contributors · tiles © CARTO · search by
          Photon (komoot) · routing by OSRM / FOSSGIS demo servers — searches
          and routes run only when you ask, and routes are cached with the
          trip.
        </p>
      </section>
    </main>
  );
}
