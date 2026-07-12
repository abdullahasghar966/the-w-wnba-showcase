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
export function useFitText({ maxFactor = 0.34, maxPx = 240, minPx = 28 } = {}) {
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

    // Corrective pass: the linear estimate above assumes width scales exactly
    // with font-size, but sub-pixel kerning/hinting at the new size can leave a
    // few px of overflow (most visible for the longest name on the narrowest
    // phones, e.g. "CUNNINGHAM" at 320px). Re-measure and nudge down once so the
    // name always fits its band instead of getting clipped by the section.
    if (size > minPx && text.scrollWidth > cw) {
      size = Math.max(minPx, size * (cw / text.scrollWidth))
      text.style.fontSize = `${size}px`
    }
  }, [maxFactor, maxPx, minPx])

  useLayoutEffect(() => {
    fit() // run before paint to avoid a flash of oversized text

    // Observe the name band AND the viewport width. The container observer
    // catches layout changes; watching the root element additionally catches
    // the ~15px width drop when the page's vertical scrollbar first appears
    // after images load — otherwise the initial fit (measured scrollbar-less)
    // leaves the longest names a hair too wide until the next resize.
    const ro = new ResizeObserver(fit)
    if (containerRef.current) ro.observe(containerRef.current)
    ro.observe(document.documentElement)
    window.addEventListener('resize', fit)

    // Re-fit once the variable font has actually loaded (metrics change), and
    // again after all resources settle. `scrollbar-gutter: stable` (styles.css)
    // keeps the band width constant, but on browsers without that support the
    // root observer + load re-fit still correct any scrollbar-driven shift.
    let active = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => active && fit())
    }
    const onLoad = () => active && fit()
    window.addEventListener('load', onLoad)

    return () => {
      active = false
      ro.disconnect()
      window.removeEventListener('resize', fit)
      window.removeEventListener('load', onLoad)
    }
  }, [fit])

  return { containerRef, textRef }
}

export default useFitText
