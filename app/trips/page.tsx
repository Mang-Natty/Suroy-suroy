"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/types";
import { deleteTrip, getTrips } from "@/lib/storage";
import { dateRange, formatRange } from "@/lib/dates";
import { TripCover } from "@/components/covers";
import BackLink from "@/components/BackLink";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[] | null>(null);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  function onDelete(trip: Trip) {
    const ok = window.confirm(
      `Delete "${trip.name}"? Its days, stops, and routes go with it.`,
    );
    if (!ok) return;
    deleteTrip(trip.id);
    setTrips(getTrips());
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <BackLink href="/" label="Home" />
          <h1 className="mt-3 font-display text-3xl text-ink">YOUR TRIPS</h1>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-6 text-base font-extrabold text-card shadow-poster transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-poster-sm"
          style={{ touchAction: "manipulation" }}
        >
          New trip
        </Link>
      </div>

      {trips === null ? null : trips.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-ink bg-card p-8 text-center shadow-poster">
          <h2 className="font-display text-2xl text-ink">
            Wala pay plano? Tara, suroy ta!
          </h2>
          <p className="mt-3 text-base leading-relaxed text-body">
            No trips yet. Start one — name it, pick the dates, slap a sticker
            on it, and the day-by-day plan builds itself from there.
          </p>
          <Link
            href="/trips/new"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-poster-sm sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            Plan your first trip
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {trips.map((trip, i) => {
            const days = dateRange(trip.startDate, trip.endDate);
            const stopCount = days.reduce(
              (n, d) => n + (trip.stopsByDate[d]?.length ?? 0),
              0,
            );
            return (
              <li
                key={trip.id}
                className={`rounded-2xl border-2 border-ink bg-card p-4 ${i % 2 === 1 ? "shadow-poster-sea" : "shadow-poster"}`}
              >
                <div className="flex items-center gap-4">
                  <TripCover color={trip.coverColor} icon={trip.coverIcon} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="block truncate text-lg font-extrabold text-ink underline-offset-4 hover:underline"
                    >
                      {trip.name}
                    </Link>
                    <p className="text-sm text-muted">
                      {formatRange(trip.startDate, trip.endDate)} ·{" "}
                      {days.length} {days.length === 1 ? "day" : "days"} ·{" "}
                      {stopCount} {stopCount === 1 ? "stop" : "stops"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t-2 border-line pt-3">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full border-2 border-ink bg-sea-soft px-4 text-sm font-extrabold text-ink hover:bg-sea hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                  >
                    Open plan
                  </Link>
                  <Link
                    href={`/trips/${trip.id}/edit`}
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-card px-4 text-sm font-extrabold text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(trip)}
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-danger bg-card px-4 text-sm font-extrabold text-danger hover:bg-danger hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
