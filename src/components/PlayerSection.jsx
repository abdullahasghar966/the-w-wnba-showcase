import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import FeaturedPortrait from './FeaturedPortrait.jsx'
import StatBlock from './StatBlock.jsx'
import HighlightCarousel from './HighlightCarousel.jsx'
import useFitText from '../hooks/useFitText.js'

/**
 * PlayerSection — one full-height player feature.
 *
 * Composition (12-col grid, Z-axis overlap):
 *   layer 0 — bleeding outline "ghost" surname (scroll-linked horizontal drift)
 *   layer 1 — portrait placeholder (scroll-linked vertical float)
 *   layer 2 — stat-sheet info column
 *   row 4  — "Season Highlights" physics carousel (Phase 3)
 *
 * Motion:
 *   - continuous parallax mapped from the section's own scroll progress
 *   - a staggered reveal cascade (head → name → portrait → info) on entry
 *   - all neutralized under prefers-reduced-motion
 */
export default function PlayerSection({ player, theme, align, priority = false }) {
  const num = String(player.index).padStart(2, '0')
  const { containerRef, textRef } = useFitText()
  const reduce = useReducedMotion()

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Continuous parallax (constant when reduced motion is on).
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? ['0px', '0px'] : ['36px', '-36px'])

  // Reveal orchestration.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
  }
  const item = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  const gridMotion = reduce
    ? {}
    : {
        variants: container,
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once: true, margin: '-15% 0px' },
      }
  const itemMotion = reduce ? {} : { variants: item }

  return (
    <section
      ref={sectionRef}
      className="player"
      id={player.id}
      data-theme={theme}
      data-align={align}
      aria-labelledby={`${player.id}-name`}
    >
      {/* Layer 0 — ghost surname */}
      <div className="player__ghostwrap" aria-hidden="true">
        <motion.span className="player__ghost" style={{ x: ghostX }}>
          {player.lastName}
        </motion.span>
      </div>

      <motion.div className="player__grid" {...gridMotion}>
        {/* Header row */}
        <motion.div className="player__head" {...itemMotion}>
          <span className="player__index">
            {num}
            <span className="player__index-total">/08</span>
          </span>
          <span className="player__role">{player.accentRole}</span>
          <span className="player__meta">
            {player.team} · {player.position}
          </span>
        </motion.div>

        {/* Name block — full-width band, auto-fit for full visibility */}
        <motion.hgroup className="player__names" ref={containerRef} {...itemMotion}>
          <p className="player__first">{player.firstName}</p>
          <h2 className="player__last" id={`${player.id}-name`} ref={textRef}>
            {player.lastName}
          </h2>
        </motion.hgroup>

        {/* Portrait — each gets the R3F hover shader, themed to its field,
            gated by capability + proximity (static fallback otherwise) */}
        <motion.div className="player__portrait" {...itemMotion}>
          <motion.div style={{ y: portraitY }}>
            <FeaturedPortrait player={player} theme={theme} eager={priority} />
          </motion.div>
        </motion.div>

        {/* Info column */}
        <motion.div className="player__info" {...itemMotion}>
          <StatBlock stats={player.stats} />
          {player.note && <p className="player__stat-note">{player.note}</p>}

          <p className="player__bio">{player.bio}</p>

          <div className="player__why">
            <span className="player__why-tag">Why she matters</span>
            <p className="player__why-text">{player.whyMatters}</p>
          </div>
        </motion.div>

        {/* Season highlights — Phase 3 physics carousel */}
        <motion.div className="player__highlights" {...itemMotion}>
          <HighlightCarousel player={player} />
        </motion.div>
      </motion.div>
    </section>
  )
}
