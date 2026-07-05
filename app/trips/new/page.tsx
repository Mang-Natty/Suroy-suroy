"use client";

import TripForm from "@/components/TripForm";
import BackLink from "@/components/BackLink";

export default function NewTripPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href="/trips" label="Your trips" />
      <h1 className="mt-3 font-display text-3xl text-ink">NEW TRIP</h1>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster sm:p-7">
        <TripForm />
      </div>
    </main>
  );
}
