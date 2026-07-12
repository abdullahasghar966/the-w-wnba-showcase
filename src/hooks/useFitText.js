import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * useFitText — scales a single line of text to fill its container's width,
 * capped at a maximum size so short names stay bold but not absurd, and
 * floored so long names stay readable.
 *
 * Why: the huge player surnames must read as graphic elements *and* remain
 * fully visible regardless of length ("CUNNINGHAM" vs "MILES"). A fixed
 * clamp() size can't do both — it clips long names off the viewport. This
 * measures the real rendered width (after the variable font loads) and sizes
 * each name to its own measure.
 *
 * Returns refs for the measuring container and the text element.
 */
export function useFitText({ maxFactor = 0.34, maxPx = 240, minPx = 34 } = {}) {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  const fit = useCallback(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const cw = container.clientWidth
    if (!cw) return

    const cap = Math.min(maxPx, cw * maxFactor)

    // Measure the text's natural (nowrap) width at the cap size.
    text.style.fontSize = `${cap}px`
    const naturalWidth = text.scrollWidth

    // If it overflows the container, scale down to fit; otherwise keep the cap.
    let size = cap
    if (naturalWidth > cw) {
      size = Math.max(minPx, cap * (cw / naturalWidth))
    }
    text.style.fontSize = `${size}px`
  }, [maxFactor, maxPx, minPx])

  useLayoutEffect(() => {
    fit() // run before paint to avoid a flash of oversized text

    const ro = new ResizeObserver(fit)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', fit)

    // Re-fit once the variable font has actually loaded (metrics change).
    let active = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => active && fit())
    }

    return () => {
      active = false
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [fit])

  return { containerRef, textRef }
}

export default useFitText
