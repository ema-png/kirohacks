import React from 'react'
import { problems } from '../data/mockData'

export default function Problem() {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full">
            😩 Sound familiar?
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            The group chat is a{' '}
            <span className="text-brand-400">disaster.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every group has that one person who can't eat gluten, one who's broke, and one who "doesn't care" but actually cares a lot.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <div
              key={i}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 cursor-default"
            >
              <div className="text-3xl mb-3">{p.emoji}</div>
              <h3 className="text-white font-bold text-base mb-1">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Transition statement */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-brand-500/20 to-accent-500/20 border border-brand-500/30 rounded-3xl px-8 py-6 max-w-2xl">
            <p className="text-white text-xl font-bold leading-relaxed">
              What if an AI could just{' '}
              <span className="text-brand-400">handle all of that</span>{' '}
              in under 30 seconds?
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
