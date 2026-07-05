import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trips",
  description: "Your Suroy-Suroy trips — the planner is on its way.",
};

export default function TripsPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border-2 border-ink bg-card p-8 text-center shadow-poster">
        <div className="mx-auto flex h-14 w-14 -rotate-2 items-center justify-center rounded-full border-2 border-ink bg-mango text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-7 w-7">
            <circle cx="12" cy="12" r="9" />
            <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-2xl text-ink">
          Wala pay plano? Balik unya!
        </h1>
        <p className="mt-3 text-base leading-relaxed text-body">
          No plans here yet — the trip planner is the very next thing being
          built. Soon you&apos;ll create trips, map out each day, and start the
          suroy right on this page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-poster-sm"
          style={{ touchAction: "manipulation" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
            <path d="M19 12H5m6 6-6-6 6-6" />
          </svg>
          Back to home
        </Link>
      </div>
    </main>
  );
}
