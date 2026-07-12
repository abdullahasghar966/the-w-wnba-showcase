import { players, tickerItems } from './data/players.js'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import Grain from './components/Grain.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import IntroBumper from './components/IntroBumper.jsx'
import SiteFrame from './components/SiteFrame.jsx'
import IntroHero from './components/IntroHero.jsx'
import Ticker from './components/Ticker.jsx'
import PlayerSection from './components/PlayerSection.jsx'
import Closer from './components/Closer.jsx'

/**
 * App — composes the full single-page showcase.
 *
 * Theme + portrait alignment alternate per index for a hard ink/flame
 * checkerboard. Ticker strips break the rhythm and run in alternating
 * directions. Lenis momentum scrolling is mounted here (desktop only).
 */
export default function App() {
  useSmoothScroll()

  return (
    <div className="app">
      <IntroBumper />
      <Grain />
      <CustomCursor />
      <SiteFrame players={players} />

      <main>
        <IntroHero />

        {players.map((player, i) => {
          const theme = i % 2 === 0 ? 'ink' : 'flame'
          const align = i % 2 === 0 ? 'right' : 'left'
          const node = (
            <PlayerSection
              key={player.id}
              player={player}
              theme={theme}
              align={align}
            />
          )

          // Insert a ticker strip after the 3rd and 6th players for rhythm.
          if (i === 2 || i === 5) {
            return (
              <div key={`${player.id}-group`}>
                <Ticker
                  items={tickerItems}
                  theme={i === 2 ? 'flame' : 'ink'}
                  reverse={i === 5}
                />
                {node}
              </div>
            )
          }
          return node
        })}

        <Ticker items={tickerItems} theme="flame" reverse />
        <Closer />
      </main>
    </div>
  )
}
