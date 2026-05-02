import React, { useState, useEffect } from 'react'
import StartScreen from './StartScreen'
import StepLocation from './StepLocation'
import StepVibe from './StepVibe'
import StepPeople from './StepPeople'
import LoadingScreen from './LoadingScreen'
import StepResults from './StepResults'
import { newPerson } from './StepPeople'

const STEPS = {
  START:    'start',
  LOCATION: 'location',
  VIBE:     'vibe',
  PEOPLE:   'people',
  LOADING:  'loading',
  RESULTS:  'results',
}

function ProgressBar({ step }) {
  const steps = [
    { id: STEPS.LOCATION, label: 'Location' },
    { id: STEPS.VIBE,     label: 'Vibe' },
    { id: STEPS.PEOPLE,   label: 'Group' },
    { id: STEPS.RESULTS,  label: 'Results' },
  ]
  const displayStep = step === STEPS.LOADING ? STEPS.RESULTS : step
  const activeIndex = steps.findIndex(s => s.id === displayStep)

  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 shrink-0 bg-white">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < activeIndex ? 'bg-green-500 text-white'
              : i === activeIndex ? 'bg-brand-500 text-white'
              : 'bg-gray-100 text-gray-400'
            }`}>
              {i < activeIndex ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline transition-colors ${
              i === activeIndex ? 'text-gray-900' : i < activeIndex ? 'text-green-600' : 'text-gray-400'
            }`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${i < activeIndex ? 'bg-green-400' : 'bg-gray-100'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function OnboardingFlow() {
  const [step, setStep]             = useState(STEPS.START)
  const [location, setLocation]     = useState('')
  const [coords, setCoords]         = useState(null) // { lat, lon }
  const [vibe, setVibe]             = useState([])
  const [occasion, setOccasion]     = useState('')
  const [people, setPeople]         = useState([newPerson(1, 'Person 1'), newPerson(2, 'Person 2')])
  const [restaurants, setRestaurants] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [animDone, setAnimDone]     = useState(false)
  const [fetchDone, setFetchDone]   = useState(false)

  // When both the animation AND the fetch are done, move to results
  useEffect(() => {
    if (step === STEPS.LOADING && animDone && fetchDone) {
      setStep(STEPS.RESULTS)
    }
  }, [animDone, fetchDone, step])

  // Start the Yelp fetch as soon as loading screen appears
  useEffect(() => {
    if (step !== STEPS.LOADING) return
    setFetchDone(false)
    setFetchError(null)

    fetch('http://localhost:3001/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, coords, people, vibe }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setRestaurants(data.restaurants || [])
        setFetchDone(true)
      })
      .catch(err => {
        console.error('Yelp fetch error:', err)
        setFetchError(err.message)
        setFetchDone(true) // still advance so user sees the error
      })
  }, [step])

  const handleReset = () => {
    setStep(STEPS.START)
    setLocation('')
    setCoords(null)
    setVibe([])
    setOccasion('')
    setPeople([newPerson(1, 'Person 1'), newPerson(2, 'Person 2')])
    setRestaurants([])
    setFetchError(null)
    setAnimDone(false)
    setFetchDone(false)
  }

  const showProgress = step !== STEPS.START

  return (
    <div className="flex flex-col h-full bg-white">
      {showProgress && <ProgressBar step={step} />}

      <div className="flex-1 overflow-hidden min-h-0">
        {step === STEPS.START && (
          <StartScreen onStart={() => setStep(STEPS.LOCATION)} />
        )}
        {step === STEPS.LOCATION && (
          <StepLocation
            value={location}
            onChange={(val, lat, lon) => {
              setLocation(val)
              if (lat != null && lon != null) setCoords({ lat, lon })
              else setCoords(null) // reset if user edits text after picking
            }}
            onNext={async () => {
              // If no coords yet, geocode the typed text before advancing
              if (!coords && location.trim()) {
                try {
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
                    { headers: { 'Accept-Language': 'en' } }
                  )
                  const data = await res.json()
                  if (data[0]) setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) })
                } catch { /* proceed without coords */ }
              }
              setStep(STEPS.VIBE)
            }}
          />
        )}
        {step === STEPS.VIBE && (
          <StepVibe
            vibe={vibe}
            occasion={occasion}
            onVibeChange={setVibe}
            onOccasionChange={setOccasion}
            onNext={() => setStep(STEPS.PEOPLE)}
            onBack={() => setStep(STEPS.LOCATION)}
          />
        )}
        {step === STEPS.PEOPLE && (
          <StepPeople
            people={people}
            onChange={setPeople}
            onNext={() => { setAnimDone(false); setStep(STEPS.LOADING) }}
            onBack={() => setStep(STEPS.VIBE)}
          />
        )}
        {step === STEPS.LOADING && (
          <LoadingScreen
            onDone={() => setAnimDone(true)}
            people={people}
            vibe={vibe}
            occasion={occasion}
            location={location}
          />
        )}
        {step === STEPS.RESULTS && (
          <StepResults
            location={location}
            people={people}
            vibe={vibe}
            restaurants={restaurants}
            fetchError={fetchError}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
