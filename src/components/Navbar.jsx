import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) =>
  `text-base font-medium transition-colors ${
    isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
  }`

const navClassMobile = ({ isActive }) =>
  `block text-base font-medium py-1 transition-colors ${
    isActive ? 'text-brand-600' : 'text-gray-700 hover:text-brand-500'
  }`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="mx-auto flex h-full w-full min-w-0 items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-base font-bold shadow-md group-hover:scale-105 transition-transform">
              🍽
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-tight">
              Plate<span className="text-brand-500">Share</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/how-it-works" className={navClass}>
              How It Works
            </NavLink>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to={{ pathname: '/', search: '?step=location', hash: 'app' }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Start Here →
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
      </div>

      {menuOpen && (
        <div className="md:hidden w-full border-t border-gray-100 bg-white shadow-lg">
          <div className="space-y-3 px-4 py-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navClassMobile}>
              Home
            </NavLink>
            <NavLink
              to="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className={navClassMobile}
            >
              How It Works
            </NavLink>
            <div className="pt-3 border-t border-gray-100">
              <Link
                to={{ pathname: '/', search: '?step=location', hash: 'app' }}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-base font-semibold"
              >
                Start Here →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
