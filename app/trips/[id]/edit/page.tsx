"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/types";
import { getTrip } from "@/lib/storage";
import TripForm from "@/components/TripForm";
import BackLink from "@/components/BackLink";
import Loader from "@/components/Loader";

export default function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

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
        <p className="mt-3 text-body">
          This trip isn&apos;t on this device — remember, plans live in the
          browser they were made in.
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

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href={`/trips/${trip.id}`} label={trip.name} />
      <h1 className="mt-3 font-display text-3xl text-ink">EDIT TRIP</h1>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster sm:p-7">
        <TripForm trip={trip} />
      </div>
    </main>
  );
}
