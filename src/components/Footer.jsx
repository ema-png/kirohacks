import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'How It Works', to: '/how-it-works' },
  ]

  const legalLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
  ]

  return (
    <footer className="mt-auto shrink-0 border-t border-white/10 bg-gray-950">
      <div className="mx-auto w-full max-w-none px-4 py-5 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link to="/" className="group flex w-fit shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-sm">
                🍽
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                Social Plate<span className="text-brand-400">Share</span>
              </span>
            </Link>
            <p className="max-w-xs text-[16px] leading-snug text-gray-500 sm:border-l sm:border-white/10 sm:pl-4">
              Group food picks, fast.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-medium text-gray-400 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3 text-[12px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Social Plate-Share</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-gray-300">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
