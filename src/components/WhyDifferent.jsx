import React from 'react'
import { differentiators } from '../data/mockData'

export default function WhyDifferent() {
  return (
    <section id="why-different" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full">
            🧠 Not what you think
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            This isn't a food app.
            <br />
            <span className="text-brand-400">It's a group mediator.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            There are plenty of apps that help you find food. None of them help your group agree on it.
          </p>
        </div>

        {/* Comparison cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {differentiators.map((d, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 border transition-all duration-300 ${
                d.highlight
                  ? 'bg-gradient-to-br from-brand-500/20 to-accent-500/20 border-brand-500/40 ring-1 ring-brand-500/30 hover:ring-brand-500/60'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-2xl mb-3">{d.icon}</div>
              <p className={`font-bold text-sm mb-1 ${d.highlight ? 'text-white' : 'text-gray-300'}`}>
                {d.label}
              </p>
              <p className={`text-xs mb-3 font-medium ${d.highlight ? 'text-brand-300' : 'text-gray-500'}`}>
                {d.sub}
              </p>
              <p className={`text-sm leading-relaxed ${d.highlight ? 'text-gray-200' : 'text-gray-400'}`}>
                {d.desc}
              </p>
              {d.highlight && (
                <div className="mt-4 inline-flex items-center gap-1.5 bg-brand-500/30 text-brand-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  That's us
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Agent explanation */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-semibold px-4 py-2 rounded-full">
                🤖 AI Agent Architecture
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">
                The AI holds everyone's constraints simultaneously.
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Most recommendation systems optimize for one person. Social Plate-Share runs a multi-constraint satisfaction problem across your entire group — dietary needs, budgets, flavor preferences, and location — all at once.
              </p>
              <p className="text-gray-400 leading-relaxed">
                It doesn't just suggest options. It negotiates between them, eliminates conflicts, and surfaces the one answer that actually works.
              </p>
            </div>

            {/* Visual */}
            <div className="space-y-3">
              {[
                { label: 'Dietary Restrictions', value: 100, color: 'bg-violet-500' },
                { label: 'Budget Constraints', value: 100, color: 'bg-amber-500' },
                { label: 'Flavor Preferences', value: 100, color: 'bg-rose-500' },
                { label: 'Location Proximity', value: 100, color: 'bg-blue-500' },
                { label: 'Group Satisfaction', value: 100, color: 'bg-green-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-36 shrink-0">{item.label}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-green-400 text-xs font-bold w-8">✓</span>
                </div>
              ))}
              <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-center">
                <p className="text-green-400 font-bold text-sm">All constraints satisfied → Decision ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
