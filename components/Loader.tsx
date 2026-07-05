/** Poster-style loader: a compass sticker doing a slow spin.
    The reduced-motion rule in globals.css freezes it automatically. */
export default function Loader({
  label = "Loading… sakay na!",
  className = "py-16",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-mango shadow-poster-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-7 w-7 animate-spin text-ink [animation-duration:1.6s]"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </svg>
      </div>
      <p className="text-sm font-extrabold text-ink">{label}</p>
    </div>
  );
}
