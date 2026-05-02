import React from 'react'
import OnboardingFlow from './onboarding/OnboardingFlow'

export default function Hero() {
  return (
    <section
      id="app"
      className="relative overflow-hidden"
      style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pointer-events-none" />
      <div className="absolute top-0 -left-32 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-accent-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Onboarding flow fills the full viewport height */}
      <div className="relative h-full max-w-5xl mx-auto">
        <OnboardingFlow />
      </div>
    </section>
  )
}
