import type { CoverColor, CoverIcon } from "@/lib/types";

/** Sticker cover palette — poster tokens only (design-system/MASTER.md).
    Every pair keeps ink-on-fill readable. */
export const COVER_COLORS: Record<CoverColor, { bg: string; label: string }> = {
  mango: { bg: "bg-mango", label: "Mango" },
  coral: { bg: "bg-coral", label: "Coral" },
  sea: { bg: "bg-sea", label: "Sea" },
  sand: { bg: "bg-sand", label: "Sand" },
  "sea-soft": { bg: "bg-sea-soft", label: "Seafoam" },
};

/** Sea + coral fills are dark enough that the icon flips to cream. */
const LIGHT_INK: Record<CoverColor, string> = {
  mango: "text-ink",
  coral: "text-card",
  sea: "text-card",
  sand: "text-ink",
  "sea-soft": "text-ink",
};

const paths: Record<CoverIcon, React.ReactNode> = {
  palm: (
    <>
      <path d="M12 22c0-6 .5-10 2-13" />
      <path d="M14 9C10 6 6 6.5 4 9c3-.5 6 0 10 0Z" />
      <path d="M14 9c-1-4 1-7 4-7-1 2-1 4 0 7" />
      <path d="M14 9c4-2 7-1 8 2-3-1-6-1-8-2Z" />
    </>
  ),
  boat: (
    <>
      <path d="M3 15h18l-2.5 4.5a2 2 0 0 1-1.8 1H7.3a2 2 0 0 1-1.8-1Z" />
      <path d="M12 15V3m0 0 6 9h-6M12 3 7 11h5" />
    </>
  ),
  mountain: (
    <>
      <path d="m8 8 5.5 10.5a1 1 0 0 1-.9 1.5H3.4a1 1 0 0 1-.9-1.5L7 9" />
      <path d="m13 13 3-6 5.6 11.5a1 1 0 0 1-.9 1.5H14" />
      <path d="M7 9a2.5 2.5 0 0 0 2 0" />
    </>
  ),
  city: (
    <>
      <path d="M4 21V7l5-3v17M9 21V10l6 2v9M15 21V8l5 2v11" />
      <path d="M2 21h20" />
    </>
  ),
  food: (
    <>
      <path d="M5 3v18M3 3v5a2 2 0 0 0 4 0V3" />
      <path d="M16 3c-2 0-3 3-3 7h6c0-4-1-7-3-7Zm0 7v11" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  backpack: (
    <>
      <rect x="5" y="7" width="14" height="14" rx="3" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2M5 13h14M9 13v3m6-3v3" />
    </>
  ),
  plane: (
    <>
      <path d="M21 15 13.5 9V3.8a1.5 1.5 0 0 0-3 0V9L3 15v2.5l7.5-2.6v4.3L8 21v1.5l4-1.2 4 1.2V21l-2.5-1.8v-4.3L21 17.5Z" />
    </>
  ),
};

export const COVER_ICONS: Record<CoverIcon, { label: string }> = {
  palm: { label: "Beach" },
  boat: { label: "Island hop" },
  mountain: { label: "Hike" },
  city: { label: "City" },
  food: { label: "Food trip" },
  camera: { label: "Sights" },
  backpack: { label: "Backpack trip" },
  plane: { label: "Fly out" },
};

export function CoverIconSvg({
  icon,
  className = "h-6 w-6",
}: {
  icon: CoverIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[icon]}
    </svg>
  );
}

/** The sticker: colored circle, ink outline, slight tilt. */
export function TripCover({
  color,
  icon,
  size = "md",
}: {
  color: CoverColor;
  icon: CoverIcon;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const iconDims = size === "lg" ? "h-7 w-7" : "h-6 w-6";
  return (
    <div
      className={`flex ${dims} -rotate-2 items-center justify-center rounded-full border-2 border-ink ${COVER_COLORS[color].bg} ${LIGHT_INK[color]}`}
    >
      <CoverIconSvg icon={icon} className={iconDims} />
    </div>
  );
}
