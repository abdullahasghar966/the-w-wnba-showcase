# THE W — 2026 WNBA Player Showcase

**🔗 Live site:** [wnba-players-showcase.vercel.app](https://wnba-players-showcase.vercel.app)

A portfolio-grade, Awwwards-caliber interactive single-page site showcasing eight of the players defining the WNBA's 2026 season. Built to demonstrate senior-level frontend craft (design systems, scroll-driven motion, physics interactions, rendering polish) as a job-application showpiece for a WNBA team or the league office.

> **Original work — not a clone.** Inspired by maximalist/brutalist scroll-driven web design, but with its own identity built around the WNBA's brand energy. No licensed logos, team marks, or photography are used; all imagery is original typographic/graphic treatment with clearly labeled placeholders.

---

## Status at a glance

| Phase | Scope | State |
|------|-------|-------|
| **1 — Foundation** | Vite + React app, design tokens, 8 CSS-Grid player sections, fluid `clamp()` typography, fully responsive static layout | ✅ **Done** |
| **2 — Scroll animation** | Lenis smooth-scroll, Framer Motion `useScroll`/`useTransform` parallax + reveals, stat count-up, animated ticker | ✅ **Done & verified** |
| **3 — Physics carousel** | Per-player draggable "Season Highlights" carousel with elastic drag + counter-parallax | ✅ **Done & verified** |
| **4 — Rendering polish** | Custom blend-mode cursor, `AnimatePresence` intro bumper, scoped lazy R3F hover shader | ✅ **Done & verified** |

**Full detail lives in [`docs/`](#documentation) — read [`docs/HANDOFF.md`](docs/HANDOFF.md) first when resuming.**

---

## Quick start

```bash
npm install
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # production build → /dist
npm run preview  # preview the production build
```

Requires Node 18+ (developed on Node 24, npm 11).

---

## Tech stack

- **React 18** + **Vite 6** — component-based SPA, fast HMR.
- **Framer Motion 12** — scroll-linked transforms, viewport reveals, stat count-up. (Scoped to Phase 2+ only.)
- **Lenis 1.3** — momentum smooth-scroll on desktop; native scroll preserved on touch (no scroll-jacking).
- **Three.js + React Three Fiber 8** — scoped, lazy-loaded WebGL hover shader on the anchor portrait only (code-split; never loaded under reduced motion / no WebGL).
- **Google Fonts** — `Archivo` (variable, width + weight axes) for display/structure, `Martian Mono` for scoreboard/HUD data.
- No CSS framework — hand-authored stylesheet with CSS custom-property design tokens.

---

## Project structure

```
D:\WNBA Website\
├─ index.html                 # font links, meta, root mount
├─ vite.config.js
├─ package.json
├─ README.md                  # you are here
├─ docs/                      # full context set (see below)
│  ├─ MASTER_PROMPT.md        # the original brief, verbatim
│  ├─ HANDOFF.md              # session narrative + resume guide (READ FIRST)
│  ├─ DESIGN_SYSTEM.md        # tokens, type, palette, layout, motion
│  └─ ROADMAP.md              # phase-by-phase checklists + pre-deploy list
├─ .claude/
│  └─ launch.json             # dev-server config for the preview tooling
└─ src/
   ├─ main.jsx                # React root + StrictMode
   ├─ App.jsx                 # composition: frame, hero, 8 sections, tickers, closer
   ├─ styles.css              # ALL styles: tokens, reset, components, responsive, a11y
   ├─ data/
   │  └─ players.js           # single source of truth for all player content + ticker
   ├─ hooks/
   │  ├─ useFitText.js        # auto-fits giant surnames to width (no clipping)
   │  └─ useSmoothScroll.js   # Lenis init, reduced-motion + touch aware, anchor easing
   ├─ assets/
   │  └─ players/             # owner-supplied player photos (7 of 8 — Reese pending)
   └─ components/
      ├─ Grain.jsx            # fixed SVG grain/noise overlay
      ├─ CustomCursor.jsx     # Phase 4 blend-mode cursor (dot + trailing ring, variants)
      ├─ IntroBumper.jsx      # Phase 4 AnimatePresence broadcast intro that wipes away
      ├─ SiteFrame.jsx        # broadcast header + right-edge 01–08 progress rail
      ├─ IntroHero.jsx        # opening "THE W" hero (orchestrated load stagger)
      ├─ Ticker.jsx           # marquee headline strip (CSS animation, hover-pause)
      ├─ PlayerSection.jsx    # one full-height player feature (grid + parallax + reveal)
      ├─ HighlightCarousel.jsx    # Phase 3 draggable physics carousel (per player)
      ├─ StatBlock.jsx        # scoreboard stat readout
      ├─ AnimatedNumber.jsx   # count-up for genuine metrics (skips years/ordinals/labels)
      ├─ PlaceholderPortrait.jsx  # portrait: supplied photo, or styled placeholder
      ├─ FeaturedPortrait.jsx     # Phase 4 gate: lazy-loads the R3F shader or falls back
      ├─ ShaderPortrait.jsx       # Phase 4 scoped R3F hover shader (anchor portrait)
      └─ Closer.jsx           # colophon / sign-off with honest build notes
```

---

## Content & data integrity

- **All stats and achievements** come verbatim from the brief (see [`docs/MASTER_PROMPT.md`](docs/MASTER_PROMPT.md), section 2). Nothing is fabricated — no invented quotes, no invented numbers. Qualitative players (e.g. Angel Reese's "rebounding force") carry no made-up figures.
- **Jersey numbers** on each portrait are the players' real, publicly documented numbers (A'ja Wilson 22, Caitlin Clark 22, Paige Bueckers 5, Breanna Stewart 30, Napheesa Collier 24, Angel Reese 5, Olivia Miles 5*, Sophie Cunningham 8). *Miles has no WNBA jersey on record yet — 5 is her established college number; **verify against the real 2026 roster before deploy.** The 2026 team assignments in the brief are a forward-looking scenario, so confirm all number/team pairings before shipping.
- Editing content? Do it **only** in [`src/data/players.js`](src/data/players.js). Never hardcode copy in components.

## Assets — current state (updated 2026-07-12)

The owner supplied player photos (`src/assets/players/`), now used in the portraits and carousel card art for **all 8 players** — no typographic placeholders remain. Outstanding before deploy:

- **Sources are not 4K.** Supplied files range from 560×1259 to 1061×1208 px (Reese 925×1315). They are used at full native resolution, cover-fit with no stretching or upscaling, so they render crisp at the layout's display size (~545 CSS px wide max) — but on high-DPI screens true 4K sources would be sharper. Swap in higher-resolution files when available (same filenames in `src/assets/players/`).
- **Licensing** of the supplied photos (and the team marks visible in them) is the owner's responsibility — confirm clearance before going live.

---

## Disclaimer

An independent portfolio project. **Not affiliated with, authorized, or endorsed by the WNBA or any team.** For demonstration purposes only.

## Documentation

- **[docs/HANDOFF.md](docs/HANDOFF.md)** — start here when resuming: what happened, what works, where it was interrupted, exact next steps.
- **[docs/MASTER_PROMPT.md](docs/MASTER_PROMPT.md)** — the original brief, reproduced verbatim.
- **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** — creative direction, tokens, typography, layout, motion, accessibility.
- **[docs/ROADMAP.md](docs/ROADMAP.md)** — detailed phase checklists and the pre-deployment list.
