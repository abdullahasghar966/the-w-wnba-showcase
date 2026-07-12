import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

/**
 * Parse a stat value into { prefix, num, decimals, suffix, animate }.
 *
 * Only genuine metrics count up. We skip years (2025), ordinals (No. 1) and
 * label-values (ROY, Elite, 2-Way) so the animation never reads as noise.
 * A value animates when it has a decimal, is >= 10, or carries a "×" suffix
 * (MVP tallies), and is under 1000 (excludes years).
 */
function parseStat(value) {
  const match = String(value).match(/-?\d+(\.\d+)?/)
  if (!match) return { animate: false, raw: value }

  const num = parseFloat(match[0])
  const decimals = match[0].includes('.') ? match[0].split('.')[1].length : 0
  const prefix = value.slice(0, match.index)
  const suffix = value.slice(match.index + match[0].length)

  const animate =
    Number.isFinite(num) &&
    num < 1000 &&
    (decimals > 0 || num >= 10 || suffix.trim().startsWith('×'))

  return { prefix, num, decimals, suffix, animate, raw: value }
}

export default function AnimatedNumber({ value, duration = 1.4 }) {
  const parsed = parseStat(value)
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })

  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => {
    const n = parsed.decimals ? v.toFixed(parsed.decimals) : Math.round(v).toString()
    return `${parsed.prefix ?? ''}${n}${parsed.suffix ?? ''}`
  })

  useEffect(() => {
    if (!parsed.animate) return
    if (reduce) {
      mv.set(parsed.num)
      return
    }
    if (inView) {
      const controls = animate(mv, parsed.num, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      })
      return controls.stop
    }
  }, [inView, reduce, parsed.animate, parsed.num, mv, duration])

  // Non-numeric or non-animating values render verbatim.
  if (!parsed.animate) return <span>{value}</span>

  // The changing text is decorative; aria-label exposes the true final value.
  return (
    <motion.span ref={ref} aria-label={value}>
      <motion.span aria-hidden="true">{text}</motion.span>
    </motion.span>
  )
}
