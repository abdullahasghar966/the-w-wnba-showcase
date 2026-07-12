/**
 * SiteFrame — the persistent "broadcast" chrome that frames the whole page:
 *  - top header bar (wordmark + season tag + roster count)
 *  - fixed vertical progress rail (01–08) on the right
 *
 * Phase 1: purely static / structural. The rail's active-state and scroll
 * progress get wired up in Phase 2.
 */
export default function SiteFrame({ players }) {
  return (
    <>
      <header className="frame-header" aria-label="Site header">
        <a className="frame-header__mark" href="#top" aria-label="THE W — home">
          <span className="frame-header__the">THE</span>
          <span className="frame-header__w">W</span>
        </a>
        <p className="frame-header__tag">
          <span className="dot" aria-hidden="true" />
          2026 SEASON · PLAYER SHOWCASE
        </p>
        <p className="frame-header__count">
          <span>08</span>
          <span className="frame-header__count-label">Players</span>
        </p>
      </header>

      <nav className="rail" aria-label="Player index">
        <span className="rail__spine">THE&nbsp;W</span>
        <ol className="rail__list">
          {players.map((p) => (
            <li key={p.id} className="rail__item">
              <a href={`#${p.id}`} className="rail__link">
                <span className="rail__num">
                  {String(p.index).padStart(2, '0')}
                </span>
                <span className="rail__tick" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
