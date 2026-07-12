import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { players } from './data/players.js'
import './styles.css'

// Preload the anchor player's portrait (the first photo the user reaches after
// the hero) so it starts downloading at high priority during initial load,
// well before React mounts its section — it's decoded and ready by the time
// the user scrolls past the hero.
const heroSrc = players[0]?.portrait?.src
if (heroSrc) {
  const preload = document.createElement('link')
  preload.rel = 'preload'
  preload.as = 'image'
  preload.href = heroSrc
  preload.fetchPriority = 'high'
  document.head.appendChild(preload)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
