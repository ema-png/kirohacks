import React, { useEffect, useState } from 'react'
import { VIBE_OPTIONS, CUISINE_OPTIONS } from './StepVibe'
import { PERSON_COLORS, AVATARS } from './StepPeople'

const LOADING_STEPS = [
  { icon: '📍', text: 'Finding restaurants nearby…' },
  { icon: '🎭', text: 'Applying vibe filters…' },
  { icon: '🥗', text: 'Checking dietary restrictions…' },
  { icon: '💰', text: 'Balancing budgets…' },
  { icon: '🌶️', text: 'Matching flavor profiles…' },
  { icon: '✅', text: 'Ranking results for your group…' },
]

// Build a natural-language summary of the group's preferences
function budgetSortKey(b) {
  return parseInt(String(b).replace(/\$/g, '').replace(/\+/g, ''), 10) || 0
}

function buildSummary(people, vibe, cuisine, location) {
  const vibeLabels = vibe.map(id => VIBE_OPTIONS.find(v => v.id === id)?.label).filter(Boolean)
  const cuisineLabels = cuisine
    .filter((id) => id !== 'no_preference')
    .map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label)
    .filter(Boolean)

  const allDiets = [...new Set(people.flatMap(p => [...p.diet, ...(p.otherDiet ? [p.otherDiet] : [])]))]
  const allFlavors = [...new Set(people.flatMap(p => [...p.flavors, ...(p.otherFlavors ? [p.otherFlavors] : [])]))]
  const allAvoid = [...new Set(people.flatMap(p => [...p.avoid, ...(p.otherAvoid ? [p.otherAvoid] : [])]))]
  const budgets = people.map(p => p.budget).filter(Boolean)
  const lowestBudget = budgets.sort((a, b) => budgetSortKey(a) - budgetSortKey(b))[0]

  const parts = []

  if (vibeLabels.length) parts.push(`${vibeLabels.join(' or ')} dining`)
  if (cuisineLabels.length) parts.push(`${cuisineLabels.join(', ')} food`)
  parts.push(`near ${location || 'your area'}`)
  parts.push(`for ${people.length} ${people.length === 1 ? 'person' : 'people'}`)
  if (allDiets.length) parts.push(`with ${allDiets.slice(0, 3).join(', ')} needs`)
  if (allFlavors.length) parts.push(`craving ${allFlavors.slice(0, 3).join(', ').toLowerCase()}`)
  if (allAvoid.length) parts.push(`avoiding ${allAvoid.slice(0, 2).join(' & ')}`)
  if (lowestBudget) parts.push(`budget from ${lowestBudget}`)

  return parts.join(' · ')
}

export default function LoadingScreen({ onDone, people, vibe, cuisine = [], location }) {
  const [step, setStep] = useState(0)
  const summary = buildSummary(people, vibe, cuisine, location)

  useEffect(() => {
    if (step < LOADING_STEPS.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 380)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onDone, 500)
      return () => clearTimeout(t)
    }
  }, [step, onDone])

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 sm:px-6">
      {/* Animated icon */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-4xl shadow-2xl shadow-brand-500/30 animate-pulse-slow">
          🤖
        </div>
        <div className="absolute -inset-3 rounded-[2rem] border-2 border-brand-300/30 animate-ping" style={{ animationDuration: '1.5s' }} />
      </div>

      {/* Group summary card */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your group's brief</p>

        {/* People chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {people.map((p, i) => {
            const color = PERSON_COLORS[i % PERSON_COLORS.length]
            const tags = [
              ...p.diet,
              p.otherDiet,
              ...p.flavors,
              p.otherFlavors,
            ].filter(Boolean).slice(0, 3)
            return (
              <div key={p.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${color.border} ${color.bg}`}>
                <span className="text-sm">{AVATARS[i % AVATARS.length]}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-none">{p.name || `Person ${i + 1}`}</p>
                  {tags.length > 0 && (
                    <p className="text-xs text-gray-400 leading-none mt-0.5">{tags.join(', ')}</p>
                  )}
                  {p.budget && (
                    <p className="text-xs text-brand-600 font-semibold leading-none mt-0.5">{p.budget}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Natural language summary */}
        <p className="text-xs text-gray-500 leading-relaxed italic border-t border-gray-100 pt-3">
          "{summary}"
        </p>
      </div>

      {/* Loading steps */}
      <div className="space-y-2.5 w-full">
        {LOADING_STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-all duration-300 ${
              i < step ? 'opacity-35' : i === step ? 'opacity-100' : 'opacity-15'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-300 ${
              i < step ? 'bg-green-100 text-green-700' : i === step ? 'bg-brand-100' : 'bg-gray-100'
            }`}>
              {i < step ? '✓' : s.icon}
            </div>
            <span className={`text-sm font-medium flex-1 ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>
              {s.text}
            </span>
            {i === step && (
              <div className="flex gap-0.5">
                {[0, 1, 2].map(d => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
