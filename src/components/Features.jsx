import React from 'react'
import { features } from '../data/mockData'

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
            🛠️ Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Built for real groups
            <br />
            with <span className="text-brand-500">real differences.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Every feature exists to solve one specific part of the group food decision problem.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>

              {/* Gradient accent bar */}
              <div className={`h-0.5 w-8 rounded-full bg-gradient-to-r ${f.color} mb-4`} />

              <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
