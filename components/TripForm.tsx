"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CoverColor, CoverIcon, Trip } from "@/lib/types";
import { newId, saveTrip } from "@/lib/storage";
import { dateRange } from "@/lib/dates";
import { COVER_COLORS, COVER_ICONS, CoverIconSvg, TripCover } from "./covers";

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-card px-4 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2";

const labelCls = "mb-1.5 block text-sm font-extrabold text-ink";

export default function TripForm({ trip }: { trip?: Trip }) {
  const router = useRouter();
  const [name, setName] = useState(trip?.name ?? "");
  const [startDate, setStartDate] = useState(trip?.startDate ?? "");
  const [endDate, setEndDate] = useState(trip?.endDate ?? "");
  const [color, setColor] = useState<CoverColor>(trip?.coverColor ?? "mango");
  const [icon, setIcon] = useState<CoverIcon>(trip?.coverIcon ?? "palm");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give the trip a name. Even 'Secret beach run' works.");
      return;
    }
    const days = dateRange(startDate, endDate);
    if (days.length === 0) {
      setError("Check the dates: the end can't be before the start.");
      return;
    }
    const now = new Date().toISOString();
    const saved = saveTrip({
      id: trip?.id ?? newId(),
      name: trimmed,
      startDate,
      endDate,
      coverColor: color,
      coverIcon: icon,
      stopsByDate: trip?.stopsByDate ?? {},
      routesByDate: trip?.routesByDate ?? {},
      createdAt: trip?.createdAt ?? now,
      updatedAt: now,
    });
    router.push(`/trips/${saved.id}`);
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex items-center gap-4">
        <TripCover color={color} icon={icon} size="lg" />
        <p className="text-sm text-muted">
          Your trip&apos;s sticker. Pick a color and a vibe below.
        </p>
      </div>

      <div className="mt-6">
        <label htmlFor="trip-name" className={labelCls}>
          Trip name
        </label>
        <input
          id="trip-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Siargao surf week"
          maxLength={80}
          className={inputCls}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="trip-start" className={labelCls}>
            First day
          </label>
          <input
            id="trip-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="trip-end" className={labelCls}>
            Last day
          </label>
          <input
            id="trip-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={labelCls}>Sticker color</legend>
        <div className="flex flex-wrap gap-2.5">
          {(Object.keys(COVER_COLORS) as CoverColor[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={COVER_COLORS[c].label}
              aria-pressed={color === c}
              className={`h-11 w-11 rounded-full border-2 border-ink ${COVER_COLORS[c].bg} ${
                color === c ? "ring-2 ring-sea ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className={labelCls}>Vibe</legend>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
          {(Object.keys(COVER_ICONS) as CoverIcon[]).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              aria-pressed={icon === i}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-ink bg-card px-1 py-2.5 text-ink ${
                icon === i ? "bg-sea-soft ring-2 ring-sea ring-offset-2" : ""
              }`}
            >
              <CoverIconSvg icon={i} className="h-6 w-6 shrink-0" />
              <span className="text-center text-xs font-extrabold leading-tight">
                {COVER_ICONS[i].label}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-poster-sm"
          style={{ touchAction: "manipulation" }}
        >
          {trip ? "Save changes" : "Create trip"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-ink bg-card px-8 text-base font-extrabold text-ink shadow-poster-sm transition-all duration-150 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
