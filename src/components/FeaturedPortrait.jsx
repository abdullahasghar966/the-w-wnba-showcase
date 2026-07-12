import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import PlaceholderPortrait from './PlaceholderPortrait.jsx'

/**
 * FeaturedPortrait — capability + proximity gate for the R3F ShaderPortrait.
 *
 * Every player photo *can* get the hover shader, but we protect load and the
 * browser's WebGL-context budget:
 *   - capability gate: a **fine pointer** (real mouse — the ripple is a hover
 *     effect, so it's meaningless on touch), real GPU (WebGL), motion allowed,
 *     and a photo exists. On phones/tablets none of that holds, so they get the
 *     plain static <img> portrait (fast, correct) and the ~800 kB `three` chunk
 *     never downloads. This also avoids the WebGL context-loss thrash that a
 *     grid of canvases causes on mobile GPUs.
 *   - proximity gate: the shader is mounted only while the portrait is near
 *     the viewport (IntersectionObserver, toggling both ways) and released
 *     when it scrolls away. That keeps at most a couple of live WebGL contexts
 *     regardless of roster size — well under the browser's context budget.
 *     The static portrait shows the same photo/crop, so the swap is seamless.
 *     Combined with ShaderPortrait's demand frameloop, off-screen/idle
 *     portraits cost ~0.
 *
 * `eager` marks the first (above-the-fold anchor) portrait so its photo fetches
 * immediately at high priority instead of lazily.
 *
 * Suspense fallback is the identical static portrait, so there's no flash.
 */
const ShaderPortrait = lazy(() => import('./ShaderPortrait.jsx'))

// Probe once and cache — each call would otherwise spin up a throwaway WebGL
// context, and this component renders once per portrait.
let webglSupport
function hasWebGL() {
  if (webglSupport !== undefined) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    webglSupport = false
  }
  return webglSupport
}

// The ripple shader is a pointer-hover effect — only meaningful with a real
// mouse. Gating on it keeps the whole WebGL path (and its ~800 kB chunk) off
// touch devices entirely.
function hasFinePointer() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches
  )
}

export default function FeaturedPortrait({ player, theme = 'ink', eager = false }) {
  const reduce = useReducedMotion()
  const slotRef = useRef(null)
  const [capable, setCapable] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    setCapable(
      !reduce && !!player.portrait?.src && hasFinePointer() && hasWebGL()
    )
  }, [reduce, player])

  useEffect(() => {
    if (!capable || !slotRef.current) return
    // immediate geometry check: covers a portrait already in view at mount
    // (deep link / reload mid-page) without waiting on an observer callback.
    const inView = () => {
      const r = slotRef.current?.getBoundingClientRect()
      return !!r && r.top < window.innerHeight + 200 && r.bottom > -200
    }
    if (inView()) setNear(true)

    if (!('IntersectionObserver' in window)) {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => setNear(entries[0].isIntersecting),
      { rootMargin: '200px 0px' }
    )
    io.observe(slotRef.current)
    return () => io.disconnect()
  }, [capable])

  return (
    <div ref={slotRef} className="portrait-slot">
      {capable && near ? (
        <Suspense fallback={<PlaceholderPortrait player={player} eager={eager} />}>
          <ShaderPortrait player={player} theme={theme} eager={eager} />
        </Suspense>
      ) : (
        <PlaceholderPortrait player={player} eager={eager} />
      )}
    </div>
  )
}
