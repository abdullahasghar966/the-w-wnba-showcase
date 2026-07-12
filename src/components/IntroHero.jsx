import { motion, useReducedMotion } from 'framer-motion'

/**
 * IntroHero — the opening statement. A full-viewport orange field with the
 * oversized "THE W" wordmark used as a structural graphic. On load, elements
 * reveal in an orchestrated stagger (neutralized under reduced motion).
 */
export default function IntroHero() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  }
  const item = {
    hidden: { opacity: 0, y: 44 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  }
  const wItem = {
    hidden: { opacity: 0, y: 60, scale: 0.94 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  }

  const stage = reduce
    ? {}
    : { variants: container, initial: 'hidden', animate: 'show' }
  const rise = reduce ? {} : { variants: item }
  const riseW = reduce ? {} : { variants: wItem }

  return (
    <section className="hero" id="top" data-theme="flame" aria-label="Introduction">
      <motion.div className="hero__grid" {...stage}>
        <motion.p className="hero__kicker" {...rise}>
          <span>Women’s National Basketball Assoc.</span>
          <span>2026 · Vol. 01</span>
        </motion.p>

        <h1 className="hero__title">
          <motion.span className="hero__the" {...rise}>THE</motion.span>
          <motion.span className="hero__w" {...riseW}>W</motion.span>
        </h1>

        <motion.p className="hero__sub" {...rise}>
          Eight players rewriting what the league is —{' '}
          <em>and how far it can go.</em>
        </motion.p>

        <motion.div className="hero__foot" {...rise}>
          <p className="hero__lede">
            A showcase of the athletes defining the 2026 season: the MVPs, the
            record-breakers, and the rookies already bending the sport around
            them.
          </p>
          <a className="hero__cue" href="#aja-wilson" aria-label="Scroll to begin">
            <span className="hero__cue-label">Scroll</span>
            <span className="hero__cue-line" aria-hidden="true" />
            <span className="hero__cue-arrow" aria-hidden="true">↓</span>
          </a>
        </motion.div>
      </motion.div>

      <span className="hero__edge hero__edge--l" aria-hidden="true">EST. 1996</span>
      <span className="hero__edge hero__edge--r" aria-hidden="true">PORTFOLIO BUILD</span>
    </section>
  )
}
