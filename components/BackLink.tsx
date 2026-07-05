import Link from "next/link";

/** Poster-style back button — replaces bare "← text" links so navigation
    matches the sticker/outline language everywhere. */
export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 max-w-full items-center gap-2 rounded-full border-2 border-ink bg-card px-4 text-sm font-extrabold text-ink shadow-poster-sm transition-all duration-150 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
      style={{ touchAction: "manipulation" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
      >
        <path d="M19 12H5m6 6-6-6 6-6" />
      </svg>
      <span className="truncate">{label}</span>
    </Link>
  );
}
