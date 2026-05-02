import React from 'react'

export default function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-8">
      {/* Animated food icons */}
      <div className="flex gap-4 text-4xl">
        {['🍜', '🌮', '🍕', '🥗', '🍱'].map((e, i) => (
          <span
            key={i}
            className="animate-float"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            {e}
          </span>
        ))}
      </div>

      {/* Headline */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
          Stop arguing about
          <br />
          <span className="text-brand-500">what to eat.</span>
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Tell us where you are and what everyone wants.
          We'll find the one spot that works for the whole group.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 hover:scale-105 transition-all duration-200"
      >
        Start Here
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      {/* Trust pills */}
      
    </div>
  )
}
