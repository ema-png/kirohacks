import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import WhyDifferent from './components/WhyDifferent'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div>
      {/* Fixed navbar — 64px tall */}
      <Navbar />

      {/* The app — exactly one viewport height, sits right below navbar */}
      <Hero />

      {/* Marketing / landing content scrolls below */}
      <main>
        <Problem />
        <HowItWorks />
        <Features />
        <WhyDifferent />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
