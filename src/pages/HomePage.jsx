import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Hero />
      <Footer />
    </div>
  )
}
