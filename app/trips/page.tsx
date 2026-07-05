"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/types";
import { deleteTrip, exportData, getTrips, importData } from "@/lib/storage";
import { dateRange, formatRange } from "@/lib/dates";
import { TripCover } from "@/components/covers";
import BackLink from "@/components/BackLink";
import Modal from "@/components/Modal";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [importPending, setImportPending] = useState<{
    json: string;
    trips: number;
    wishes: number;
  } | null>(null);
  const [dataMsg, setDataMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  function doExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suroy-suroy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDataMsg("Backup downloaded. Keep it somewhere safe!");
  }

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as {
          v?: number;
          trips?: unknown[];
          wishlist?: unknown[];
        };
        if (parsed.v !== 1 || !Array.isArray(parsed.trips)) {
          throw new Error("bad file");
        }
        setDataMsg(null);
        setImportPending({
          json: text,
          trips: parsed.trips.length,
          wishes: parsed.wishlist?.length ?? 0,
        });
      } catch {
        setDataMsg("That doesn't look like a Suroy-Suroy backup file.");
      }
    });
  }

  function confirmImport() {
    if (!importPending) return;
    try {
      const { trips: t, wishes } = importData(importPending.json);
      setTrips(getTrips());
      setDataMsg(
        `Imported ${t} ${t === 1 ? "trip" : "trips"}${wishes > 0 ? ` and ${wishes} dream ${wishes === 1 ? "spot" : "spots"}` : ""}. Welcome back!`,
      );
    } catch (err) {
      setDataMsg(err instanceof Error ? err.message : "Import failed.");
    }
    setImportPending(null);
  }

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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href="/wishlist"
          className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-sea-soft px-4 text-sm font-extrabold text-ink hover:bg-sea hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
            <path d="M12 21s-7-4.6-7-10a7 7 0 0 1 14 0c0 5.4-7 10-7 10Z" />
            <path d="M9.5 11 12 8.5l2.5 2.5L12 13.5 9.5 11Z" />
          </svg>
          Dream spots
        </Link>
        <button
          type="button"
          onClick={doExport}
          className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-card px-4 text-sm font-extrabold text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          Export backup
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-card px-4 text-sm font-extrabold text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
            <path d="M12 15V3m0 0 4 4m-4-4-4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onImportFile}
          className="sr-only"
          aria-label="Import a Suroy-Suroy backup file"
        />
      </div>
      {dataMsg && (
        <p aria-live="polite" className="mt-3 text-sm font-semibold text-sea-deep">
          {dataMsg}
        </p>
      )}

      {trips === null ? null : trips.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-ink bg-card p-8 text-center shadow-poster">
          <h2 className="font-display text-2xl text-ink">
            Wala pay plano? Tara, suroy ta!
          </h2>
          <p className="mt-3 text-base leading-relaxed text-body">
            No trips yet. Start one: name it, pick the dates, slap a sticker
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

      <Modal
        open={importPending !== null}
        title="Import this backup?"
        body={
          importPending
            ? `${importPending.trips} ${importPending.trips === 1 ? "trip" : "trips"}${importPending.wishes > 0 ? ` and ${importPending.wishes} dream ${importPending.wishes === 1 ? "spot" : "spots"}` : ""} will be added. Existing trips with the same id get replaced by the backup's version.`
            : ""
        }
        confirmLabel="Import"
        onConfirm={confirmImport}
        onClose={() => setImportPending(null)}
      />
    </main>
  );
}
