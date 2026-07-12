import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// The anchor player's portrait is preloaded statically from index.html (see the
// <link rel="preload"> there), so it starts downloading in parallel with this
// bundle rather than after it — no JS-injected preload needed.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
