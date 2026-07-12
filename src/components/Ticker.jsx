/**
 * Ticker — a broadcast lower-third style strip of league headlines.
 * The track is duplicated so the CSS marquee loops seamlessly at -50%.
 * Motion is CSS-only and pauses on hover; prefers-reduced-motion freezes it.
 */
export default function Ticker({ items, theme = 'ink', reverse = false }) {
  const row = [...items, ...items]
  return (
    <div
      className="ticker"
      data-theme={theme}
      data-reverse={reverse ? 'true' : 'false'}
      role="marquee"
      aria-label="League headlines"
    >
      <div className="ticker__track">
        {row.map((item, i) => (
          <span className="ticker__item" key={i} aria-hidden={i >= items.length}>
            <span className="ticker__star" aria-hidden="true">✷</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
