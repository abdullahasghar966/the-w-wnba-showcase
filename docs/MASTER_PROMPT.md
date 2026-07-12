# MASTER PROMPT (verbatim)

> This is the original brief that defines the project, reproduced exactly as supplied.
> It is the source of truth for scope, content, and constraints. If anything in the
> build conflicts with this document, this document wins (unless the user has since
> given a newer instruction — see `HANDOFF.md` for amendments made during the session).

---

# MASTER PROMPT: "THE W" — WNBA Player Showcase (Portfolio Build)

Paste everything below this line into Claude Fable 5 to build the project.

---

## ROLE & OBJECTIVE

You are building a portfolio-grade, Awwwards-caliber interactive website showcasing top current WNBA players. This is a real, code-based single-page application meant to demonstrate senior-level frontend craft to land a job with a WNBA team or the league office. It must be original work, not a clone — inspired by maximalist/brutalist scroll-driven web design, but with its own identity built around the WNBA's actual brand energy.

**Before writing any code, use your skills.** Check available skills for frontend design guidance (design tokens, layout rules, typographic scale, spacing systems) and follow that guidance for every visual decision. If a "frontend-design" or equivalent skill is available, load and apply it before generating components — do not default to generic templated UI. Treat this as non-negotiable: intentional design decisions only, nothing that looks like a stock template.

Work in **phases**. Complete and verify each phase before moving to the next. Show me a working build after every phase, not just at the end.

---

## 1. CREATIVE DIRECTION

- **Name:** "THE W"
- **Palette:** High-contrast maximalist. Use WNBA-adjacent orange (#FF6900-ish family) and deep navy/black as the primary structural colors — not a literal copy of any single team's palette. Pure black text/structure on the bold color field, white accents.
- **Typography:** Oversized, tight-leading grotesque sans-serif (e.g. a variable font like Inter, Neue Montreal, or General Sans) used as a structural/background element, not just body copy. Player names should be huge enough to double as graphic elements.
- **Tone:** Confident, kinetic, athletic — not delicate. Sharp edges over rounded corners. Motion should feel powerful, not cutesy.
- **Layout engine:** CSS Grid for overlapping/Z-axis composition. Fluid sizing via `clamp()` and viewport units — no fixed breakpoint-only sizing for hero type.

---

## 2. PLAYER ROSTER (8 players — real, current, 2026 season)

Use these as the factual backbone for stat blocks and bios. Keep copy factual and respectful — no fabricated quotes attributed to these real people.

1. **A'ja Wilson** — Las Vegas Aces, Forward/Center. 4x MVP, reigning 2025 MVP, highest-paid player in the league on a supermax contract. Anchor/hero player — should open the experience.
2. **Caitlin Clark** — Indiana Fever, Guard. Career-high 21.2 PPG, 8.2 APG this season, 3x All-Star starter, cultural flashpoint for the league's growth.
3. **Paige Bueckers** — Dallas Wings, Guard. 2025 Rookie of the Year, led all fan voting for the 2026 All-Star Game, top-10 in points/assists/steals as a rookie.
4. **Breanna Stewart** — New York Liberty, Forward. 2x MVP, 2x Finals MVP, engine of the Liberty's championship core.
5. **Napheesa Collier** — Minnesota Lynx, Forward. 2025 MVP runner-up, elite two-way player.
6. **Angel Reese** — Atlanta Dream, Forward. Rebounding force, one of the league's biggest cultural draws.
7. **Olivia Miles** — Minnesota Lynx, Guard. 2026 Rookie of the Year frontrunner, No. 2 overall pick, pacing all rookies in scoring and assists.
8. **Sophie Cunningham** — Indiana Fever, Guard. Veteran sixth-player spark; through 19 games this season averaging 9.5 PPG, 2.5 RPG, 1.4 APG on 49.1% FG / 42.9% 3PT, a leading contender for Sixth Player of the Year, season-high 24 points vs. Toronto Tempo on June 16.

For each player, structure content as:
- Full name, team, position, jersey number if known
- 1-2 headline stat lines (season averages / signature achievement)
- 2-3 sentence bio focused on their current-season story arc
- A "why she matters" line — the cultural/competitive significance angle
- Placeholder image slots (clearly labeled `/* replace with licensed photo */`) — do not attempt to source or embed real photos of these athletes without proper licensing; use styled placeholder blocks with the player's name/number as graphic content until real assets are supplied

---

## 3. PHASED BUILD PLAN

### Phase 1 — Foundation
- React app (Vite), component-based structure
- CSS Grid hero layout per player section, oversized clamp()-scaled typography as background graphic
- Static, fully responsive layout with no animation yet — must look intentional and complete even frozen
- Deliverable: all 8 player sections laid out, scrollable, responsive at mobile/tablet/desktop

### Phase 2 — Scroll-Triggered Animation
- Replace native scroll with a smooth-scroll interpolator (e.g. Lenis) for physical momentum
- Use Framer Motion `useScroll` + `useTransform` to map scroll progress (0→1) to transform/scale/opacity per section
- Animate stat numbers counting up as they enter viewport
- Deliverable: full scroll-through feels kinetic and intentional, not gratuitous

### Phase 3 — Physics-Based Carousel
- Per-player "Season Highlights" horizontal draggable carousel (`drag="x"`, `dragElastic`, velocity-based deceleration)
- Counter-parallax on card imagery relative to drag position for depth
- Deliverable: at least one fully working draggable carousel, reused per player

### Phase 4 — Rendering Polish
- Custom cursor (`cursor: none` + tracked div, `mix-blend-mode: difference`)
- Animated route/section transitions (Framer Motion `AnimatePresence`)
- Optional: React Three Fiber canvas for a subtle shader/distortion effect on hover for hero imagery — keep this scoped and performant, not a gimmick
- Deliverable: polish pass that doesn't hurt performance or accessibility

---

## 4. TECHNICAL REQUIREMENTS

- React + Vite, component-based, clean file structure (`/components`, `/data`, `/assets`)
- Player data pulled from a single structured `players.js`/`players.json` file — no hardcoded content scattered across components
- Fully responsive: this must work and look intentional on mobile, not just desktop
- Performance-conscious: lazy-load below-the-fold sections, keep animation libraries scoped to what's needed
- Accessibility: respect `prefers-reduced-motion`, maintain readable contrast ratios despite the bold palette, semantic HTML under the visual layer
- No broken scroll-jacking on mobile — scroll hijacking effects should degrade gracefully to normal scroll on touch devices if needed

---

## 5. WHAT TO AVOID

- Do not fabricate quotes, statistics, or achievements not listed above
- Do not use any real copyrighted WNBA logos, team marks, or licensed photography — use original typographic/graphic treatment instead
- Do not over-engineer Phase 4 effects at the expense of load performance or usability
- Do not ship a design that looks like a generic template — every layout decision should feel considered

---

## 6. FINAL DELIVERABLE

A working, deployable React site with all 8 players, fully responsive, with the four phases implemented and verified. Confirm after each phase before proceeding to the next, and flag any place where a real photo/logo asset needs to be swapped in by the user before deployment.

---

## Amendments made after the original brief (during the build session)

These are user instructions given *after* the master prompt. They take precedence over the corresponding original wording:

1. **Giant player number = real jersey number, not the 01–08 roster index.** The huge number on each portrait now shows the player's actual jersey number. (Requested mid–Phase 2.)
2. **All player numbers must be their real/actual numbers** — stats stay verbatim from the brief; jersey numbers are the players' documented real numbers. See `HANDOFF.md` and `README.md` for the verification caveat on Olivia Miles.
3. **Font note:** The brief suggested Inter as one option, but the loaded `frontend-design` skill explicitly discourages generic fonts (Inter/Roboto/Arial). We chose `Archivo` (variable, expanded+black axes) + `Martian Mono` instead — still an oversized grotesque used structurally, honoring the intent.
4. **Owner-supplied photography (2026-07-12).** The user supplied player photos and asked for them to be used "in 4K resolution with no pixel break." All **8 players** now have photos (7 via an initial zip, Angel Reese added separately) at **560×1259 to 1061×1315 px — not 4K**. They are integrated at full native resolution, cover-fit (no stretching/upscaling), in portraits and carousel card art. No typographic placeholders remain. This supersedes the original "placeholder blocks only" wording; photo licensing remains the owner's responsibility.
