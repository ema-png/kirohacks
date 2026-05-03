import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll to top, or to #id after route change (so Link targets like /#app actually land in view). */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      // Main content for this route is already at the top; skip anchor scroll (avoids jarring "scroll up").
      if (pathname === '/how-it-works' && id === 'how-it-works') {
        return
      }
      const frame = requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
