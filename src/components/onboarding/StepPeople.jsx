import React, { useState } from 'react'

const DIET_OPTIONS = ['Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Halal', 'Dairy-Free', 'Nut-Free']
const FLAVOR_OPTIONS = ['Savory', 'Spicy', 'Sweet', 'Salty', 'Comfort Food', 'Light', 'Umami', 'Smoky']
const AVOID_OPTIONS = ['Mushrooms', 'Onions', 'Seafood', 'Red Meat', 'Pork', 'Eggs', 'Soy', 'Gluten']
const BUDGET_OPTIONS = [
  '$5',
  '$8',
  '$10',
  '$12',
  '$15',
  '$18',
  '$20',
  '$25',
  '$30',
  '$35',
  '$40',
  '$50',
  '$60',
  '$75',
  '$100+',
]
const AVATARS = ['🧑‍🦱', '👩‍🦰', '🧑‍🦳', '👨‍🍳', '👩‍💻', '🧑‍🎓', '👩‍🎤', '🧑‍🚀']

const PERSON_COLORS = [
  { border: 'border-violet-300', bg: 'bg-violet-50', header: 'bg-violet-500', tag: 'bg-violet-100 text-violet-700 border-violet-200', activeDot: 'bg-violet-500' },
  { border: 'border-rose-300',   bg: 'bg-rose-50',   header: 'bg-rose-500',   tag: 'bg-rose-100 text-rose-700 border-rose-200',       activeDot: 'bg-rose-500'   },
  { border: 'border-amber-300',  bg: 'bg-amber-50',  header: 'bg-amber-500',  tag: 'bg-amber-100 text-amber-700 border-amber-200',    activeDot: 'bg-amber-500'  },
  { border: 'border-blue-300',   bg: 'bg-blue-50',   header: 'bg-blue-500',   tag: 'bg-blue-100 text-blue-700 border-blue-200',       activeDot: 'bg-blue-500'   },
  { border: 'border-green-300',  bg: 'bg-green-50',  header: 'bg-green-500',  tag: 'bg-green-100 text-green-700 border-green-200',    activeDot: 'bg-green-500'  },
]

// Tag row with preset chips + an "Other" free-text input
function TagRow({ label, options, selected, onToggle, colorClass, otherValue, onOtherChange, otherPlaceholder }) {
  const [showOther, setShowOther] = useState(!!otherValue)

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 select-none ${
              selected.includes(o)
                ? `${colorClass} border-transparent shadow-sm scale-105`
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {o}
          </button>
        ))}
        {/* Other toggle */}
        <button
          type="button"
          onClick={() => setShowOther(s => !s)}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 select-none ${
            showOther || otherValue
              ? `${colorClass} border-transparent shadow-sm`
              : 'bg-white border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600'
          }`}
        >
          + Other
        </button>
      </div>
      {/* Free-text input */}
      {(showOther || otherValue) && (
        <input
          type="text"
          value={otherValue}
          onChange={e => onOtherChange(e.target.value)}
          placeholder={otherPlaceholder}
          className="mt-2 w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
        />
      )}
    </div>
  )
}

function PersonCard({ person, index, expanded, onToggleExpand, onUpdate, onRemove, canRemove }) {
  const color = PERSON_COLORS[index % PERSON_COLORS.length]

  const toggle = (field, value) => {
    const cur = person[field]
    onUpdate(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value])
  }

  const totalTags = person.diet.length + person.flavors.length + person.avoid.length +
    (person.budget ? 1 : 0) +
    (person.otherDiet ? 1 : 0) +
    (person.otherFlavors ? 1 : 0) +
    (person.otherAvoid ? 1 : 0)

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${color.border} ${color.bg}`}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className={`w-9 h-9 rounded-xl ${color.header} flex items-center justify-center text-lg shadow-sm shrink-0`}>
          {AVATARS[index % AVATARS.length]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {person.name || `Person ${index + 1}`}
          </p>
          <p className="text-xs text-gray-400">
            {totalTags === 0 ? 'Tap to set preferences' : `${totalTags} preference${totalTags !== 1 ? 's' : ''} set`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {totalTags > 0 && <span className={`w-2 h-2 rounded-full ${color.activeDot}`} />}
          {canRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none px-1"
              aria-label="Remove person"
            >
              ×
            </button>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/60 pt-4">
          {/* Name */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Name</p>
            <input
              value={person.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder={`Person ${index + 1}`}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          <TagRow
            label="Dietary needs"
            options={DIET_OPTIONS}
            selected={person.diet}
            onToggle={(v) => toggle('diet', v)}
            colorClass={color.tag}
            otherValue={person.otherDiet || ''}
            onOtherChange={(v) => onUpdate('otherDiet', v)}
            otherPlaceholder="e.g. Pescatarian, Low-FODMAP, Diabetic-friendly…"
          />
          <TagRow
            label="Cravings & flavors"
            options={FLAVOR_OPTIONS}
            selected={person.flavors}
            onToggle={(v) => toggle('flavors', v)}
            colorClass={color.tag}
            otherValue={person.otherFlavors || ''}
            onOtherChange={(v) => onUpdate('otherFlavors', v)}
            otherPlaceholder="e.g. Tangy, Crispy, Cheesy, Noodle-based…"
          />
          <TagRow
            label="Avoid"
            options={AVOID_OPTIONS}
            selected={person.avoid}
            onToggle={(v) => toggle('avoid', v)}
            colorClass={color.tag}
            otherValue={person.otherAvoid || ''}
            onOtherChange={(v) => onUpdate('otherAvoid', v)}
            otherPlaceholder="e.g. Cilantro, Raw fish, Very spicy food…"
          />

          {/* Budget */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Budget per meal</p>
            <div className="flex gap-2 flex-wrap">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onUpdate('budget', person.budget === b ? '' : b)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all duration-150 ${
                    person.budget === b
                      ? `${color.tag} border-transparent shadow-sm scale-105`
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

let nextId = 3
function newPerson(id, label) {
  return { id, name: label || '', diet: [], flavors: [], avoid: [], budget: '', otherDiet: '', otherFlavors: '', otherAvoid: '' }
}

export default function StepPeople({ people, onChange, onNext, onBack }) {
  const [expandedId, setExpandedId] = useState(people[0]?.id ?? null)

  const addPerson = () => {
    if (people.length >= 8) return
    const id = ++nextId
    const updated = [...people, newPerson(id, '')]
    onChange(updated)
    setExpandedId(id)
  }

  const removePerson = (id) => {
    const updated = people.filter(p => p.id !== id)
    onChange(updated)
    if (expandedId === id) setExpandedId(updated[updated.length - 1]?.id ?? null)
  }

  const updatePerson = (id, field, value) => {
    onChange(people.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed header */}
      <div className="px-6 pt-8 pb-4 shrink-0">
        <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Step 3 of 4</p>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Build your group.</h2>
        <p className="text-gray-500 text-sm mt-1">
          Tap each person to set their preferences. Use "+ Other" to add anything custom.
        </p>
      </div>

      {/* Scrollable person list */}
      <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-4 min-h-0">
        {people.map((p, i) => (
          <PersonCard
            key={p.id}
            person={p}
            index={i}
            expanded={expandedId === p.id}
            onToggleExpand={() => setExpandedId(expandedId === p.id ? null : p.id)}
            onUpdate={(field, value) => updatePerson(p.id, field, value)}
            onRemove={() => removePerson(p.id)}
            canRemove={people.length > 1}
          />
        ))}

        {people.length < 8 && (
          <button
            type="button"
            onClick={addPerson}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 text-sm font-semibold hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add another person
          </button>
        )}
      </div>

      {/* Fixed footer */}
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
          See restaraunt options
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { newPerson, PERSON_COLORS, AVATARS }
