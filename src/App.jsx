import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToHash from './components/ScrollToHash'
import HomePage from './pages/HomePage'
import HowItWorksPage from './pages/HowItWorksPage'

export default function App() {
  return (
    <div className="min-w-0 w-full">
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Routes>
    </div>
  )
}
