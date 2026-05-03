import React from 'react'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col pt-16 pb-49 sm:pb-49 min-h-[calc(100vh-4rem)]">
        <HowItWorks />
      </main>
      <div className="mt-16">
    <Footer />
  </div>
    </div>
  )
}
