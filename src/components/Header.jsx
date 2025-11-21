import { useState, useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import UserMenu from './UserMenu'

export default function Header({ theme, setTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mobileThemeRef = useRef(null)
  const desktopThemeRef = useRef(null)
  const { user, logout } = useAuth()

  const themeOptions = [
    { value: 'system', label: 'Системная', icon: 'fa-desktop' },
    { value: 'light', label: 'Светлая', icon: 'fa-sun' },
    { value: 'dark', label: 'Тёмная', icon: 'fa-moon' }
  ]

  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[0]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideMobile = mobileThemeRef.current && !mobileThemeRef.current.contains(event.target)
      const isOutsideDesktop = desktopThemeRef.current && !desktopThemeRef.current.contains(event.target)

      if (isOutsideMobile && isOutsideDesktop) {
        setThemeMenuOpen(false)
      }
    }

    if (themeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [themeMenuOpen])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setThemeMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl shadow-lg py-4'
        : 'bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-xl py-6 md:py-8'
        }`}
    >
      <nav className="container-width transition-all duration-300">
        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center justify-between px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Horizon"
              className={`rounded-lg transition-all duration-300 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}
            />
          </Link>

          <div className="flex items-center gap-2">
            <div className="relative" ref={mobileThemeRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 "
              >
                <i className={`fas ${currentTheme.icon} text-lg`}></i>
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50 animate-scaleIn">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${theme === option.value
                        ? 'bg-primary-100 dark:bg-neutral-700 text-primary-600 dark:text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                    >
                      <i className={`fas ${option.icon} text-base w-5 text-center`}></i>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-2">
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <i className="fas fa-sign-in-alt text-xl"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 px-4 pb-4 space-y-3 animate-fadeInUp">
            <Link href="/" className="flex items-center gap-3 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <i className="fas fa-home text-lg"></i>
              <span>Главная</span>
            </Link>
            <Link href="/wiki/getting-started" className="flex items-center gap-3 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <i className="fas fa-book text-lg"></i>
              <span>Вики</span>
            </Link>
            <Link href="/rules" className="flex items-center gap-3 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <i className="fas fa-file-contract text-lg"></i>
              <span>Правила</span>
            </Link>
            <Link href="/bank" className="flex items-center gap-3 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <i className="fas fa-university text-lg"></i>
              <span>Банк</span>
            </Link>
          </div>
        )}
        <div className="hidden lg:flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Horizon"
              className={`rounded-lg transition-all duration-300 group-hover:scale-110 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}
            />
            <span className={`font-bold text-neutral-900 dark:text-white transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
              HORIZON
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
              <i className="fas fa-home text-base"></i>
              <span>Главная</span>
            </Link>
            <Link href="/wiki/getting-started" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
              <i className="fas fa-book text-base"></i>
              <span>Вики</span>
            </Link>
            <Link href="/rules" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
              <i className="fas fa-file-contract text-base"></i>
              <span>Правила</span>
            </Link>
            <Link href="/bank" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
              <i className="fas fa-university text-base"></i>
              <span>Банк</span>
            </Link>

            <div className="relative" ref={desktopThemeRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <i className={`fas ${currentTheme.icon} text-lg`}></i>
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50 animate-scaleIn">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${theme === option.value
                        ? 'bg-primary-100 dark:bg-neutral-700 text-primary-600 dark:text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                    >
                      <i className={`fas ${option.icon} text-base w-5 text-center`}></i>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <UserMenu />
            ) : (
              <button
                data-auth-trigger
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 h-10 px-6 text-sm"
              >
                <i className="fas fa-sign-in-alt text-base"></i>
                <span>Войти</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  )
}
