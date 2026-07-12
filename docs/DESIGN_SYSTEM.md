# DESIGN SYSTEM — THE W

How the visual system works, so any future change stays cohesive. All values live in `src/styles.css` under `:root` and the two theme blocks. This doc explains the _intent_ behind them.

---

## Creative direction

**Broadcast-brutalist editorial.** Think a league graphics package crossed with a maximalist print magazine: hard keylines, oversized structural type, a scoreboard/HUD frame, film grain, and a bold two-field color rhythm. Confident, kinetic, athletic — never delicate or cutesy. Sharp edges over rounded corners.

The one thing someone remembers: the **ink ↔ flame checkerboard** — sections hard-flip between near-black and WNBA-orange fields as you scroll, with player surnames blown up big enough to be graphic elements.

---

## Color

Warm-neutral palette (everything is slightly warm — no pure black, no pure white) plus one saturated accent.

| Token | Value | Role |
|-------|-------|------|
| `--ink` | `#0c0a09` | Primary structure / dark field (warm near-black) |
| `--ink-2` | `#171310` | Portrait fill, raised dark surfaces |
| `--bone` | `#f4ede1` | Text/accents on dark (warm off-white) |
| `--flame` | `#ff6a00` | The accent + the orange field (WNBA-adjacent) |
| `--flame-bright` | `#ff9138` | Highlight tint |
| `--ember` | `#7a2d06` | Deep orange shadow tone |

### Theme fields (set per section via `data-theme`)
Each `[data-theme="ink"]` / `[data-theme="flame"]` block remaps a shared set of local tokens so components are theme-agnostic — they only read `--bg`, `--fg`, `--fg-dim`, `--accent`, `--on-accent`, `--stroke`, `--ghost-stroke`, `--hair`, `--panel`.

- **ink field:** bg = ink, fg = bone, accent = flame.
- **flame field:** bg = flame, fg = ink, accent = ink (so pure black type on the orange field, per the brief).

**To add a section, just set `data-theme` — never hardcode colors in a component.**

### Contrast note
Black (`--ink`) on flame (`#ff6a00`) and bone on ink both clear WCAG AA for large text; body copy on flame uses full ink for legibility. Re-check any new small text on the orange field.

---

## Typography

Two families, three voices. (The brief suggested Inter as one option; the `frontend-design` skill discourages generic fonts, so we chose distinctive faces that still honor "oversized grotesque used structurally.")

- **`Archivo`** (variable, Google Fonts) — display + body. We drive its **weight** (`wght` up to 900) and **width** (`wdth` up to 125, "expanded") axes via `font-variation-settings` for the huge athletic names and stat figures.
- **`Martian Mono`** (Google Fonts) — all the "data" voice: HUD/header, kickers, stat labels, ticker, notes, captions. Gives the brutalist scoreboard feel.

### Fluid scale (all `clamp()`, no fixed-breakpoint type)
`--fs-micro`, `--fs-mono`, `--fs-body`, `--fs-lead`, `--fs-stat`, `--fs-name`, `--fs-ghost`, `--fs-hero-w` — see `:root` in `styles.css`. Hero and names scale with viewport width via `vw` units.

### Giant surnames — the special case
Surnames must read as graphics **and** never clip. A static `clamp()` can't do both, so `src/hooks/useFitText.js` measures each name after the font loads and sizes it to its container width (capped for short names, floored for long ones). The name sits on its own full-width band; it does **not** overlap the portrait. The bleeding **outline "ghost" surname** behind everything provides the Z-axis depth (outline = legible on any field).

---

## Layout

- **Engine:** CSS Grid, 12 columns per player section, with real Z-axis overlap via explicit column/row placement + `z-index`.
- **Composition layers (per `PlayerSection`):**
  - layer 0 — bleeding outline ghost surname (`.player__ghostwrap` / `.player__ghost`), horizontally drifting on scroll.
  - layer 1 — portrait placeholder block, floating vertically on scroll.
  - layer 2 — stat-sheet info column (index/role/meta head, stats, note, bio, "why she matters").
- **Alternation (in `App.jsx`):** `theme = i % 2 === 0 ? 'ink' : 'flame'` and `align = i % 2 === 0 ? 'right' : 'left'` → checkerboard of field color + portrait side. Tickers inserted after the 3rd and 6th players, running in alternating directions.
- **Fluid sizing:** `clamp()` + viewport units throughout; `--gutter`, `--header-h`, `--rail-w`, `--maxw` control the frame.
- **Persistent chrome:** fixed broadcast header (`SiteFrame`) with wordmark + season tag + roster count; fixed right-edge `01–08` progress rail (hidden below 900px).

### Responsive
- `≤900px`: rail hides, `--rail-w` collapses, gutters relax.
- `≤760px`: player grid switches to a stacked flex column (name → portrait → info), ghost name shrinks, hero foot stacks.
- `≤420px`: tighter head row, smaller stat gaps.
- `overflow-x: hidden` on body + `overflow: clip` on sections contain the intentional bleed.

---

## Motion (Phase 2)

Principle from the brief: **kinetic and intentional, not gratuitous or cutesy.**

- **Smooth scroll:** Lenis momentum on desktop (`useSmoothScroll.js`). `syncTouch: false` (native touch scroll, no scroll-jacking). Not initialized under reduced motion. Anchor clicks upgraded to eased `lenis.scrollTo`.
- **Scroll-linked parallax:** Framer Motion `useScroll({ target, offset: ['start end','end start'] })` per section → `useTransform` drives ghost horizontal drift and portrait vertical float.
- **Reveal cascade:** `whileInView` variant orchestration (head → name → portrait → info) with stagger, `once: true`.
- **Hero load:** orchestrated on-mount stagger (`initial`/`animate`), the "W" gets a slightly bigger rise + scale.
- **Stat count-up:** `AnimatedNumber` uses `useInView` + `useMotionValue` + `animate`; only genuine metrics count (skips years, ordinals, and label-values); exposes the true value via `aria-label`.
- **Ticker:** CSS `@keyframes marquee` translateX -50% on a duplicated track; pauses on hover; frozen by the reduced-motion media query.

### Accessibility rules for motion
- **Every** animated component checks `useReducedMotion()` and renders static when true. Keep this for anything new.
- The global `@media (prefers-reduced-motion: reduce)` block also neutralizes CSS transitions/animations and restores `scroll-behavior: auto`.
- Keyboard focus is visible (`:focus-visible` outline, theme-aware).

---

## Texture & detail

- **Grain:** fixed full-viewport SVG turbulence tile (`Grain.jsx`), low opacity, `mix-blend-mode` overlay, `pointer-events: none`.
- **Portrait placeholder:** halftone dot field + faint grid + giant jersey number + initials + team/pos chip + a visible `replace with licensed photo` caption + offset hard shadow + corner keylines. Deliberately graphic so a frozen build still reads as composed.
- **Selection colors** flip per field (`::selection`).

---

## Component inventory

| Component | Responsibility |
|-----------|----------------|
| `App` | Composition; theme/align alternation; mounts smooth scroll; places tickers |
| `SiteFrame` | Fixed header + right-edge progress rail |
| `Grain` | Fixed grain/noise overlay |
| `IntroHero` | Opening "THE W" hero with orchestrated load |
| `PlayerSection` | One full-height player feature (grid, parallax, reveal, highlights row) |
| `HighlightCarousel` | Phase 3 physics carousel: drag + inertia, counter-parallax art, keyboard nav, reduced-motion native scroll |
| `StatBlock` | Scoreboard stat readout |
| `AnimatedNumber` | Count-up for genuine metrics only |
| `PlaceholderPortrait` | Portrait slot: supplied photo (cover-fit, top-biased) or styled placeholder |
| `Ticker` | Marquee headline strip |
| `Closer` | Colophon / honest build notes |
| `useFitText` | Fit giant surnames to width |
| `useSmoothScroll` | Lenis init, reduced-motion/touch aware |

---

## Design guardrails (do / don't)

- **Do** keep it intentional — every layout decision considered; no stock-template look.
- **Do** read colors from theme tokens, not literals.
- **Do** keep new motion behind `useReducedMotion()`.
- **Don't** introduce rounded, soft, or "cutesy" styling — sharp edges, hard keylines.
- **Don't** add real logos/marks/photography — placeholders only until licensed.
- **Don't** converge on generic AI defaults (Inter, purple gradients, predictable card grids).
