"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { PackingItem, Trip } from "@/lib/types";
import { getTrip, newId, saveTrip } from "@/lib/storage";
import BackLink from "@/components/BackLink";
import Loader from "@/components/Loader";

const TEMPLATES: Record<string, string[]> = {
  Beach: [
    "Swimwear",
    "Rash guard",
    "Aqua shoes",
    "Sunscreen (reef-safe)",
    "Dry bag",
    "Snorkel set",
    "Flip-flops",
    "Quick-dry towel",
  ],
  Hike: [
    "Trail shoes",
    "Rain jacket",
    "Headlamp",
    "Water bottle 1L",
    "Trail snacks",
    "First aid kit",
    "Insect repellent",
    "Trekking pole",
  ],
  City: [
    "Comfy walking shoes",
    "Power bank",
    "Umbrella",
    "Reusable water bottle",
    "Day bag",
    "Beep card / fare app",
  ],
  Essentials: [
    "Valid ID",
    "Cash (small bills)",
    "Phone charger",
    "Meds",
    "Extra clothes",
    "Toiletries",
  ],
};

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-card px-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2";

export default function PackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    setTrip(getTrip(id) ?? null);
  }, [id]);

  if (trip === undefined)
    return (
      <main className="flex flex-1 items-center justify-center">
        <Loader />
      </main>
    );

  if (trip === null) {
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

  const items = trip.packing ?? [];
  const done = items.filter((i) => i.done).length;
  const pct = items.length > 0 ? done / items.length : 0;

  function update(nextItems: PackingItem[]) {
    if (!trip) return;
    setTrip(saveTrip({ ...trip, packing: nextItems }));
  }

  function addTemplate(name: string) {
    const existing = new Set(items.map((i) => i.label.toLowerCase()));
    const fresh = TEMPLATES[name]
      .filter((label) => !existing.has(label.toLowerCase()))
      .map((label) => ({ id: newId(), label, done: false }));
    if (fresh.length > 0) update([...items, ...fresh]);
  }

  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const label = custom.trim();
    if (!label) return;
    if (items.some((i) => i.label.toLowerCase() === label.toLowerCase())) {
      setCustom("");
      return;
    }
    update([...items, { id: newId(), label, done: false }]);
    setCustom("");
  }

  function toggle(itemId: string) {
    update(items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)));
  }

  function remove(itemId: string) {
    update(items.filter((i) => i.id !== itemId));
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href={`/trips/${trip.id}`} label={trip.name} />
      <h1 className="mt-3 font-display text-3xl text-ink">PACKING LIST</h1>

      <section className="mt-5 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-extrabold text-ink">
            {items.length === 0
              ? "Empty bag. Start with a template:"
              : done === items.length
                ? "Packed na tanan! Safe travels."
                : `${done} of ${items.length} packed`}
          </p>
          {items.length > 0 && (
            <p className="text-sm tabular-nums text-muted">{Math.round(pct * 100)}%</p>
          )}
        </div>
        {items.length > 0 && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={items.length}
            aria-valuenow={done}
            aria-label="Packing progress"
            className="mt-3 h-5 overflow-hidden rounded-full border-2 border-ink bg-paper"
          >
            <div
              className={`h-full transition-[width] duration-300 ${pct === 1 ? "bg-sea" : "bg-mango"}`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(TEMPLATES).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addTemplate(name)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-ink bg-sea-soft px-4 text-sm font-extrabold text-ink hover:bg-sea hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {name}
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={addCustom} className="mt-5 flex gap-2">
        <label htmlFor="custom-item" className="sr-only">
          Add your own item
        </label>
        <input
          id="custom-item"
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="GoPro, malong, chessboard…"
          maxLength={80}
          className={inputCls}
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-5 text-sm font-extrabold text-card shadow-poster-sm hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Add
        </button>
      </form>

      {items.length > 0 && (
        <ul className="mt-5 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 rounded-xl border-2 border-ink bg-card p-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={item.done}
                aria-label={item.label}
                onClick={() => toggle(item.id)}
                className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-ink ${
                    item.done ? "bg-sea text-card" : "bg-paper"
                  }`}
                >
                  {item.done && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-base ${item.done ? "text-muted line-through" : "font-semibold text-ink"}`}
                >
                  {item.label}
                </span>
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.label}`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-card text-muted transition-colors hover:border-danger hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
