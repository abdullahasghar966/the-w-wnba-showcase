/**
 * Grain — a fixed, non-interactive film-grain overlay for texture.
 *
 * The noise is a small pre-rendered SVG turbulence tile applied as a repeating
 * background (see .grain in styles.css). Rendering the turbulence once into a
 * tile — rather than a live full-viewport filter — keeps it essentially free
 * to composite.
 */
export default function Grain() {
  return <div className="grain" aria-hidden="true" />
}
