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
  { border: 'border-accent-300', bg: 'bg-accent-50', tag: 'bg-accent-100 text-accent-800 border-accent-200', activeDot: 'bg-accent-500' },
  { border: 'border-brand-300', bg: 'bg-brand-50', tag: 'bg-brand-100 text-brand-800 border-brand-200', activeDot: 'bg-brand-500' },
  { border: 'border-brand-400', bg: 'bg-brand-100', tag: 'bg-brand-200 text-brand-800 border-brand-300', activeDot: 'bg-brand-600' },
  { border: 'border-accent-200', bg: 'bg-white', tag: 'bg-accent-50 text-accent-800 border-accent-200', activeDot: 'bg-accent-600' },
  { border: 'border-plate-teal/35', bg: 'bg-plate-peach/40', tag: 'bg-accent-50 text-accent-800 border-accent-200', activeDot: 'bg-plate-teal' },
]

// Tag row with preset chips + an "Other" free-text input
function TagRow({ label, options, selected, onToggle, colorClass, otherValue, onOtherChange, otherPlaceholder }) {
  const [showOther, setShowOther] = useState(!!otherValue)

  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-900 sm:text-sm">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`rounded-full border px-2.5 py-1.5 text-sm font-medium leading-snug transition-all duration-150 select-none ${
              selected.includes(o)
                ? `${colorClass} border-transparent shadow-sm scale-105`
                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:text-gray-900'
            }`}
          >
            {o}
          </button>
        ))}
        {/* Other toggle */}
        <button
          type="button"
          onClick={() => setShowOther(s => !s)}
          className={`rounded-full border px-2.5 py-1.5 text-sm font-medium leading-snug transition-all duration-150 select-none ${
            showOther || otherValue
              ? `${colorClass} border-transparent shadow-sm`
              : 'border-dashed border-gray-400 bg-white text-gray-700 hover:border-gray-500 hover:text-gray-900'
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
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 placeholder:text-gray-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
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
    <div className={`overflow-hidden rounded-lg border-2 transition-all duration-200 ${color.border} ${color.bg}`}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold leading-tight text-gray-900">
            {person.name || `Person ${index + 1}`}
          </p>
          <p className="text-sm text-gray-700">
            {totalTags === 0 ? 'Tap to set preferences' : `${totalTags} preference${totalTags !== 1 ? 's' : ''} set`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {totalTags > 0 && <span className={`h-1.5 w-1.5 rounded-full ${color.activeDot}`} />}
          {canRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              className="px-0.5 text-lg leading-none text-gray-500 transition-colors hover:text-red-500"
              aria-label="Remove person"
            >
              ×
            </button>
          )}
          <svg
            className={`h-3.5 w-3.5 shrink-0 text-gray-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="space-y-2.5 border-t border-white/60 px-2.5 pb-2.5 pt-2">
          {/* Name */}
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-900 sm:text-sm">Name</p>
            <input
              value={person.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder={`Person ${index + 1}`}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-base text-gray-900 placeholder:text-gray-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
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
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-900 sm:text-sm">Budget per meal</p>
            <div className="flex flex-wrap gap-1">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onUpdate('budget', person.budget === b ? '' : b)}
                  className={`rounded-full border px-2.5 py-1.5 text-sm font-semibold leading-snug transition-all duration-150 ${
                    person.budget === b
                      ? `${color.tag} border-transparent shadow-sm scale-105`
                      : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
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
      <div className="shrink-0 px-6 pb-4 pt-8">
        <p className="mb-1.5 text-sm font-bold uppercase tracking-wider text-accent-600">Step 3 of 4</p>
        <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Build your group.</h2>
        <p className="mt-1.5 text-base leading-snug text-gray-800">
          Tap each person to set their preferences. Use &quot;+ Other&quot; to add anything custom.
        </p>
      </div>

      {/* Scrollable person list */}
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-6 pb-4">
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-400 py-3.5 text-base font-semibold text-gray-700 transition-all duration-200 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add another person
          </button>
        )}
      </div>

      {/* Fixed footer */}
      <div className="flex shrink-0 gap-3 px-6 pb-8 pt-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-gray-300 px-5 py-3.5 text-base font-semibold text-gray-800 transition-all hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-base font-bold text-white shadow-soft transition-all duration-200 hover:bg-brand-700"
        >
          See restaraunt options
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { newPerson, PERSON_COLORS, AVATARS }
