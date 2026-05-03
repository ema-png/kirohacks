import React from 'react'

const VIBE_OPTIONS = [
  {
    id: 'casual',
    label: 'Casual',
    //desc: 'Relaxed, no dress code, just good food',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    activeBg: 'bg-amber-500',
  },
  {
    id: 'fancy',
    label: 'Fancy',
    //desc: 'Sit-down, upscale, special occasion vibes',
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    activeBg: 'bg-cyan-600',
  },
  {
    id: 'sit-down',
    label: 'Sit-Down',
    //desc: 'Table service, take your time, no rush',
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    activeBg: 'bg-sky-500',
  },
  {
    id: 'fast-casual',
    label: 'Fast Casual',
    //desc: 'Order at the counter, quick and easy',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    activeBg: 'bg-orange-500',
  },
  {
    id: 'drive-thru',
    label: 'Drive-Thru',
    //desc: 'Stay in the car, grab and go',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    activeBg: 'bg-emerald-500',
  },
  {
    id: 'takeout',
    label: 'Takeout / Delivery',
    //desc: 'Eat at home or wherever you are',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    activeBg: 'bg-rose-500',
  },
  {
    id: 'outdoor',
    label: 'Outdoor Seating',
    //desc: 'Patio, rooftop, or park vibes',
    bg: 'bg-lime-50',
    border: 'border-lime-300',
    activeBg: 'bg-lime-600',
  },
  {
    id: 'bar',
    label: 'Bar / Drinks Too',
    //desc: 'Food and drinks, social atmosphere',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    activeBg: 'bg-yellow-500',
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
  { id: 'desserts', emoji: '🍰', label: 'Desserts' },
  { id: 'drinks_na', emoji: '🧋', label: 'Drinks (Non-Alcoholic)' },
]

export default function StepVibe({ vibe, cuisine, onVibeChange, onCuisineChange, otherCuisine, onOtherCuisineChange, onNext, onBack }) {
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-6 pb-4 pt-8">
        <p className="mb-1.5 text-sm font-bold uppercase tracking-wider text-accent-600">Step 2 of 4</p>
        <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">What's the vibe?</h2>
        <p className="mt-1.5 text-base leading-snug text-gray-900">
          Set dining style and cuisine, then we&apos;ll collect each person&apos;s details.
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0 space-y-6">

        {/* Vibe grid */}
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-950 sm:text-base">
            Dining style{' '}
            <span className="font-semibold normal-case text-gray-800">(pick all that apply)</span>
          </p>
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
                  className={`relative flex flex-col items-center gap-1 p-4 rounded-2xl border-2 text-center transition-all duration-150 ${
                    isSelected
                      ? `${v.activeBg} border-transparent shadow-md scale-[1.02]`
                      : `${v.bg} ${v.border} hover:scale-[1.01] hover:shadow-sm`
                  }`}
                >
                  <div>
                    <p className={`text-sm font-bold leading-tight sm:text-base ${isSelected ? 'text-white' : 'text-gray-950'}`}>{v.label}</p>
                    {v.desc && (
                      <p className={`mt-0.5 hidden text-xs leading-snug sm:block sm:text-sm ${isSelected ? 'text-white/90' : 'text-gray-800'}`}>{v.desc}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Cuisine */}
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-950 sm:text-base">
            Cuisine{' '}
            <span className="font-semibold normal-case text-gray-800">(pick all that apply)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((c) => {
              const isSelected = cuisine.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCuisineChange(
                    isSelected ? cuisine.filter((x) => x !== c.id) : [...cuisine, c.id]
                  )}
                  className={`flex items-center rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                      : 'border-gray-400 bg-white text-gray-950 hover:border-gray-500'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          {/* Free-text other cuisine */}
          <input
            type="text"
            value={otherCuisine}
            onChange={(e) => onOtherCuisineChange(e.target.value)}
            placeholder="Other cuisine (e.g. Ethiopian, Peruvian, Dim Sum…)"
            className="mt-3 w-full rounded-xl border border-gray-400 bg-white px-3 py-3 text-sm text-gray-950 placeholder:text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        {/* Selected summary */}
        {(vibe.length > 0 || cuisine.length > 0 || otherCuisine.trim()) && (
          <div className="flex items-start gap-3 rounded-2xl border border-brand-300 bg-brand-50 px-4 py-4">
            <div className="space-y-3">
              {vibe.length > 0 && (
                <div>
                  <p className="mb-1 text-sm font-bold uppercase tracking-wide text-brand-900">Vibe</p>
                  <p className="text-base font-semibold leading-snug text-brand-900">
                    {vibe.map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label).filter(Boolean).join(' · ')}
                  </p>
                </div>
              )}
              {(cuisine.length > 0 || otherCuisine.trim()) && (
                <div>
                  <p className="mb-1 text-sm font-bold uppercase tracking-wide text-brand-900">Cuisine</p>
                  <p className="text-base font-semibold leading-snug text-brand-900">
                    {[
                      ...cuisine.map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label),
                      otherCuisine.trim() || null,
                    ].filter(Boolean).join(' · ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex shrink-0 gap-3 px-6 pb-8 pt-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center rounded-2xl border-2 border-gray-400 px-5 py-3.5 text-base font-semibold text-gray-950 transition-all hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center rounded-2xl bg-brand-600 py-3.5 text-base font-bold text-white shadow-soft transition-all duration-200 hover:bg-brand-700"
        >
          Add your preferences
        </button>
      </div>
    </div>
  )
}

export { VIBE_OPTIONS, CUISINE_OPTIONS }
