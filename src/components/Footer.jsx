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
    <footer className="relative z-10 mt-auto shrink-0 border-t border-cyan-500/20 bg-cyan-800 text-white">
      <div className="mx-auto w-full max-w-none px-4 py-5 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link to="/" className="group flex w-fit shrink-0 items-center gap-2">
              <img
                src="/logo-nobeef.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-white/20 transition-opacity group-hover:opacity-90"
              />
              <span className="font-display text-sm font-bold tracking-tight text-white">
                No<span className="text-plate-peach-fuzz">Beef</span>
              </span>
            </Link>
            <p className="max-w-xs text-base leading-snug text-white/75 sm:border-l sm:border-white/20 sm:pl-4">
              Group food picks, fast.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-medium text-white/80 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-white/15 pt-3 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-white/90">© {new Date().getFullYear()} NoBeef</p>
            <p className="max-w-md text-[10px] leading-snug text-white/55">
              Logo sticker by{' '}
              <a
                href="https://www.flaticon.com/free-sticker/beef_10310051"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white/70"
              >
                Magnific
              </a>{' '}
              on{' '}
              <a
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white/70"
              >
                Flaticon
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white/75 transition-colors hover:text-plate-peach-fuzz"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
