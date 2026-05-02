import React, { useState, useMemo } from 'react'
import { getPersonMenuMatches } from '../../data/restaurants'
import { PERSON_COLORS, AVATARS } from './StepPeople'

// ─── Per-person meal matches inside a restaurant card ────────────────────────
function PersonMatches({ person, restaurant, index }) {
  const color = PERSON_COLORS[index % PERSON_COLORS.length]
  const matches = getPersonMenuMatches(restaurant, person)

  if (matches.length === 0) {
    return (
      <div className={`rounded-xl border p-3 ${color.border} ${color.bg}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">{AVATARS[index % AVATARS.length]}</span>
          <span className="text-xs font-bold text-gray-700">{person.name || `Person ${index + 1}`}</span>
          <span className="ml-auto text-xs text-amber-600 font-semibold">⚠ Limited options</span>
        </div>
        <p className="text-xs text-gray-400 pl-7">May need to customize order</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border p-3 ${color.border} ${color.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{AVATARS[index % AVATARS.length]}</span>
        <span className="text-xs font-bold text-gray-700">{person.name || `Person ${index + 1}`}</span>
        <span className="ml-auto text-xs text-green-600 font-semibold">✓ {matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
      </div>
      <div className="space-y-1.5 pl-7">
        {matches.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-sm shrink-0">{item.emoji}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{item.name}</p>
              <p className="text-xs text-gray-400 leading-tight truncate">{item.desc}</p>
              <p className="text-xs font-bold text-brand-600 mt-0.5">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Single restaurant card ───────────────────────────────────────────────────
function RestaurantCard({ restaurant, people, rank }) {
  const [expanded, setExpanded] = useState(false)
  const satisfiedCount = restaurant.satisfiedCount ?? people.length
  const totalPeople = restaurant.totalPeople ?? people.length
  const satisfactionPct = Math.round((satisfiedCount / Math.max(totalPeople, 1)) * 100)
  const isBest = rank === 0

  return (
    <div className={`rounded-2xl border-2 overflow-hidden bg-white transition-all duration-200 ${
      isBest ? 'border-brand-300 shadow-lg' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
    }`}>
      {/* Best match banner */}
      {isBest && (
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 px-4 py-1.5 flex items-center gap-2">
          <span className="text-white text-xs font-black">⭐ BEST MATCH FOR YOUR GROUP</span>
        </div>
      )}

      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji + rank */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
              {restaurant.emoji}
            </div>
            <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
              isBest ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {rank + 1}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{restaurant.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{restaurant.cuisine}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                ★ {restaurant.rating}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                {restaurant.distance} mi
              </span>
              <span className="text-xs text-gray-400">{restaurant.price}</span>
              <span className="text-xs text-gray-400">{restaurant.address}</span>
            </div>

            {/* Group satisfaction bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">Group match</span>
                <span className={`text-xs font-bold ${satisfactionPct >= 80 ? 'text-green-600' : satisfactionPct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                  {satisfiedCount}/{totalPeople} people satisfied
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    satisfactionPct >= 80 ? 'bg-green-500' : satisfactionPct >= 50 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${satisfactionPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {restaurant.tags.map(t => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
          {restaurant.dietSupport.slice(0, 3).map(d => (
            <span key={d} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ {d}</span>
          ))}
        </div>

        {/* Action row: website link + expand toggle */}
        <div className="flex items-center gap-2 mt-3">
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit website
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-700 py-1.5 rounded-xl hover:bg-brand-50 transition-all"
          >
            {expanded ? 'Hide' : 'Show'} meals for each person
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Per-person meal matches */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-50 pt-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What each person can order</p>
          {people.map((person, i) => (
            <PersonMatches key={person.id} person={person} restaurant={restaurant} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Results Step ────────────────────────────────────────────────────────
export default function StepResults({ location, people, restaurants = [], fetchError, onReset }) {
  const [sortBy, setSortBy] = useState('match')

  const sorted = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance
      if (sortBy === 'rating') return b.rating - a.rating
      return b.score - a.score
    })
  }, [restaurants, sortBy])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 shrink-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-0.5">Results</p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {sorted.length} spots near <span className="text-brand-500">{location}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked for {people.length} {people.length === 1 ? 'person' : 'people'} · Yelp data
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-all shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
            </svg>
            Start over
          </button>
        </div>

        {/* Sort controls */}
        {!fetchError && sorted.length > 0 && (
          <div className="flex gap-2 mt-3">
            {[
              { key: 'match', label: '⭐ Best match' },
              { key: 'distance', label: '📍 Nearest' },
              { key: 'rating', label: '★ Top rated' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                  sortBy === s.key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-3 max-w-sm">
            <p className="text-2xl">😕</p>
            <p className="font-bold text-gray-900">Couldn't load restaurants</p>
            <p className="text-sm text-gray-400">{fetchError}</p>
            <p className="text-xs text-gray-300">Make sure the backend server is running on port 3001</p>
            <button onClick={onReset} className="text-sm text-brand-500 font-semibold hover:underline">Try again</button>
          </div>
        </div>
      )}

      {/* Restaurant list — full width */}
      {!fetchError && (
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 min-h-0">
          {sorted.map((r, i) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              people={people}
              rank={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
