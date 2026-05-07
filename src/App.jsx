import { useEffect, useState } from 'react'
import { AppShell } from './components/xcreos/AppShell'
import { HomePageView } from './components/xcreos/HomePageView'

function getHashRoute() {
  return window.location.hash || '#home'
}

function useHashRoute() {
  const [hash, setHash] = useState(getHashRoute)

  useEffect(() => {
    function handleHashChange() {
      setHash(getHashRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return hash
}

export default function App() {
  const hash = useHashRoute()

  if (hash === '#home' || hash === '#visual-system') {
    return <HomePageView />
  }

  return <AppShell activeHash={hash} />
}
