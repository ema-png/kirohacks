import React, { useState } from 'react'

const SUGGESTIONS = [
  'Downtown SF, CA',
  'Brooklyn, NY',
  'Austin, TX',
  'Chicago, IL',
  'Los Angeles, CA',
  'Seattle, WA',
]

export default function StepLocation({ value, onChange, onNext }) {
  const [focused, setFocused] = useState(false)

  const handleSuggestion = (s) => {
    onChange(s)
    setFocused(false)
  }

  return (
    <div className="flex flex-col h-full px-6 py-8 max-w-lg mx-auto w-full gap-8 justify-center">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">Step 1 of 3</p>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Where are you?
        </h2>
        <p className="text-gray-500 text-base">
          We'll find restaraunts nearby your approximate location.
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <div
          className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-5 py-4 shadow-sm transition-all duration-200 ${
            focused ? 'border-brand-400 ring-4 ring-brand-100' : 'border-gray-200'
          }`}
        >
          <span className="text-xl shrink-0">📍</span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Neighborhood, city, or address…"
            className="flex-1 text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
            autoFocus
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="text-gray-300 hover:text-gray-500 transition-colors text-xl leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {focused && !value && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">
              Popular areas
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onMouseDown={() => handleSuggestion(s)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors text-left"
              >
                <span className="text-base">📍</span>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Or use current location */}
      <button
        onClick={() => { onChange('Current Location'); }}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 transition-colors w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Use my current location
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        Add your group
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
