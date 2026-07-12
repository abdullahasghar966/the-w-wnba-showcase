import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

/**
 * HighlightCarousel — the Phase 3 physics carousel ("Season Highlights").
 *
 * - Framer Motion `drag="x"` with measured constraints, elastic edges, and
 *   velocity-based deceleration (`dragTransition` power/timeConstant).
 * - Counter-parallax: each card's art layer translates against the track so
 *   the halftone/number field reads a step deeper than the copy.
 * - Never drag-only: prev/next buttons plus ArrowLeft/ArrowRight on the
 *   focused viewport step card-by-card.
 * - Reduced motion: physics drag is replaced by native horizontal scroll.
 * - Touch: `touch-action: pan-y` keeps vertical page scrolling free.
 *
 * Card content comes from players.js (`highlights[]`) — factual copy only.
 */

const SNAP_SPRING = { type: 'spring', stiffness: 240, damping: 32 }

export default function HighlightCarousel({ player }) {
  const reduce = useReducedMotion()
  const viewportRef = useRef(null)
  const trackRef = useRef(null)

  const x = useMotionValue(0)
  const [bounds, setBounds] = useState({ min: 0, step: 0 })
  const boundsRef = useRef(bounds)
  boundsRef.current = bounds
  const hasOverflow = bounds.min < -1

  // Counter-parallax, clamped to a fixed travel so the art overdraw covers it.
  const artX = useTransform(x, [bounds.min, 0], [22, -22])

  const measure = useCallback(() => {
    const vp = viewportRef.current
    const track = trackRef.current
    if (!vp || !track) return
    const min = Math.min(0, vp.clientWidth - track.scrollWidth)
    const kids = track.children
    const step =
      kids.length > 1
        ? kids[1].offsetLeft - kids[0].offsetLeft
        : kids[0]?.offsetWidth || 0
    setBounds((b) => (b.min === min && b.step === step ? b : { min, step }))
    if (x.get() < min) x.set(min)
  }, [x])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [measure])

  // Edge state drives the prev/next disabled affordances.
  const [edges, setEdges] = useState({ start: true, end: false })
  const syncEdges = useCallback((pos, min) => {
    const start = pos >= -2
    const end = pos <= min + 2
    setEdges((p) => (p.start === start && p.end === end ? p : { start, end }))
  }, [])
  useMotionValueEvent(x, 'change', (v) => syncEdges(v, boundsRef.current.min))

  const onNativeScroll = () => {
    const vp = viewportRef.current
    if (vp) syncEdges(-vp.scrollLeft, vp.clientWidth - vp.scrollWidth)
  }

  const go = (dir) => {
    const { min, step } = boundsRef.current
    if (!step) return
    if (reduce) {
      viewportRef.current?.scrollBy({ left: dir * step })
      return
    }
    const idx = Math.round(-x.get() / step) + dir
    const target = Math.max(min, Math.min(0, -idx * step))
    animate(x, target, SNAP_SPRING)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const highlights = player.highlights || []
  if (!highlights.length) return null
  const total = String(highlights.length).padStart(2, '0')

  return (
    <div className="highlights" data-native={reduce ? 'true' : undefined}>
      <header className="highlights__head">
        <span className="highlights__kicker">Season Highlights</span>
        {hasOverflow && (
          <span className="highlights__hint" aria-hidden="true">
            {reduce ? 'scroll →' : '← drag →'}
          </span>
        )}
        {hasOverflow && (
          <div className="highlights__nav">
            <button
              type="button"
              className="highlights__btn"
              onClick={() => go(-1)}
              disabled={edges.start}
              aria-label={`Previous highlight — ${player.fullName}`}
            >
              ←
            </button>
            <button
              type="button"
              className="highlights__btn"
              onClick={() => go(1)}
              disabled={edges.end}
              aria-label={`Next highlight — ${player.fullName}`}
            >
              →
            </button>
          </div>
        )}
      </header>

      <div
        ref={viewportRef}
        className="highlights__viewport"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${player.fullName} — season highlights`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={reduce ? onNativeScroll : undefined}
      >
        <motion.ul
          ref={trackRef}
          className="highlights__track"
          role="list"
          data-cursor={!reduce && hasOverflow ? 'drag' : undefined}
          style={reduce ? undefined : { x, touchAction: 'pan-y' }}
          drag={!reduce && hasOverflow ? 'x' : false}
          dragConstraints={{ left: bounds.min, right: 0 }}
          dragElastic={0.16}
          dragTransition={{
            power: 0.32,
            timeConstant: 340,
            bounceStiffness: 220,
            bounceDamping: 34,
          }}
        >
          {highlights.map((h, i) => (
            <li className="highlights__card" key={`${player.id}-hl-${i}`}>
              {/* card art: supplied photo when present, placeholder treatment otherwise */}
              <motion.div
                className="highlights__art"
                style={reduce || !hasOverflow ? undefined : { x: artX }}
                aria-hidden="true"
              >
                {player.portrait?.src && (
                  <img
                    className="highlights__art-photo"
                    src={player.portrait.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                )}
                <span className="highlights__art-halftone" />
                <span className="highlights__art-num">
                  {player.jersey != null ? player.jersey : player.index}
                </span>
              </motion.div>

              <div className="highlights__body">
                <div className="highlights__meta">
                  <span className="highlights__tag">{h.tag}</span>
                  <span className="highlights__count">
                    {String(i + 1).padStart(2, '0')}/{total}
                  </span>
                </div>
                <span className="highlights__stat">{h.stat}</span>
                <h3 className="highlights__title">{h.title}</h3>
                <p className="highlights__detail">{h.detail}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
