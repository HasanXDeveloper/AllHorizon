import { useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Community from './components/Community'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import Wiki from './pages/Wiki';
import Rules from './pages/Rules';
import Bank from './pages/Bank';
import Social from './pages/Social';
import NotFound from './pages/NotFound'

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Community />
      <Gallery />
    </>
  )
}

function App() {
  const [location] = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      return savedTheme || 'system'
    }
    return 'system'
  })

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (newTheme) => {
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        root.classList.remove('light', 'dark')
        root.classList.add(systemTheme)
      } else {
        root.classList.remove('light', 'dark')
        root.classList.add(newTheme)
      }
    }

    applyTheme(theme)
    localStorage.setItem('theme', theme)

    // Listen for system theme changes when in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('system')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return (
    <div className="flex flex-col min-h-screen">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-1 pt-24">
        <Switch>
          <Route path="/wiki/:slug" component={Wiki} />
          <Route path="/rules" component={Rules} />
          <Route path="/bank" component={Bank} />
          <Route path="/social" component={Social} />
          <Route path="/" component={HomePage} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {location !== '/social' && <Footer />}
    </div>
  )
}

export default App
