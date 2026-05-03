import React from 'react'
import OnboardingFlow from './onboarding/OnboardingFlow'

export default function Hero() {
  return (
    <section
      id="app"
      className="relative overflow-hidden"
      style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="pointer-events-none absolute inset-0 bg-palette-mesh opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" />
      <div className="pointer-events-none absolute left-[8%] top-20 h-64 w-64 rounded-full bg-plate-peach-fuzz/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[5%] h-72 w-72 rounded-full bg-accent-200/45 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-brand-300/35 blur-3xl" />

      <div className="relative mx-auto h-full w-full max-w-none px-3 py-3 sm:px-6 sm:py-4 lg:px-10 xl:px-14 2xl:px-20">
        <OnboardingFlow />
      </div>
    </section>
  )
}
