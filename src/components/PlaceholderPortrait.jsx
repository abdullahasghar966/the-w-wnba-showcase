/**
 * PlaceholderPortrait — the player portrait slot.
 *
 * Two modes:
 *  - `player.portrait.src` present → renders the supplied photograph at its
 *    native resolution, cover-fit (no stretching / no upscaling distortion),
 *    framed by a per-player focal point + zoom (`focusX`/`focusY`/`zoom`) so
 *    every face is kept and sized well regardless of full-body vs. head shot,
 *    with the broadcast frame treatment (keylines, meta chip, hard shadow).
 *  - no `src` → the deliberately styled typographic stand-in remains
 *    (all 8 players currently have photos; kept as the fallback for any
 *    future roster addition without one): /* replace with licensed photo *\/
 *
 * Licensing/clearance of supplied photos is the project owner's call —
 * see docs/ROADMAP.md pre-deploy checklist.
 */
export default function PlaceholderPortrait({ player, eager = false }) {
  const num =
    player.jersey != null
      ? String(player.jersey)
      : String(player.index).padStart(2, '0')
  const photo = player.portrait?.src
  const focusX = player.portrait?.focusX ?? 50
  const focusY = player.portrait?.focusY ?? 18
  const zoom = player.portrait?.zoom ?? 1
  const objectPosition = `${focusX}% ${focusY}%`

  return (
    <figure
      className="portrait"
      data-tone={player.portrait?.tone || 'warm'}
      data-photo={photo ? 'true' : undefined}
    >
      <div className="portrait__frame">
        {photo ? (
          <>
            <img
              className="portrait__photo"
              src={photo}
              alt={`${player.fullName} — ${player.team}, ${player.position}`}
              loading={eager ? 'eager' : 'lazy'}
              fetchpriority={eager ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              style={{
                objectPosition,
                transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                transformOrigin: objectPosition,
              }}
            />
            <div className="portrait__scrim" aria-hidden="true" />
          </>
        ) : (
          <>
            {/* replace with licensed photo — begin */}
            <div className="portrait__halftone" aria-hidden="true" />
            <div className="portrait__grid" aria-hidden="true" />
            <span className="portrait__num" aria-hidden="true">{num}</span>
            <span className="portrait__initials" aria-hidden="true">
              {player.firstName.charAt(0)}
              {player.lastName.charAt(0)}
            </span>
            {/* replace with licensed photo — end */}
            <figcaption className="portrait__caption">
              {player.portrait?.label || 'replace with licensed photo'}
            </figcaption>
          </>
        )}

        <div className="portrait__meta">
          <span className="portrait__team">{player.teamAbbr}</span>
          <span className="portrait__pos">{player.position}</span>
        </div>
      </div>
      <span className="portrait__corner portrait__corner--tl" aria-hidden="true" />
      <span className="portrait__corner portrait__corner--br" aria-hidden="true" />
    </figure>
  )
}
