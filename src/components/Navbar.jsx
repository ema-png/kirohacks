import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) =>
  `text-base font-medium transition-colors rounded-lg px-2 py-1 ${
    isActive ? 'text-accent-800 bg-accent-50' : 'text-slate-600 hover:text-accent-700 hover:bg-white/80'
  }`

const navClassMobile = ({ isActive }) =>
  `block text-base font-medium py-2 px-2 rounded-xl transition-colors ${
    isActive ? 'text-accent-800 bg-accent-50' : 'text-slate-700 hover:bg-white/90 hover:text-accent-700'
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
          ? 'border-b border-accent-200/60 bg-white/90 shadow-soft backdrop-blur-xl'
          : 'border-b border-plate-peach bg-white/85 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-full w-full min-w-0 items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <Link to="/" className="group flex items-center gap-2">
          <img
            src="/logo-nobeef.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-soft ring-1 ring-black/5 transition-transform group-hover:scale-105"
          />
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            No<span className="text-brand-600">Beef</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/how-it-works" className={navClass}>
            How It Works
          </NavLink>
        </div>

        <div className="hidden items-center md:flex">
          <Link
            to={{ pathname: '/', search: '?step=location', hash: 'app' }}
            className="rounded-xl bg-brand-500 px-4 py-2 text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-600"
          >
            Start Here →
          </Link>
        </div>

        <button
          className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-accent-50 hover:text-accent-800 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="w-full border-t border-accent-100 bg-white/98 shadow-soft backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navClassMobile}>
              Home
            </NavLink>
            <NavLink to="/how-it-works" onClick={() => setMenuOpen(false)} className={navClassMobile}>
              How It Works
            </NavLink>
            <div className="border-t border-plate-peach pt-3">
              <Link
                to={{ pathname: '/', search: '?step=location', hash: 'app' }}
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-xl bg-brand-500 px-4 py-2.5 text-center text-base font-semibold text-white"
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
