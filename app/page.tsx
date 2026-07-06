import Link from "next/link";

const howItWorks = [
  {
    step: 1,
    title: "Name your trip",
    body: "Pick a name, dates, and a vibe. Your trip gets a sticker. That's it.",
  },
  {
    step: 2,
    title: "Add stops day-by-day",
    body: "Search for cafés, inns, falls, or just tap the map. Every stop lands in your itinerary.",
  },
  {
    step: 3,
    title: "Track your budget",
    body: "Set a peso fund. Log the lechon, the tricycle rides, the pasalubong. Watch it drain.",
  },
  {
    step: 4,
    title: "Pack and backup",
    body: "Use templates or add your own items. Export your whole trip as JSON whenever you like.",
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
          <h2 className="mb-12 text-center font-display text-3xl text-ink sm:text-4xl">
            How it works
          </h2>
          <div className="space-y-12">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="grid items-center gap-8 md:grid-cols-2">
                {/* Alternate layout: image on left/right */}
                <div className={item.step % 2 === 0 ? "md:order-2" : ""}>
                  {/* SVG Mockup based on step */}
                  <div className="rounded-2xl border-2 border-ink bg-card p-6 shadow-poster">
                    {item.step === 1 && (
                      <svg viewBox="0 0 280 320" className="w-full" aria-hidden="true">
                        {/* Trip form mockup */}
                        <rect x="10" y="10" width="260" height="300" fill="#FFF4E0" stroke="#123F3A" strokeWidth="2" rx="12" />
                        {/* Name input */}
                        <text x="20" y="35" fontSize="12" fontWeight="bold" fill="#123F3A">Trip name</text>
                        <rect x="20" y="42" width="240" height="28" fill="#E8E8E8" stroke="#123F3A" strokeWidth="2" rx="6" />
                        <text x="30" y="63" fontSize="13" fill="#999">Siargao trip</text>
                        {/* Date inputs */}
                        <text x="20" y="90" fontSize="12" fontWeight="bold" fill="#123F3A">Dates</text>
                        <rect x="20" y="97" width="110" height="28" fill="#E8E8E8" stroke="#123F3A" strokeWidth="2" rx="6" />
                        <text x="30" y="117" fontSize="11" fill="#666">Aug 10</text>
                        <rect x="150" y="97" width="110" height="28" fill="#E8E8E8" stroke="#123F3A" strokeWidth="2" rx="6" />
                        <text x="160" y="117" fontSize="11" fill="#666">Aug 14</text>
                        {/* Vibe buttons */}
                        <text x="20" y="155" fontSize="12" fontWeight="bold" fill="#123F3A">Vibe</text>
                        <g>
                          <rect x="20" y="162" width="50" height="50" fill="#0F766E" stroke="#123F3A" strokeWidth="2" rx="8" />
                          <text x="45" y="196" fontSize="11" fontWeight="bold" fill="#FFF4E0" textAnchor="middle">Beach</text>
                          <rect x="80" y="162" width="50" height="50" fill="none" stroke="#123F3A" strokeWidth="2" rx="8" />
                          <text x="105" y="196" fontSize="11" fontWeight="bold" fill="#123F3A" textAnchor="middle">Hike</text>
                          <rect x="140" y="162" width="50" height="50" fill="none" stroke="#123F3A" strokeWidth="2" rx="8" />
                          <text x="165" y="196" fontSize="11" fontWeight="bold" fill="#123F3A" textAnchor="middle">City</text>
                          <rect x="200" y="162" width="50" height="50" fill="none" stroke="#123F3A" strokeWidth="2" rx="8" />
                          <text x="225" y="196" fontSize="11" fontWeight="bold" fill="#123F3A" textAnchor="middle">Food</text>
                        </g>
                        {/* Create button */}
                        <rect x="20" y="230" width="240" height="40" fill="#C2410C" stroke="#123F3A" strokeWidth="2" rx="20" />
                        <text x="140" y="258" fontSize="14" fontWeight="bold" fill="#FFF4E0" textAnchor="middle">Create trip</text>
                      </svg>
                    )}
                    {item.step === 2 && (
                      <svg viewBox="0 0 280 320" className="w-full" aria-hidden="true">
                        {/* Map + stops mockup */}
                        <rect x="10" y="10" width="260" height="300" fill="#FFF4E0" stroke="#123F3A" strokeWidth="2" rx="12" />
                        {/* Mini map */}
                        <rect x="20" y="20" width="150" height="160" fill="#E0F2F1" stroke="#123F3A" strokeWidth="2" rx="8" />
                        {/* Pins on map */}
                        <circle cx="55" cy="60" r="6" fill="#F2A93B" stroke="#123F3A" strokeWidth="1.5" />
                        <circle cx="95" cy="90" r="6" fill="#F2A93B" stroke="#123F3A" strokeWidth="1.5" />
                        <circle cx="130" cy="120" r="6" fill="#F2A93B" stroke="#123F3A" strokeWidth="1.5" />
                        {/* Stops list on right */}
                        <text x="185" y="35" fontSize="11" fontWeight="bold" fill="#123F3A">Stops</text>
                        {/* Stop 1 */}
                        <rect x="180" y="45" width="90" height="35" fill="white" stroke="#123F3A" strokeWidth="1.5" rx="6" />
                        <text x="188" y="62" fontSize="11" fontWeight="bold" fill="#123F3A">Siargao Town</text>
                        <text x="188" y="75" fontSize="9" fill="#999">General Luna</text>
                        {/* Stop 2 */}
                        <rect x="180" y="85" width="90" height="35" fill="white" stroke="#123F3A" strokeWidth="1.5" rx="6" />
                        <text x="188" y="102" fontSize="11" fontWeight="bold" fill="#123F3A">Cloud 9 Beach</text>
                        <text x="188" y="115" fontSize="9" fill="#999">Siargao</text>
                        {/* Stop 3 */}
                        <rect x="180" y="125" width="90" height="35" fill="white" stroke="#123F3A" strokeWidth="1.5" rx="6" />
                        <text x="188" y="142" fontSize="11" fontWeight="bold" fill="#123F3A">Pacifico Island</text>
                        <text x="188" y="155" fontSize="9" fill="#999">Siargao</text>
                        {/* Search input */}
                        <rect x="20" y="190" width="250" height="30" fill="#E8E8E8" stroke="#123F3A" strokeWidth="2" rx="6" />
                        <text x="30" y="211" fontSize="11" fill="#999">Search a spot.</text>
                        {/* Add button */}
                        <rect x="20" y="230" width="250" height="40" fill="#F2A93B" stroke="#123F3A" strokeWidth="2" rx="20" />
                        <text x="145" y="258" fontSize="14" fontWeight="bold" fill="#123F3A" textAnchor="middle">Add stop</text>
                      </svg>
                    )}
                    {item.step === 3 && (
                      <svg viewBox="0 0 280 320" className="w-full" aria-hidden="true">
                        {/* Budget + packing mockup */}
                        <rect x="10" y="10" width="260" height="300" fill="#FFF4E0" stroke="#123F3A" strokeWidth="2" rx="12" />
                        {/* Budget section */}
                        <text x="20" y="35" fontSize="12" fontWeight="bold" fill="#123F3A">₱ Budget</text>
                        <text x="20" y="55" fontSize="16" fontWeight="bold" fill="#123F3A">₱6,500</text>
                        <text x="20" y="70" fontSize="10" fill="#999">spent ₱3,500 of ₱10,000</text>
                        {/* Fund bar */}
                        <rect x="20" y="78" width="240" height="16" fill="#E8E8E8" stroke="#123F3A" strokeWidth="1.5" rx="8" />
                        <rect x="20" y="78" width="180" height="16" fill="#0F766E" stroke="none" rx="8" />
                        {/* Expense items */}
                        <text x="20" y="115" fontSize="11" fontWeight="bold" fill="#123F3A">Recent</text>
                        <rect x="20" y="122" width="240" height="26" fill="white" stroke="#123F3A" strokeWidth="1.5" rx="6" />
                        <circle cx="35" cy="135" r="4" fill="#0F766E" />
                        <text x="48" y="130" fontSize="10" fontWeight="bold" fill="#123F3A">Food</text>
                        <text x="48" y="142" fontSize="9" fill="#999">Lechon sa Carcar</text>
                        <text x="253" y="135" fontSize="10" fontWeight="bold" fill="#123F3A" textAnchor="end">₱1,200</text>
                        {/* Packing section */}
                        <text x="20" y="175" fontSize="12" fontWeight="bold" fill="#123F3A">Packing</text>
                        <rect x="20" y="183" width="240" height="18" fill="#E8E8E8" stroke="#123F3A" strokeWidth="1.5" rx="6" />
                        <rect x="20" y="183" width="120" height="18" fill="#F2A93B" stroke="none" rx="6" />
                        <text x="135" y="197" fontSize="9" fontWeight="bold" fill="#123F3A">50%</text>
                        {/* Checklist items */}
                        <g>
                          <rect x="20" y="212" width="240" height="24" fill="white" stroke="#123F3A" strokeWidth="1.5" rx="6" />
                          <rect x="28" y="219" width="14" height="14" fill="#0F766E" stroke="#123F3A" strokeWidth="1" rx="3" />
                          <line x1="32" y1="224" x2="36" y2="228" stroke="#FFF4E0" strokeWidth="1.5" />
                          <text x="48" y="227" fontSize="10" fill="#123F3A">Swimwear</text>
                          <rect x="260" y="218" width="8" height="8" fill="#C2410C" stroke="#123F3A" strokeWidth="1" rx="2" />
                        </g>
                      </svg>
                    )}
                    {item.step === 4 && (
                      <svg viewBox="0 0 280 320" className="w-full" aria-hidden="true">
                        {/* Export mockup */}
                        <rect x="10" y="10" width="260" height="300" fill="#FFF4E0" stroke="#123F3A" strokeWidth="2" rx="12" />
                        {/* Header */}
                        <text x="140" y="40" fontSize="14" fontWeight="bold" fill="#123F3A" textAnchor="middle">Your trips</text>
                        {/* Trip card */}
                        <rect x="20" y="55" width="240" height="70" fill="white" stroke="#123F3A" strokeWidth="2" rx="8" />
                        <circle cx="40" cy="75" r="12" fill="#F2A93B" stroke="#123F3A" strokeWidth="1.5" />
                        <path d="M38 72L40 74L44 70" stroke="#123F3A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="65" y="75" fontSize="12" fontWeight="bold" fill="#123F3A">Siargao trip</text>
                        <text x="65" y="89" fontSize="10" fill="#999">Aug 10 to Aug 14</text>
                        <text x="225" y="110" fontSize="9" fill="#999" textAnchor="end">4 stops</text>
                        {/* Buttons */}
                        <rect x="20" y="140" width="110" height="30" fill="white" stroke="#123F3A" strokeWidth="2" rx="15" />
                        <text x="75" y="161" fontSize="10" fontWeight="bold" fill="#123F3A" textAnchor="middle">Export</text>
                        <rect x="150" y="140" width="110" height="30" fill="white" stroke="#123F3A" strokeWidth="2" rx="15" />
                        <text x="205" y="161" fontSize="10" fontWeight="bold" fill="#123F3A" textAnchor="middle">Import</text>
                        {/* File icon */}
                        <g transform="translate(100, 200)">
                          <rect x="0" y="0" width="80" height="90" fill="white" stroke="#123F3A" strokeWidth="2" rx="6" />
                          <path d="M50 0V20L70 20" fill="none" stroke="#123F3A" strokeWidth="2" />
                          <circle cx="40" cy="40" r="3" fill="#123F3A" />
                          <line x1="30" y1="45" x2="50" y2="45" stroke="#123F3A" strokeWidth="1.5" />
                          <line x1="30" y1="52" x2="50" y2="52" stroke="#123F3A" strokeWidth="1.5" />
                          <line x1="30" y1="59" x2="50" y2="59" stroke="#123F3A" strokeWidth="1.5" />
                          <text x="40" y="80" fontSize="9" fontWeight="bold" fill="#123F3A" textAnchor="middle">backup.json</text>
                        </g>
                      </svg>
                    )}
                  </div>
                </div>
                {/* Text content */}
                <div className={item.step % 2 === 0 ? "md:order-1" : ""}>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-mango font-display text-lg font-extrabold text-ink">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-body">{item.body}</p>
                </div>
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
