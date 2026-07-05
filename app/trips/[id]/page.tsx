"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { Stop, Trip } from "@/lib/types";
import { getTrip, saveTrip } from "@/lib/storage";
import { dateRange, formatDay, formatRange } from "@/lib/dates";
import { TripCover } from "@/components/covers";
import DayStops from "@/components/DayStops";
import BackLink from "@/components/BackLink";
import Loader from "@/components/Loader";

export default function TripPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  useEffect(() => {
    setTrip(getTrip(id) ?? null);
  }, [id]);

  function updateDay(date: string, stops: Stop[]) {
    if (!trip) return;
    const next: Trip = {
      ...trip,
      stopsByDate: { ...trip.stopsByDate, [date]: stops },
    };
    setTrip(saveTrip(next));
  }

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
        <p className="mt-3 text-body">
          This trip isn&apos;t on this device. Plans live in the browser they
          were made in.
        </p>
        <Link
          href="/trips"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster hover:bg-coral-press"
        >
          Back to your trips
        </Link>
      </main>
    );
  }

  const days = dateRange(trip.startDate, trip.endDate);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href="/trips" label="Your trips" />

      <header className="mt-4 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster">
        <div className="flex items-center gap-4">
          <TripCover color={trip.coverColor} icon={trip.coverIcon} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="break-words font-display text-2xl text-ink sm:text-3xl">
              {trip.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {formatRange(trip.startDate, trip.endDate)} · {days.length}{" "}
              {days.length === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 border-t-2 border-line pt-4">
          <Link
            href={`/trips/${trip.id}/map`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-ink bg-sea px-4 text-sm font-extrabold text-card shadow-poster-sm transition-colors hover:bg-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
              <path d="M9 3 3.6 5.2a1 1 0 0 0-.6.9v13.4a1 1 0 0 0 1.4.9L9 18.3l6 2.7 5.4-2.2a1 1 0 0 0 .6-.9V4.5a1 1 0 0 0-1.4-.9L15 5.7 9 3Z" />
            </svg>
            Map & routes
          </Link>
          <Link
            href={`/trips/${trip.id}/budget`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-ink bg-mango px-4 text-sm font-extrabold text-ink shadow-poster-sm transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
              <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              <rect x="13" y="9" width="8" height="6" rx="2" />
            </svg>
            ₱ Budget
          </Link>
          <Link
            href={`/trips/${trip.id}/packing`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-ink bg-sea-soft px-4 text-sm font-extrabold text-ink shadow-poster-sm transition-colors hover:bg-sea hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
              <rect x="5" y="7" width="14" height="14" rx="3" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2M9.5 14.5l1.8 1.8 3.4-3.6" />
            </svg>
            Packing
          </Link>
          <Link
            href={`/trips/${trip.id}/edit`}
            className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-card px-4 text-sm font-extrabold text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            Edit
          </Link>
        </div>
      </header>

      <ol className="mt-8 space-y-6">
        {days.map((date, i) => {
          const stops = trip.stopsByDate[date] ?? [];
          return (
            <li key={date}>
              <div className="mb-3 flex items-baseline gap-3">
                <span className="inline-flex -rotate-1 items-center rounded-full border-2 border-ink bg-mango px-3 py-1 font-display text-sm text-ink">
                  DAY {i + 1}
                </span>
                <h2 className="text-base font-extrabold text-ink">
                  {formatDay(date)}
                </h2>
                {stops.length > 0 && (
                  <span className="text-sm tabular-nums text-muted">
                    {stops.length} {stops.length === 1 ? "stop" : "stops"}
                  </span>
                )}
              </div>
              <DayStops
                stops={stops}
                onChange={(next) => updateDay(date, next)}
              />
            </li>
          );
        })}
      </ol>
    </main>
  );
}
