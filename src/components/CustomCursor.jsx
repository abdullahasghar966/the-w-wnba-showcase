import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'

/**
 * CustomCursor — Phase 4 rendering polish.
 *
 * A two-part pointer: a hard bone dot that tracks 1:1, and a larger ring that
 * trails on a spring. Both use `mix-blend-mode: difference`, so a single bone
 * color inverts legibly over the ink field, the flame field, and photos alike
 * — no per-theme handling needed.
 *
 * Variants (driven by what's under the pointer):
 *   default → dot + trailing ring
 *   link    → ring expands over <a>/<button> (the "interactive" tell)
 *   drag    → ring widens and shows a DRAG label over the carousel track
 *   hidden  → both fade when the pointer leaves the window
 * A pressed state pulls the ring in for tactile feedback on mousedown.
 *
 * Gracefully absent when it shouldn't run: only mounts on fine pointers
 * (`pointer: fine`) and never under `prefers-reduced-motion`. On touch the
 * native cursor/scroll is untouched. Purely decorative → aria-hidden.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState('default')
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 40, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 380, damping: 40, mass: 0.6 })

  useEffect(() => {
    if (reduce) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    setEnabled(true)
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const hit = e.target.closest('a, button, [data-cursor]')
      if (!hit) return setVariant('default')
      setVariant(hit.dataset.cursor || 'link')
    }
    const leave = () => setVariant('hidden')
    const enter = () => setVariant('default')
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    root.addEventListener('mouseleave', leave)
    root.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      root.removeEventListener('mouseleave', leave)
      root.removeEventListener('mouseenter', enter)
      root.classList.remove('has-custom-cursor')
    }
  }, [reduce, x, y])

  if (!enabled) return null

  return (
    <div className="cursor-layer" aria-hidden="true">
      <motion.div className="cursor-track" style={{ x, y }}>
        <span className="cursor-dot" data-variant={variant} data-pressed={pressed} />
      </motion.div>
      <motion.div className="cursor-track" style={{ x: ringX, y: ringY }}>
        <span className="cursor-ring" data-variant={variant} data-pressed={pressed}>
          <span className="cursor-ring__label">DRAG</span>
        </span>
      </motion.div>
    </div>
  )
}
