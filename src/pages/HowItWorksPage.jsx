import React from 'react'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default function HowItWorksPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-howit-wash">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-plate-peach-fuzz/25 to-accent-50/40" />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-1 flex-col pt-16 pb-4 sm:pb-5">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
