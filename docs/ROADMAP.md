# ROADMAP — phase checklists & pre-deploy

Granular status for every phase. `[x]` done · `[ ]` todo. The brief requires **user sign-off after each phase** before starting the next.

---

## ✅ Phase 1 — Foundation (DONE)

- [x] React app scaffolded with Vite (component-based, `type: module`).
- [x] Clean file structure: `/components`, `/data`, `/hooks` (no `/assets` yet — all imagery is CSS/SVG placeholder, add `/assets` when licensed photos arrive).
- [x] Design tokens in `styles.css` (`:root` + `data-theme` ink/flame blocks).
- [x] CSS-Grid hero layout per player section with Z-axis overlap.
- [x] Oversized `clamp()`-scaled typography as structural/background graphic (ghost surnames + fit-to-width foreground names).
- [x] Static baseline that looks intentional and complete even frozen.
- [x] All 8 player sections laid out, scrollable.
- [x] Responsive at mobile / tablet / desktop (stacking, rail hide, no horizontal overflow).
- [x] Single structured data source (`src/data/players.js`) — no scattered copy.

---

## ✅ Phase 2 — Scroll-Triggered Animation (DONE & verified)

- [x] Lenis momentum smooth-scroll (`useSmoothScroll.js`), desktop-only, reduced-motion aware, native touch preserved.
- [x] Eased in-page anchor navigation via `lenis.scrollTo`.
- [x] Framer Motion `useScroll` + `useTransform` per section → ghost horizontal drift + portrait vertical float.
- [x] Staggered reveal cascade (head → name → portrait → info) with `whileInView`.
- [x] Orchestrated hero load stagger.
- [x] Stat numbers count up on viewport entry (`AnimatedNumber`), landing on exact values; non-metrics render verbatim.
- [x] Animated ticker marquee (CSS), hover-pause, reduced-motion freeze.
- [x] All motion gated behind `prefers-reduced-motion`.
- [x] Verified in browser: no real console errors, counters correct, 8 sections, Lenis + ticker active.

**Post-Phase-2 user change (done):** giant portrait number switched from 01–08 index to **real jersey number**; all player numbers are their actual documented numbers.

---

## ✅ Phase 3 — Physics-Based Carousel (DONE & verified 2026-07-12)

Goal: a per-player "Season Highlights" horizontal, draggable carousel with real physics + depth.

- [x] `highlights` array per player in `players.js` (3–4 cards each, 28 total). All factual — the only dated game moment is Cunningham's "24 vs. Toronto Tempo, Jun 16" (in the brief); everything else restates brief facts.
- [x] `HighlightCarousel` component using Framer Motion: `drag="x"`, `dragElastic: 0.16`, measured `dragConstraints` (ResizeObserver re-measures), velocity deceleration via `dragTransition` (`power`/`timeConstant`/bounce).
- [x] Counter-parallax: card art layer maps track `x` → opposite `x` via `useTransform`, clamped to ±22px with 12% art overdraw so no gaps show.
- [x] Cards use the portrait visual language: supplied player photo (dimmed, grayscale, under halftone) where available, ghost jersey number, keyline corners, hard offset shadow. Reese's cards stay graphic-only (no photo supplied).
- [x] Same carousel reused for all 8 players (data-driven).
- [x] Touch: `touch-action: pan-y` so horizontal drag never traps vertical scroll; reduced motion swaps physics for native horizontal scroll (`overflow-x: auto`).
- [x] Keyboard: prev/next buttons (disabled at edges) + ArrowLeft/ArrowRight on the focusable viewport; `aria-roledescription="carousel"`.
- [x] Verified in-browser: buttons animate the track with spring snap, edges enable/disable correctly, counter-parallax tracks drag position, 8 carousels / 28 cards render, no console errors, clean `npm run build`.

---

## ✅ Phase 4 — Rendering Polish (DONE)

- [x] **Custom cursor** (`CustomCursor.jsx`): bone dot (1:1) + spring-trailing ring, both `mix-blend-mode: difference` so one color inverts over ink/flame/photos. Variants: `link` (blooms over a/button), `drag` (widens to a pill with a DRAG label over the carousel track), `hidden` (pointer leaves window), plus a pressed state. JS-gated to `pointer: fine` and never under reduced motion → touch keeps the native cursor. Verified: mounts, hides native cursor, blend mode active, variant switching correct, all rules in compiled CSS. (Live pointer motion can't be shown in the preview pane — its rAF is suspended — but works in a real browser.)
- [x] **`AnimatePresence` intro bumper** (`IntroBumper.jsx`): a broadcast bumper covers the viewport on load, runs a scoreboard fill, then wipes up via AnimatePresence exit to reveal the hero. Skipped under reduced motion; auto-dismisses ~1.5s; click/Esc skips; restores scroll.
- [x] **React Three Fiber hover shader** (`ShaderPortrait.jsx` + `FeaturedPortrait.jsx`): every player photo becomes a texture on a plane with a cursor-centered ripple + chromatic-aberration shader, **themed to its field** — warm flame tint on ink sections, ink tint on flame sections. Kept performant: **lazy-loaded** via `React.lazy` (three/R3F in a separate `ShaderPortrait` chunk — main bundle stays ~110 kB gzip); **proximity-gated** so a canvas mounts only while its portrait is near the viewport and is released when it scrolls away (≈1–2 live WebGL contexts at a time, well under budget); **demand frameloop** so idle/un-hovered canvases don't touch the GPU; **capability-gated** behind WebGL + reduced-motion → static `PlaceholderPortrait` fallback. Verified: shader mounts (ink + flame), single live canvas, main bundle unaffected, no console errors.
- [ ] Deliverable: confirm with user (live shader/cursor motion only visible in a real browser — the preview pane suspends rAF).

---

## ⬜ Cross-cutting requirements (verify before "final")

- [x] **Performance:** the heavy assets lazy-load — portrait photos are `loading="lazy"`, and three/R3F is `React.lazy` code-split **and** proximity-gated (mounts per portrait near the viewport, releases when far). Animation libs stay scoped (Lenis/Framer only where used). _Note:_ section-level `content-visibility: auto` was tried and **removed** — off-screen sections fall back to estimated heights, which drifted the rail/anchor scroll targets; the marginal paint saving on lightweight text sections wasn't worth breaking in-page navigation.
- [x] **Accessibility:** contrast re-audited on the flame field — flame `--fg-dim` raised 0.66→0.82 so small mono text (meta, stat-note) clears WCAG AA (now ~5.5:1; was 4.01:1). Ink field verified 6:1+. All motion still gated behind `prefers-reduced-motion`; carousel keyboard-operable.
- [ ] **Responsive:** re-check every phase's additions at mobile/tablet/desktop; no scroll-jacking on touch.
- [x] **Build:** `npm run build` clean (main bundle ~110 kB gzip; three/R3F in a separate lazy chunk).
- [x] **Portrait framing:** each photo has a per-player focal point + zoom (`focusX`/`focusY`/`zoom` in `players.js`) applied identically to the static `object-position`/`transform` and the shader cover-map, so full-body shots keep the face in frame (fixed a `flipY` inversion that was showing lower bodies in the shader).

---

## 🚀 Pre-deployment checklist

- [x] **All 8 player photos supplied** (owner-provided 2026-07-12) and wired into portraits + carousel art. No typographic placeholders remain.
- [ ] **Confirm licensing of the supplied photos.** They show team marks/jerseys — clearance is the owner's responsibility.
- [ ] **Upgrade photo resolution if possible.** Current sources are 560×1259–1061×1315 px (not 4K). Rendered cover-fit at native res with no upscaling, so no pixelation at layout size — but true 4K masters would be sharper on high-DPI displays.
- [ ] **Verify jersey numbers vs. the real 2026 roster.** Especially **Olivia Miles** (no WNBA number on record yet — currently her college `5`). The brief's team assignments are forward-looking; confirm each number/team pairing.
- [ ] Double-check all stats still match `MASTER_PROMPT.md` section 2 (nothing drifted, nothing fabricated).
- [ ] Keep the **"not affiliated with the WNBA"** disclaimer (in `Closer` + README).
- [ ] Set real meta/OG tags and a favicon before hosting.
- [ ] Deploy target: any static host (Vercel/Netlify/GitHub Pages) — it's a static Vite build.
