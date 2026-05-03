import React, { useState, useEffect, useRef } from 'react'

export default function StepLocation({ value, onChange, onNext }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')
  const debounceRef = useRef(null)

  // Nominatim autocomplete — free OpenStreetMap geocoding, no key needed
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value || value.length < 3) { setSuggestions([]); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(value)}`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setSuggestions(data.map(d => ({
          label: d.display_name,
          lat: parseFloat(d.lat),
          lon: parseFloat(d.lon),
        })))
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 350)
  }, [value])

  const handleSelect = (s) => {
    onChange(s.label, s.lat, s.lon)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser')
      return
    }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          // Reverse geocode to get a human-readable name
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const addr = data.address
          const label = [
            addr?.road,
            addr?.neighbourhood || addr?.suburb || addr?.quarter,
            addr?.city || addr?.town || addr?.village || addr?.county,
            addr?.state
          ].filter(Boolean).slice(0, 3).join(', ')
          onChange(label || 'Current Location', latitude, longitude)
        } catch {
          onChange('Current Location', latitude, longitude)
        }
        setLocating(false)
      },
      (err) => {
        setLocError('Could not get location — try typing your address instead')
        setLocating(false)
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    )
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center gap-6 px-4 py-8 sm:px-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-600">Step 1 of 4</p>
        <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Where are you?
        </h2>
        <p className="text-base text-slate-600">
          We'll find real restaurants nearby that work for your whole group.
        </p>
      </div>

      <div className="relative">
        <div className={`flex items-center gap-3 rounded-2xl border-2 bg-white/90 px-5 py-4 shadow-soft backdrop-blur-sm transition-all duration-200 ${
          showSuggestions && suggestions.length > 0 ? 'rounded-b-none border-accent-500 ring-4 ring-accent-100' : 'border-slate-200/80 focus-within:border-accent-500 focus-within:ring-4 focus-within:ring-accent-100'
        }`}>
          <span className="text-xl shrink-0">📍</span>
          <input
            type="text"
            value={value}
            onChange={(e) => { onChange(e.target.value); setShowSuggestions(true) }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="City, neighborhood, or address…"
            className="flex-1 border-0 bg-transparent text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
            autoFocus
          />
          {value && (
            <button onClick={() => { onChange(''); setSuggestions([]) }}
              className="text-xl leading-none text-slate-300 transition-colors hover:text-slate-500">
              ×
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 max-h-64 overflow-y-auto overflow-hidden rounded-b-2xl border-2 border-t-0 border-accent-500 bg-white/95 shadow-soft backdrop-blur-md">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={() => handleSelect(s)}
                className="flex w-full items-start gap-3 border-b border-slate-50 px-5 py-3 text-left transition-colors last:border-0 hover:bg-accent-50"
              >
                <span className="text-base shrink-0 mt-0.5">📍</span>
                <p className="text-sm leading-snug text-slate-700">{s.label}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GPS button */}
      <div className="space-y-2">
        <button
          onClick={handleGPS}
          disabled={locating}
          className="flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors hover:text-brand-600 disabled:opacity-50"
        >
          {locating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
              Getting your location…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use my current location
            </>
          )}
        </button>
        {locError && <p className="text-xs text-red-500">{locError}</p>}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-base font-bold text-white shadow-soft transition-all duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next — Set the vibe
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
