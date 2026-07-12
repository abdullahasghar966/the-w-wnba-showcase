/**
 * Closer — the sign-off / colophon. Bookends the intro hero, restates the
 * wordmark, and carries honest build notes (placeholder assets, no marks).
 */
export default function Closer() {
  return (
    <footer className="closer" data-theme="ink" aria-label="Colophon">
      <div className="closer__grid">
        <p className="closer__kicker">End of roster · 08 / 08</p>

        <h2 className="closer__title">
          THE <span>W</span>
        </h2>

        <p className="closer__line">
          Eight players. One league moving faster than anyone predicted.
        </p>

        <div className="closer__notes">
          <div className="closer__note">
            <span className="closer__note-tag">Assets</span>
            <p>
              All eight portraits use owner-supplied photography. Confirm
              licensing clearance before deployment.
            </p>
          </div>
          <div className="closer__note">
            <span className="closer__note-tag">Content</span>
            <p>
              Stats and achievements reflect the 2026-season brief. No quotes or
              figures are fabricated.
            </p>
          </div>
          <div className="closer__note">
            <span className="closer__note-tag">Build</span>
            <p>
              An independent portfolio project. Not affiliated with or endorsed
              by the WNBA or any team.
            </p>
          </div>
        </div>

        <p className="closer__foot">
          <span>Designed &amp; built as a frontend showcase</span>
          <a href="#top" className="closer__top">Back to top ↑</a>
        </p>
      </div>
    </footer>
  )
}
