import Link from "next/link";

const features = [
  {
    title: "Day-by-day itinerary",
    body: "Turn a date range into days, drop in your stops, and shuffle them until the trip feels right.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18M8 15h2m4 0h2" />
      </svg>
    ),
  },
  {
    title: "Traveler map & routes",
    body: "See every stop on a real map and trace the route between them — with distance and travel time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <path d="M9 3 3.6 5.2a1 1 0 0 0-.6.9v13.4a1 1 0 0 0 1.4.9L9 18.3l6 2.7 5.4-2.2a1 1 0 0 0 .6-.9V4.5a1 1 0 0 0-1.4-.9L15 5.7 9 3Z" />
        <path d="M9 3v15.3M15 5.7V21" />
      </svg>
    ),
  },
  {
    title: "Budget in pesos",
    body: "Set a trip budget, log the lechon and the tricycle rides, and watch the remaining-funds bar tell the truth.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <rect x="13" y="9" width="8" height="6" rx="2" />
        <circle cx="16.5" cy="12" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Packing checklist",
    body: "Beach, hike, or city templates plus your own must-brings — tick them off and forget nothing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <rect x="5" y="7" width="14" height="14" rx="3" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2M9.5 14.5l1.8 1.8 3.4-3.6" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-sea-soft px-4 py-1.5 text-sm font-semibold text-sea-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Philippines-first · no signup, ever
            </p>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Suroy-Suroy
            </h1>
            <p className="mt-3 text-lg font-semibold text-sea sm:text-xl">
              Plan the trip. Keep the joy.
            </p>
            <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
              <em>Suroy-suroy</em> is Cebuano for wandering around just for the
              fun of it. This is a light travel planner in that same spirit —
              your days, stops, routes, ₱ budget, and packing list in one page
              that lives entirely in your browser.
            </p>
            <div className="mt-8">
              <Link
                href="/trips"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sea px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 active:scale-[0.97] sm:w-auto"
                style={{ touchAction: "manipulation" }}
              >
                Start planning
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <p className="mt-3 text-sm text-muted">
                Free forever. No accounts — your plans stay on your device.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <h2 className="sr-only">What Suroy-Suroy does</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(13,148,136,0.10)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sea-soft text-sea-ink">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-body">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            Built by{" "}
            <a
              href="https://natty-devtravels.vercel.app"
              className="font-semibold text-sea underline-offset-4 hover:underline"
            >
              nattydev
            </a>
          </p>
          <p>Local-first: no servers, no tracking, just your browser.</p>
        </div>
      </footer>
    </>
  );
}
