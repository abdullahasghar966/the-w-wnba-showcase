import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * IntroBumper — Phase 4. A brief broadcast "bumper" that covers the viewport
 * on first load, runs a scoreboard-style count, then wipes upward via
 * AnimatePresence exit to reveal the hero. This is the AnimatePresence
 * showcase: the overlay unmounts with an orchestrated exit the layout can't
 * express with a plain transition.
 *
 * Guardrails:
 *   - Skipped entirely under prefers-reduced-motion (renders nothing, no delay).
 *   - Auto-dismisses (~1.5s); click/Esc skips it so it never traps the user.
 *   - Locks scroll only while visible, then restores.
 *   - aria-hidden — purely decorative; the real content is always in the DOM
 *     beneath it.
 */
export default function IntroBumper() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(!reduce)

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setShow(false), 1500)
    const skip = (e) => {
      if (e.type === 'click' || e.key === 'Escape') setShow(false)
    }
    window.addEventListener('click', skip)
    window.addEventListener('keydown', skip)
    return () => {
      clearTimeout(t)
      window.removeEventListener('click', skip)
      window.removeEventListener('keydown', skip)
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="bumper"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <motion.div
            className="bumper__inner"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <span className="bumper__kicker">2026 Season · Player Showcase</span>
            <span className="bumper__mark">
              THE <span className="bumper__w">W</span>
            </span>
            <span className="bumper__bar">
              <span className="bumper__bar-fill" />
            </span>
            <span className="bumper__count">Loading broadcast</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
