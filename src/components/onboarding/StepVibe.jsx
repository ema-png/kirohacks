import React, { useState } from 'react'

const VIBE_OPTIONS = [
  {
    id: 'casual',
    emoji: '😎',
    label: 'Casual',
    desc: 'Relaxed, no dress code, just good food',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    activeBg: 'bg-amber-500',
    activeText: 'text-white',
    checkColor: 'bg-amber-500',
  },
  {
    id: 'fancy',
    emoji: '🥂',
    label: 'Fancy',
    desc: 'Sit-down, upscale, special occasion vibes',
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    activeBg: 'bg-violet-500',
    activeText: 'text-white',
    checkColor: 'bg-violet-500',
  },
  {
    id: 'sit-down',
    emoji: '🪑',
    label: 'Sit-Down',
    desc: 'Table service, take your time, no rush',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    activeBg: 'bg-blue-500',
    activeText: 'text-white',
    checkColor: 'bg-blue-500',
  },
  {
    id: 'fast-casual',
    emoji: '⚡',
    label: 'Fast Casual',
    desc: 'Order at the counter, quick and easy',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    activeBg: 'bg-orange-500',
    activeText: 'text-white',
    checkColor: 'bg-orange-500',
  },
  {
    id: 'drive-thru',
    emoji: '🚗',
    label: 'Drive-Thru',
    desc: 'Stay in the car, grab and go',
    bg: 'bg-green-50',
    border: 'border-green-300',
    activeBg: 'bg-green-500',
    activeText: 'text-white',
    checkColor: 'bg-green-500',
  },
  {
    id: 'takeout',
    emoji: '🥡',
    label: 'Takeout / Delivery',
    desc: 'Eat at home or wherever you are',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    activeBg: 'bg-rose-500',
    activeText: 'text-white',
    checkColor: 'bg-rose-500',
  },
  {
    id: 'outdoor',
    emoji: '🌿',
    label: 'Outdoor Seating',
    desc: 'Patio, rooftop, or park vibes',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    activeBg: 'bg-emerald-500',
    activeText: 'text-white',
    checkColor: 'bg-emerald-500',
  },
  {
    id: 'bar',
    emoji: '🍻',
    label: 'Bar / Drinks Too',
    desc: 'Food and drinks, social atmosphere',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    activeBg: 'bg-yellow-500',
    activeText: 'text-white',
    checkColor: 'bg-yellow-500',
  },
]

const OCCASION_OPTIONS = [
  { id: 'just-hungry', emoji: '🍽️', label: "We're just hungry" },
  { id: 'catch-up', emoji: '💬', label: 'Catching up with friends' },
  { id: 'date', emoji: '💕', label: 'Date night' },
  { id: 'work-lunch', emoji: '💼', label: 'Work lunch' },
  { id: 'celebration', emoji: '🎉', label: 'Celebration' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Family dinner' },
]

export default function StepVibe({ vibe, occasion, onVibeChange, onOccasionChange, onNext, onBack }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 shrink-0">
        <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Step 2 of 4</p>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">What's the vibe?</h2>
        <p className="text-gray-500 text-sm mt-1">
          Set the mood before we get into individual preferences.
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0 space-y-6">

        {/* Vibe grid */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dining style <span className="text-gray-300 font-normal normal-case">(pick all that apply)</span></p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VIBE_OPTIONS.map((v) => {
              const isSelected = vibe.includes(v.id)
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVibeChange(
                    isSelected ? vibe.filter(x => x !== v.id) : [...vibe, v.id]
                  )}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-150 ${
                    isSelected
                      ? `${v.activeBg} border-transparent shadow-md scale-[1.02]`
                      : `${v.bg} ${v.border} hover:scale-[1.01] hover:shadow-sm`
                  }`}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl">{v.emoji}</span>
                  <div>
                    <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>{v.label}</p>
                    <p className={`text-xs mt-0.5 leading-tight hidden sm:block ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{v.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Occasion */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">What's the occasion? <span className="text-gray-300 font-normal normal-case">(optional)</span></p>
          <div className="flex flex-wrap gap-2">
            {OCCASION_OPTIONS.map((o) => {
              const isSelected = occasion === o.id
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onOccasionChange(isSelected ? '' : o.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span>{o.emoji}</span>
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected summary */}
        {vibe.length > 0 && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 flex items-start gap-3">
            <span className="text-lg shrink-0">✨</span>
            <div>
              <p className="text-xs font-bold text-brand-700 mb-1">Your vibe</p>
              <p className="text-sm text-brand-600">
                {vibe.map(id => VIBE_OPTIONS.find(v => v.id === id)?.label).filter(Boolean).join(' · ')}
                {occasion && ` · ${OCCASION_OPTIONS.find(o => o.id === occasion)?.label}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-3 shrink-0 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
        >
          Next — Add your group
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { VIBE_OPTIONS, OCCASION_OPTIONS }
