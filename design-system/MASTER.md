# Suroy-Suroy Design System — MASTER

> Global source of truth for all UI. Page-specific overrides live in
> `design-system/pages/<page>.md` and take precedence when present.
> Authored in M0 following the ui-ux-pro-max rule set (the skill's script
> assets were unavailable; rules applied manually — contrast, touch targets,
> mobile-first, semantic tokens).

## Identity

- **Product:** light, local-first, Philippines-first travel planner.
- **Personality:** tropical, friendly, joyful — "tara, suroy ta!" energy.
  Copy may sprinkle Cebuano/Filipino phrases (always with enough context to
  stay understandable).
- **Explicitly NOT:** pixel/retro (that's the portfolio's language), corporate
  gray, dark/moody. **Light-only in v1. Mobile-first always.**

## Style

**Fresh tropical modern** — airy layouts, rounded geometry, soft tinted
shadows, generous whitespace. Think a clean beach morning, not a neon party.

- Corners: cards `16px` (`rounded-2xl`), inputs/buttons pill or `12px`,
  hero art `24px`. Nothing sharp-cornered.
- Shadows: soft and sea-tinted, never harsh black.
  Card: `0 4px 16px rgba(13, 148, 136, 0.10)`. One elevation scale, reuse it.
- Surfaces: white cards on a faint sea-tinted page background; sections may
  alternate white / `--color-sea-tint`.
- Icons: **SVG only** (Lucide-style, 1.5–2px stroke, one family). Never emoji.

## Color tokens (light-only, WCAG-checked)

Define as CSS variables in `app/globals.css` `@theme`; components use
semantic Tailwind classes, never raw hex.

| Token | Hex | Role | Contrast notes |
|---|---|---|---|
| `--color-sea` | `#0F766E` | **Primary** — CTAs, links, active states | 5.3:1 on white → AA text ✓ |
| `--color-sea-deep` | `#115E59` | Primary hover/pressed | 6.9:1 ✓ |
| `--color-sea-ink` | `#134E4A` | Headings, emphasis | 8.8:1 ✓ |
| `--color-sea-soft` | `#CCFBF1` | Selected/badge fills, icon chips | bg only |
| `--color-sea-tint` | `#F0FDFA` | Page/section tint background | bg only |
| `--color-sun` | `#F59E0B` | Warm accent — highlights, illustration, progress | **never text on white** |
| `--color-sun-ink` | `#92400E` | Text on sun-tinted fills | 4.6:1 on `#FEF3C7` ✓ |
| `--color-sand` | `#FEF3C7` | Warm secondary fill (badges, callouts) | bg only |
| `--color-ink` | `#134E4A` | Display/heading text | see above |
| `--color-body` | `#334155` | Body text (slate-700) | 7.6:1 ✓ |
| `--color-muted` | `#64748B` | Secondary text (slate-500) | 4.8:1 ✓ — minimum, no lighter |
| `--color-line` | `#E2E8F0` | Borders, dividers | |
| `--color-success` | `#059669` | Success (emerald-600) | pair with icon/text, not color alone |
| `--color-danger` | `#E11D48` | Errors, destructive (rose-600) | 4.5:1 ✓ |

Rules: primary action per screen is **sea**, exactly one. Sun is seasoning,
not the main dish (icons, accents, the budget bar can go sun→rose as funds
drop). Never gray-on-gray; never sun-on-white text.

## Typography

- **Single family: Plus Jakarta Sans** (Google, variable) via `next/font` —
  friendly geometric, loads fast, one font = mobile-first performance.
  Expose as `--font-sans`.
- Weights: 800 display, 700 headings, 600 buttons/labels, 400 body.
- Scale (px): 12 (fine print only) · 14 (labels) · **16 body — never smaller
  on mobile** · 18 lead · 24 h3 · 30 h2 · 36/44 h1 (mobile/desktop).
- Body line-height 1.6; headings 1.15–1.25. Line length ≤ 65ch.
- Numbers (₱ amounts, distances): `tabular-nums`.

## Layout & spacing (mobile-first)

- Build for **375px first**; enhance with `sm:`/`md:`/`lg:`. Breakpoints:
  375 / 768 / 1024 / 1440.
- 4/8px spacing rhythm. Section vertical padding: 48px mobile → 80px desktop.
- Container: `max-w-6xl` desktop; gutters `px-4` mobile → `px-8` desktop.
- **Touch targets ≥ 44×44px** (`h-11` minimum; primary CTAs `h-12`+), ≥8px
  between targets. Primary mobile CTA: full-width, thumb-reachable.
- `min-h-dvh` not `100vh`. No horizontal scroll at 375px, ever.
- Content stacks single-column on mobile; grids (`sm:grid-cols-2`,
  `lg:grid-cols-4`) appear upward.

## Components

- **Buttons:** pill (`rounded-full`), weight 600. Primary: sea bg / white
  text / hover sea-deep. Secondary: white bg, `--color-line` border, sea-ink
  text. All: visible focus ring (`focus-visible:ring-2 ring-offset-2`,
  sea), pressed scale ~0.97, `touch-action: manipulation`.
- **Cards:** white, `rounded-2xl`, soft shadow, `p-5`+. Hover (desktop only):
  slight lift; never hover-only information.
- **Inputs:** `h-11`+, visible label above (never placeholder-only), helper/
  error text below the field, semantic `type=` for correct mobile keyboards.
- **Empty states:** illustration/icon + one friendly Cebuano-flavored line +
  one clear action. (e.g. "Wala pay plano? Tara, suroy ta!")
- **Feedback:** loading state on any async button; toasts auto-dismiss 3–5s,
  `aria-live="polite"`; confirm before destructive deletes.

## Motion

- Micro-interactions 150–300ms, `ease-out` enter / `ease-in` exit; exits
  shorter than enters. Animate `transform`/`opacity` only — no layout shift.
- 1–2 animated elements per view; always honor `prefers-reduced-motion`.

## Accessibility floor (non-negotiable)

- Text contrast ≥ 4.5:1; UI glyphs ≥ 3:1. Keyboard reachable everything,
  visible focus, alt text, `aria-label` on icon-only buttons, sequential
  headings, color never the only signal.

## Anti-patterns (reject in review)

Emoji as icons · pixel/retro styling · dark theme creep (incl. leftover
`prefers-color-scheme` blocks) · raw hex in components · placeholder-only
labels · touch targets < 44px · hover-only affordances · `100vh` on mobile ·
horizontal scroll at 375px · more than one primary CTA per screen.
