import React from 'react'

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

/** Group cuisine prefs — ids align with common Yelp category aliases where possible */
const CUISINE_OPTIONS = [
  { id: 'mexican', emoji: '🌮', label: 'Mexican' },
  { id: 'italian', emoji: '🍝', label: 'Italian' },
  { id: 'japanese', emoji: '🍣', label: 'Japanese' },
  { id: 'chinese', emoji: '🥟', label: 'Chinese' },
  { id: 'thai', emoji: '🍜', label: 'Thai' },
  { id: 'indian', emoji: '🍛', label: 'Indian' },
  { id: 'korean', emoji: '🥢', label: 'Korean' },
  { id: 'vietnamese', emoji: '🍲', label: 'Vietnamese' },
  { id: 'french', emoji: '🥐', label: 'French' },
  { id: 'mediterranean', emoji: '🥙', label: 'Mediterranean' },
  { id: 'greek', emoji: '🫒', label: 'Greek' },
  { id: 'american', emoji: '🍔', label: 'American' },
  { id: 'seafood', emoji: '🦞', label: 'Seafood' },
  { id: 'bbq', emoji: '🍖', label: 'BBQ' },
  { id: 'pizza', emoji: '🍕', label: 'Pizza' },
  { id: 'middle_eastern', emoji: '🧆', label: 'Middle Eastern' },
  { id: 'caribbean', emoji: '🌴', label: 'Caribbean' },
  { id: 'latin', emoji: '🌶️', label: 'Latin' },
  { id: 'breakfast_brunch', emoji: '🥞', label: 'Brunch' },
  { id: 'no_preference', emoji: '🌍', label: 'No preference' },
]

export default function StepVibe({ vibe, cuisine, onVibeChange, onCuisineChange, onNext, onBack }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 shrink-0">
        <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Step 2 of 4</p>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">What's the vibe?</h2>
        <p className="text-gray-500 text-sm mt-1">
          Set dining style and cuisine, then we&apos;ll collect each person&apos;s details.
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

        {/* Cuisine */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Cuisine <span className="text-gray-300 font-normal normal-case">(pick all that apply)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((c) => {
              const isSelected = cuisine.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (c.id === 'no_preference') {
                      onCuisineChange(isSelected ? [] : ['no_preference'])
                      return
                    }
                    const withoutNo = cuisine.filter((x) => x !== 'no_preference')
                    if (isSelected) {
                      onCuisineChange(withoutNo.filter((x) => x !== c.id))
                    } else {
                      onCuisineChange([...withoutNo, c.id])
                    }
                  }}
                  className={`flex items-center gap-2 rounded-full border-2 px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span>{c.emoji}</span>
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected summary */}
        {(vibe.length > 0 || cuisine.length > 0) && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 flex items-start gap-3">
            <div className="space-y-2">
              {vibe.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-brand-700 mb-0.5">Vibe</p>
                  <p className="text-sm text-brand-600">
                    {vibe.map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label).filter(Boolean).join(' · ')}
                  </p>
                </div>
              )}
              {cuisine.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-brand-700 mb-0.5">Cuisine</p>
                  <p className="text-sm text-brand-600">
                    {cuisine
                      .map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label)
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              )}
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
          Add your preferences
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { VIBE_OPTIONS, CUISINE_OPTIONS }
