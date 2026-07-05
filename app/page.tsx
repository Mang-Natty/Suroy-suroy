import Link from "next/link";

const features = [
  {
    title: "Day-by-day itinerary",
    body: "Turn a date range into days, drop in your stops, and shuffle them until the trip feels right.",
    chip: "bg-sea-soft text-ink",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18M8 15h2m4 0h2" />
      </svg>
    ),
  },
  {
    title: "Traveler map & routes",
    body: "See every stop on a real map and trace the route between them, with distance and travel time.",
    chip: "bg-mango text-ink",
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
    chip: "bg-sea-soft text-ink",
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
    body: "Beach, hike, or city templates plus your own must-brings. Tick them off and forget nothing.",
    chip: "bg-mango text-ink",
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
            <p className="inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-ink bg-mango px-4 py-1.5 text-sm font-extrabold text-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Philippines-first · no signup, ever
            </p>
            <h1 className="mt-6 font-display text-4xl tracking-tight text-ink sm:text-6xl">
              SUROY-SUROY
            </h1>
            <p className="mt-3 text-lg font-extrabold text-coral-deep sm:text-xl">
              Plan the trip. Keep the joy.
            </p>
            <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
              <em>Suroy-suroy</em> is Cebuano for wandering around just for the
              fun of it. This is a light travel planner in that same spirit:
              your days, stops, routes, ₱ budget, and packing list in one page
              that lives entirely in your browser.
            </p>
            <div className="mt-8">
              <Link
                href="/trips"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-poster-sm sm:w-auto"
                style={{ touchAction: "manipulation" }}
              >
                Start planning
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <p className="mt-3 text-sm text-muted">
                Free forever. No accounts, your plans stay on your device.
                Tara, suroy ta!
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <h2 className="sr-only">What Suroy-Suroy does</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`rounded-2xl border-2 border-ink bg-card p-5 ${i % 2 === 1 ? "shadow-poster-sea" : "shadow-poster"}`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink ${feature.chip}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-ink">
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

      <footer className="border-t-2 border-ink bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            Built by{" "}
            <a
              href="https://natty-devtravels.vercel.app"
              className="font-extrabold text-sea underline-offset-4 hover:underline"
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
