"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { WishPlace } from "@/lib/types";
import { getWishlist, newId, saveWishlist } from "@/lib/storage";
import { reversePlace, searchPlaces, type GeoResult } from "@/lib/geocode";
import BackLink from "@/components/BackLink";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[45dvh] min-h-72 w-full items-center justify-center rounded-2xl border-2 border-ink bg-sea-soft shadow-poster">
      <Loader label="Unfolding the map…" className="py-0" />
    </div>
  ),
});

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-card px-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2";

export default function WishlistPage() {
  const [wishes, setWishes] = useState<WishPlace[] | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPin, setPendingPin] = useState<{
    lat: number;
    lng: number;
    name?: string;
    busy: boolean;
  } | null>(null);
  const [toDelete, setToDelete] = useState<WishPlace | null>(null);

  useEffect(() => {
    setWishes(getWishlist());
  }, []);

  function update(next: WishPlace[]) {
    saveWishlist(next);
    setWishes(next);
  }

  function addWish(geo: { lat: number; lng: number; name?: string; detail?: string }) {
    const wish: WishPlace = {
      id: newId(),
      name: geo.name?.trim() || "Dropped pin",
      detail: geo.detail?.split(",")[0]?.trim() || undefined,
      lat: geo.lat,
      lng: geo.lng,
      createdAt: new Date().toISOString(),
    };
    update([...(wishes ?? []), wish]);
    setResults(null);
    setQuery("");
    setPendingPin(null);
  }

  async function doSearch() {
    setBusy(true);
    setError(null);
    try {
      const found = await searchPlaces(query);
      setResults(found);
      if (found.length === 0) setError("Nothing found. Try the spot plus its town.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
      setResults(null);
    } finally {
      setBusy(false);
    }
  }

  function onMapTap(lat: number, lng: number) {
    setPendingPin({ lat, lng, busy: true });
    reversePlace(lat, lng)
      .then((r) =>
        setPendingPin((p) =>
          p && p.lat === lat
            ? { ...p, busy: false, name: r?.name, }
            : p,
        ),
      )
      .catch(() =>
        setPendingPin((p) => (p && p.lat === lat ? { ...p, busy: false } : p)),
      );
  }

  if (wishes === null)
    return (
      <main className="flex flex-1 items-center justify-center">
        <Loader />
      </main>
    );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href="/trips" label="Your trips" />
      <h1 className="mt-3 font-display text-3xl text-ink">DREAM SPOTS</h1>
      <p className="mt-2 text-base text-body">
        Places you&apos;ll suroy someday. No dates, no pressure, just pins.
      </p>

      <section className="mt-5 rounded-2xl border-2 border-ink bg-card p-4 shadow-poster">
        <label htmlFor="wish-finder" className="mb-1.5 block text-sm font-extrabold text-ink">
          Find a dream spot
        </label>
        <div className="flex gap-2">
          <input
            id="wish-finder"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doSearch();
              }
            }}
            placeholder="Batanes, Kalanggaman, Siquijor…"
            className={inputCls}
          />
          <button
            type="button"
            onClick={doSearch}
            disabled={busy || !query.trim()}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sea px-5 text-sm font-extrabold text-card hover:bg-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-40"
          >
            {busy ? "…" : "Search"}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm font-semibold text-danger">
            {error}
          </p>
        )}
        {results && results.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {results.map((r, i) => (
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
                  onClick={() => addWish(r)}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-4 text-sm font-extrabold text-card shadow-poster-sm hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-4">
        <TripMap
          stops={wishes.map((w, i) => ({
            id: w.id,
            title: w.name,
            lat: w.lat,
            lng: w.lng,
            index: i + 1,
          }))}
          pending={pendingPin}
          onMapClick={onMapTap}
        />
        <p className="mt-2 text-xs text-muted">
          Tip: tap anywhere on the map to pin a dream spot.
        </p>
      </div>

      {pendingPin && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink bg-sand p-4 shadow-poster-sm">
          <p className="min-w-0 flex-1 text-sm font-extrabold text-ink">
            {pendingPin.busy
              ? "Finding out what's here…"
              : pendingPin.name
                ? `Pin ${pendingPin.name} as a dream spot?`
                : "Pin this as a dream spot?"}
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() =>
                addWish({
                  lat: pendingPin.lat,
                  lng: pendingPin.lng,
                  name: pendingPin.name,
                })
              }
              disabled={pendingPin.busy}
              className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-5 text-sm font-extrabold text-card shadow-poster-sm hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-40"
            >
              Pin it
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

      <section className="mt-6">
        <h2 className="mb-3 text-base font-extrabold text-ink">
          {wishes.length === 0 ? "" : `${wishes.length} dream ${wishes.length === 1 ? "spot" : "spots"}`}
        </h2>
        {wishes.length === 0 ? (
          <p className="text-sm text-muted">
            Walang laman pa ang bucket list. Search a place or tap the map.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {wishes.map((w, i) => (
              <li key={w.id} className="flex items-center gap-3 rounded-xl border-2 border-ink bg-card p-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mango text-sm font-extrabold text-ink"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-ink">{w.name}</p>
                  {w.detail && <p className="truncate text-xs text-muted">{w.detail}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setToDelete(w)}
                  aria-label={`Remove ${w.name} from wishlist`}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-danger bg-card text-danger transition-colors hover:bg-danger hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={toDelete !== null}
        title="Remove this dream spot?"
        body={toDelete ? `${toDelete.name} leaves the bucket list. Dreams can always be re-pinned.` : ""}
        confirmLabel="Remove"
        danger
        onConfirm={() => {
          if (toDelete) update(wishes.filter((w) => w.id !== toDelete.id));
          setToDelete(null);
        }}
        onClose={() => setToDelete(null)}
      />
    </main>
  );
}
