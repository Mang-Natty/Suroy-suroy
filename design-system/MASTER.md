# Suroy-Suroy Design System — MASTER (v2 · vintage travel poster)

> Global source of truth for all UI. Page-specific overrides live in
> `design-system/pages/<page>.md` and take precedence when present.
> **v2 (2026-07-05):** owner overturned the original "tropical modern" call in
> favor of **retro — vintage PH travel poster**. Chosen over "jeepney pop" and
> over the Claude Design "Retro App" exploration (rejected: Press Start 2P +
> emerald = the portfolio's identity; see `design-import/`).

## Identity

- **Product:** light, local-first, Philippines-first travel planner.
- **Personality:** 1970s Philippine tourism poster — warm, sunny, hand-made,
  proudly local. "Tara, suroy ta!" energy. Cebuano/Filipino microcopy welcome
  (with enough context to stay understandable).
- **Explicitly NOT:** the portfolio's 2-bit pixel retro (no pixel fonts, no
  emerald-on-dark, no game chrome), and not corporate flat either.
  **Light-only in v1. Mobile-first always.**

## Style

**Vintage travel poster** — cream paper, deep-sea ink outlines, sunset coral
and mango, sticker badges, hard offset shadows (no blur — print, not glow).

- Corners: stay rounded (cards `12–16px`, buttons pill) — friendly, not brutal.
- Outlines: key surfaces (cards, buttons, badges, icon chips) get a **2px ink
  border**. Ink is the outline color everywhere; never gray borders on cards.
- Shadows: **hard offset, zero blur** — `4px 4px 0 ink` (or sea for variety).
  Pressed state = element translates 2px toward the shadow, shadow shrinks.
- Paper: page background is warm cream; cards are lighter warm white. No pure
  gray anywhere — warmth is the point.
- Stickers: badges may rotate ±2° for the hand-placed look. Max one rotated
  element per view.
- Icons: **SVG only** (Lucide-style, 1.8–2px stroke, one family). Never emoji.

## Color tokens (light-only, WCAG-checked on cream)

Defined in `app/globals.css` `@theme`; components use semantic utilities
(`bg-paper`, `text-ink`…), never raw hex.

| Token | Hex | Role | Contrast notes |
|---|---|---|---|
| `--color-paper` | `#FFF4E0` | Page background | bg only |
| `--color-card` | `#FFFDF7` | Card/surface background | bg only |
| `--color-ink` | `#123F3A` | Headings, outlines, poster shadows | 10.6:1 on paper ✓ |
| `--color-body` | `#44403C` | Body text | 8.9:1 on paper ✓ |
| `--color-muted` | `#57534E` | Secondary text | 6.5:1 ✓ — minimum tier |
| `--color-coral` | `#E4572E` | **Decorative only** — illustration, big display accents | fails AA as text (3.3:1) — never body/button text |
| `--color-coral-deep` | `#C2410C` | **Primary action** fill + coral text | white on it 5.2:1 ✓; as text on paper 4.7:1 ✓ |
| `--color-coral-press` | `#9A3412` | Primary hover/pressed | ✓ |
| `--color-sea` | `#0F766E` | Secondary accent, links, alt shadows | 5.0:1 on paper ✓ |
| `--color-sea-deep` | `#115E59` | Sea hover | ✓ |
| `--color-sea-soft` | `#CCFBF1` | Cool fills (icon chips) | bg only, pair with ink |
| `--color-mango` | `#F2A93B` | Warm fills — badges, progress, highlights | bg only, pair with ink |
| `--color-sand` | `#FEF3C7` | Soft warm fill | bg only |
| `--color-sun-ink` | `#92400E` | Text on mango/sand fills | 4.6:1 on sand ✓ |
| `--color-line` | `#E5D5B8` | Hairline dividers (footer, tables) | decorative |
| `--color-success` | `#059669` | Success | with icon/text, never color alone |
| `--color-danger` | `#BE123C` | Errors, destructive | 5.9:1 on paper ✓ |

Shadow tokens: `--shadow-poster: 4px 4px 0 0 #123F3A`,
`--shadow-poster-sea: 4px 4px 0 0 #0F766E`.

Rules: one coral-deep primary action per screen. Mango and bright coral are
seasoning (fills/illustration), never text on light. The budget bar may run
mango → coral as funds drop (with labels, not color alone).

## Typography

- **Display: Alfa Slab One** (Google, 400 only) via `next/font` as
  `--font-display` — chunky slab, pure travel poster. Used for the wordmark,
  page titles (h1/h2), big numbers. Often uppercase. Letter-spacing normal
  (slabs are already loud).
- **Body: Plus Jakarta Sans** as `--font-sans` — 400 body, 600 buttons/labels,
  800 badges/emphasis.
- Never set paragraphs in the slab; it's display-only.
- Scale (px): 12 fine print · 14 labels · **16 body minimum on mobile** ·
  18 lead · 24 h3 · 30 h2 · 36/48 h1 (mobile/desktop).
- Body line-height 1.6; slab headings 1.1. Numbers (₱, km): `tabular-nums`.

## Layout & spacing (mobile-first)

- Build for **375px first**; enhance with `sm:`/`md:`/`lg:`. Breakpoints
  375/768/1024/1440. Container `max-w-6xl`; gutters `px-4` → `px-8`.
- 4/8px rhythm. Section padding 48px mobile → 80px desktop.
- **Touch targets ≥ 44×44px** (`h-11` min; primary CTAs `h-12`), ≥8px apart.
  Primary mobile CTA: full-width, thumb-reachable.
- `min-h-dvh`, never `100vh`. No horizontal scroll at 375px, ever.

## Components

- **Buttons:** pill, 2px ink border, `--shadow-poster`. Primary: coral-deep bg
  / paper-white text. Secondary: card bg / ink text. Hover: darker fill;
  pressed/active: `translate(2px,2px)` + shadow to `2px 2px 0`. Visible focus
  ring (`focus-visible:ring-2 ring-offset-2` ink). `touch-action: manipulation`.
- **Cards:** card bg, 2px ink border, `rounded-2xl`, poster shadow, `p-5`+.
- **Inputs:** `h-11`+, 2px ink border, card bg; visible label above (never
  placeholder-only), helper/error below, semantic `type=` for mobile keyboards.
- **Empty states:** icon in a mango sticker chip + friendly Cebuano line + one
  clear action ("Wala pay plano? Tara, suroy ta!").
- **Feedback:** loading state on async buttons; toasts 3–5s `aria-live="polite"`;
  confirm destructive deletes.

## Motion

- 150–300ms, `ease-out` in / `ease-in` out; exits shorter. Transform/opacity
  only. Pressed = translate toward shadow (the poster "push"). Honor
  `prefers-reduced-motion`. 1–2 animated elements per view.

## Accessibility floor (non-negotiable)

Text ≥ 4.5:1 (see table); UI glyphs ≥ 3:1. Keyboard everything, visible focus,
alt text, `aria-label` on icon-only buttons, sequential headings, color never
the only signal.

## Anti-patterns (reject in review)

Pixel fonts / Press Start 2P / emerald-on-dark (portfolio's language) · emoji
as icons · blurred/soft shadows (this system is hard-offset only) · bright
coral `#E4572E` as text or button fill · gray borders on cards (ink or nothing)
· slab font in body copy · more than one rotated sticker per view · dark theme
creep · raw hex in components · placeholder-only labels · targets < 44px ·
`100vh` · horizontal scroll at 375px · >1 primary CTA per screen.
