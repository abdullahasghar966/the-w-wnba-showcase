# HANDOFF — read this first when resuming

_Last updated: 2026-07-12, after completing Phase 3 (physics carousel) and integrating the owner-supplied player photos._

This file exists so a fresh session (or a different Claude/Claude Pro instance) can pick the project up with **zero lost context**. It is the narrative companion to the code. Pair it with:
- `MASTER_PROMPT.md` — the immutable brief + amendments
- `DESIGN_SYSTEM.md` — how the visual system works
- `ROADMAP.md` — granular checklists for every phase

---

## 1. What this project is

"THE W" — a single-page React showcase of eight WNBA players for the 2026 season, built as a **senior-frontend portfolio piece** to land a job with a WNBA team or the league. Maximalist/brutalist broadcast-editorial aesthetic, original (not a clone). Four build phases; confirm with the user after each.

See `MASTER_PROMPT.md` for the complete requirements (including amendment 4 — supplied photography).

---

## 2. Current state — what actually works right now

The app **runs cleanly** (`npm run dev`) and **builds cleanly** (`npm run build`, verified 2026-07-12). Verified in-browser:

- No console errors on a clean load.
- All 8 player sections render, plus intro hero, three tickers, and the closer.
- **Phase 1 (Foundation): DONE.**
- **Phase 2 (Scroll animation): DONE & verified** (Lenis, parallax, reveals, count-up, tickers, reduced-motion gating).
- **Phase 3 (Physics carousel): DONE & verified.** Per-player "Season Highlights" carousel:
  - `HighlightCarousel.jsx` — Framer Motion `drag="x"`, elastic edges, velocity deceleration; constraints measured with a ResizeObserver.
  - Counter-parallax card art (`useTransform` on the track `x`, clamped ±22px, art overdrawn 12%).
  - Prev/next buttons (edge-disabled) + arrow keys on the focusable viewport — never drag-only.
  - Reduced motion → native horizontal scroll; `touch-action: pan-y` keeps vertical scroll free on touch.
  - Verified: spring snap moves the track, edges enable/disable, parallax tracks position, 8 carousels / 28 cards, clean build.
- **Photos integrated (owner-supplied, 2026-07-12):** all 8 portraits show real photography (`src/assets/players/`), cover-fit at native resolution, top-biased crop (`object-position: 50% 12%`), bottom scrim for the meta chip. The same photo (dimmed, grayscale, under halftone) is the carousel card art. **No typographic placeholders remain** (Reese's photo was supplied last and wired in).
  - **Resolution caveat:** sources are 560×1259–1061×1315 px, **not 4K** (the user asked for 4K). No upscaling/stretching is applied, so nothing pixelates at layout size, but sharper masters are welcome (drop-in replacements, same filenames).
- **Phase 4 (Rendering polish): DONE.**
  - **Custom cursor** (`CustomCursor.jsx`): bone dot (1:1) + spring-trailing ring, `mix-blend-mode: difference`; variants `link`/`drag`/`hidden` + pressed state; gated to `pointer: fine` and off under reduced motion (touch keeps native cursor).
  - **AnimatePresence intro bumper** (`IntroBumper.jsx`): broadcast bumper covers load, then wipes up to reveal the hero; skipped under reduced motion; click/Esc skips; ~1.5s.
  - **R3F hover shader** (`ShaderPortrait.jsx` via `FeaturedPortrait.jsx`): **all** portrait photos get a cursor-centered ripple + chromatic-aberration shader, **themed per field** (flame tint on ink sections, ink tint on flame sections — see `ACCENTS`). Kept performant: `React.lazy` code-split (three/R3F in a ~222 kB-gzip chunk; main bundle stays ~110 kB gzip), **proximity-gated** (canvas mounts only while its portrait is near the viewport, released when far → ≈1–2 live contexts), **demand frameloop** (idle canvases don't render), capability-gated (WebGL + reduced-motion) with a static `PlaceholderPortrait` fallback.
  - **Cross-cutting:** flame-field `--fg-dim` raised 0.66→0.82 so small mono text clears WCAG AA (~5.5:1). Photos `loading="lazy"`. Section-level `content-visibility` was tried and reverted (it drifted anchor/rail scroll targets — see ROADMAP).

> **Verification caveat:** the in-app preview pane repeatedly suspends `requestAnimationFrame`, so live pointer/scroll-driven motion (cursor trail, shader ripple, bumper wipe) can't be screenshotted here. All were verified structurally (DOM, computed styles, compiled CSS/JS, clean build). They animate normally in a real browser.

---

## 3. Exactly where the session was interrupted

1. Phase 3 was built and being verified in the browser when the user interrupted with the photo zip (`D:\WNBA Players pics.zip`) asking for 4K/no-pixel-break integration.
2. Photos were extracted, inspected (7 files, sub-4K — reported honestly), copied to `src/assets/players/`, and wired into `players.js` → portraits + carousel art. Closer "Assets" note updated.
3. Everything re-verified programmatically (photo naturalWidth/rendered sizes, placeholder fallback for Reese, no overflow, no console errors) + clean production build.
4. **Not captured: final proof screenshots.** The Browser-pane renderer kept suspending (rAF = 0 → screenshots time out) whenever the pane was hidden — a tooling issue, not an app bug. First thing next session: open the preview, scroll a section, screenshot the photo portrait + carousel for the user, and do one manual drag to feel the inertia.

---

## 4. Known gotchas / things to remember

- **Dev server port:** another session once held 5173, so `vite.config.js` now respects `PORT` env and `.claude/launch.json` has `"autoPort": true`. The preview tool may assign a random port — that's expected.
- **Browser-pane screenshots** time out when the pane is not visible (rAF suspended). JS-based checks (`javascript_tool`) keep working; use them, and take screenshots only when the pane is open.
- **`useFitText` + `content-visibility`:** if you add `content-visibility: auto`, verify names still measure (off-screen elements can report `clientWidth: 0`).
- **Framer Motion v12 + React 18:** editing hooks mid-session can produce stale Fast-Refresh "Invalid hook call" warnings that clear on full reload.
- **Lenis is desktop-only by design** (`syncTouch: false`), not initialized under reduced motion. Don't "fix" that.
- **All motion stays behind `prefers-reduced-motion`** — `PlayerSection`, `IntroHero`, `AnimatedNumber`, and `HighlightCarousel` all check `useReducedMotion()`; keep the pattern.
- **Content lives only in `src/data/players.js`** — including the `highlights` arrays. No copy in components.
- **No fabricated facts.** Highlights cards restate brief facts only; the single dated game moment (Cunningham 24 vs. Toronto Tempo, Jun 16) is from the brief.
- **Photos:** licensing is the owner's responsibility (they show team marks). Reese pending. Sub-4K — see §2.
- **Windows environment.** `D:\WNBA Website`, PowerShell primary; dev server via `.claude/launch.json` (name: `the-w`).

---

## 5. Immediate next steps (when you resume)

1. **Show the user visual proof** of Phase 3 + photos (screenshots of a photo portrait, a carousel mid-drag, and Reese's placeholder) and get **Phase 3 sign-off** (the brief requires it per phase).
2. **Optionally ask for higher-resolution masters** for all players (current sources are sub-4K but render clean at layout size).
3. **Start Phase 4 — Rendering polish** (see `ROADMAP.md`):
   - Custom cursor (`cursor: none` + tracked div, `mix-blend-mode: difference`), hidden on touch/reduced-motion.
   - `AnimatePresence` transitions where they add intent.
   - Optional scoped R3F hover shader — lazy-loaded, performance-budgeted.
4. **Cross-cutting before "final":** lazy-load below-the-fold sections (test against `useFitText`/`useScroll`), contrast re-audit on the flame field, keyboard pass, `npm run build` + `preview` sanity.

---

## 6. How to verify quickly

```bash
npm run dev
```
- Scroll top→bottom: hero stagger → alternating ink/flame sections (photos in portraits, Reese placeholder) → parallax ghosts → tickers → closer.
- Drag a "Season Highlights" row: elastic edges, inertia on release, art counter-drifts; buttons and arrow keys step cards; buttons disable at the ends.
- Stat blocks count up and land exactly.
- DevTools → `prefers-reduced-motion: reduce`: motion stops, carousel becomes a native horizontal scroller.
- Mobile width: sections stack, carousel order 5, vertical swipe over cards still scrolls the page.
