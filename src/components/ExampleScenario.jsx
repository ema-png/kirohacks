import React, { useState } from 'react'
import { friends, aiResult } from '../data/mockData'

function FriendCard({ friend }) {
  return (
    <div className={`rounded-2xl border-2 p-5 ${friend.color} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center text-xl shadow-sm">
          {friend.avatar}
        </div>
        <div>
          <p className="font-bold text-sm">{friend.name}</p>
          <p className="text-xs opacity-70">Budget: {friend.budget}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {friend.tags.map((t) => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/60 font-semibold border border-current/10">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function RemixCard({ remix }) {
  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${remix.color} transition-all duration-300 hover:scale-105`}>
      <div className={`${remix.headerColor} px-4 py-2 flex items-center gap-2`}>
        <span className="text-base">{remix.avatar}</span>
        <span className="text-white font-bold text-sm">{remix.friend}'s Order</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{remix.mod}</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {remix.note}
        </span>
      </div>
    </div>
  )
}

export default function ExampleScenario() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="example" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-100/30 to-accent-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
            🎬 See it in action
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Three friends.
            <br />
            <span className="text-brand-500">Zero compromises.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Watch the AI find a solution that actually works for everyone — not just the loudest person in the group.
          </p>
        </div>

        {/* Friends input */}
        <div className="mb-8">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-4">
            The Group's Preferences
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {friends.map((f) => (
              <FriendCard key={f.id} friend={f} />
            ))}
          </div>
        </div>

        {/* AI button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setRevealed(true)}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
              revealed
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 cursor-default'
                : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:scale-105'
            }`}
          >
            {revealed ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Decision Made!
              </>
            ) : (
              <>
                <span className="text-xl">🤖</span>
                Find Our Middle Ground
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* AI Result */}
        {revealed && (
          <div className="space-y-6 animate-fade-up">
            {/* Restaurant recommendation */}
            <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-semibold">AI Mediator · Decision Ready</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                {/* Restaurant */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">📍 Nearest Match</p>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-2xl">
                      {aiResult.restaurant.emoji}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{aiResult.restaurant.name}</p>
                      <p className="text-gray-400 text-sm">{aiResult.restaurant.cuisine}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-400 text-xs">{aiResult.restaurant.distance}</span>
                        <span className="text-amber-400 text-xs font-semibold">★ {aiResult.restaurant.rating}</span>
                        <span className="text-green-400 text-xs font-semibold">{aiResult.restaurant.priceRange}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {aiResult.restaurant.tags.map((t) => (
                      <span key={t} className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Base meal */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">🍱 Base Meal</p>
                  <p className="text-white font-semibold text-base leading-relaxed">{aiResult.baseMeal}</p>
                  <p className="text-gray-400 text-sm mt-3">
                    Fully customizable — each person orders their own version.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full font-medium">✓ All restrictions met</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-medium">✓ All budgets fit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized remixes */}
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-4">
                Personalized Remixes
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {aiResult.remixes.map((r, i) => (
                  <RemixCard key={i} remix={r} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-green-800 font-bold text-base">
                🎉 Everyone's happy. Decision made in 28 seconds.
              </p>
              <p className="text-green-600 text-sm mt-1">
                No arguments. No compromises. One restaurant, three perfect orders.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
