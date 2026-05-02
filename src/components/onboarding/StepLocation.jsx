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
    <div className="flex flex-col h-full px-6 py-8 max-w-lg mx-auto w-full gap-6 justify-center">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">Step 1 of 4</p>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Where are you?
        </h2>
        <p className="text-gray-500 text-base">
          We'll find real restaurants nearby that work for your whole group.
        </p>
      </div>

      {/* Input + autocomplete */}
      <div className="relative">
        <div className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-5 py-4 shadow-sm transition-all duration-200 ${
          showSuggestions && suggestions.length > 0 ? 'border-brand-400 ring-4 ring-brand-100 rounded-b-none' : 'border-gray-200 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100'
        }`}>
          <span className="text-xl shrink-0">📍</span>
          <input
            type="text"
            value={value}
            onChange={(e) => { onChange(e.target.value); setShowSuggestions(true) }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="City, neighborhood, or address…"
            className="flex-1 text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
            autoFocus
          />
          {value && (
            <button onClick={() => { onChange(''); setSuggestions([]) }}
              className="text-gray-300 hover:text-gray-500 transition-colors text-xl leading-none">
              ×
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-brand-400 rounded-b-2xl shadow-xl overflow-hidden z-20 max-h-64 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={() => handleSelect(s)}
                className="w-full flex items-start gap-3 px-5 py-3 text-left hover:bg-brand-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <span className="text-base shrink-0 mt-0.5">📍</span>
                <p className="text-sm text-gray-700 leading-snug">{s.label}</p>
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
          className="flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors disabled:opacity-50"
        >
          {locating ? (
            <>
              <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
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
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        Next — Set the vibe
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
