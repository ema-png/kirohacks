import React from 'react'
import Hero from '../components/Hero'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <main>
        <CTA />
      </main>
      <Footer />
    </>
  )
}
