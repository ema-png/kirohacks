import React from 'react'

const testimonials = [
  {
    quote: "We used to spend 30 minutes arguing in the group chat every single time. Now we just open Plate-Share and it's done.",
    name: 'Maya R.',
    role: 'College student, Boston',
    avatar: '👩‍🎓',
    color: 'bg-violet-50 border-violet-100',
  },
  {
    quote: "I'm vegan and my roommates are not. This is the first app that actually finds places where we can all eat together.",
    name: 'Theo K.',
    role: 'Roommate group, Austin',
    avatar: '🧑‍💻',
    color: 'bg-green-50 border-green-100',
  },
  {
    quote: "Our team lunch used to be a nightmare. Now someone just shares the link and we have a plan in under a minute.",
    name: 'Priya S.',
    role: 'Product Manager, NYC',
    avatar: '👩‍💼',
    color: 'bg-blue-50 border-blue-100',
  },
  {
    quote: "I'm on a tight budget and my friends always want to go somewhere expensive. Plate-Share actually finds spots that work for everyone.",
    name: 'Carlos M.',
    role: 'Grad student, Chicago',
    avatar: '🧑‍🎓',
    color: 'bg-amber-50 border-amber-100',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-full">
            💬 Real groups, real results
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Groups that stopped{' '}
            <span className="text-brand-500">arguing.</span>
          </h2>
        </div>

        {/* Testimonial grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-3xl border-2 p-6 ${t.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '2,400+', label: 'Groups decided this week' },
            { value: '28s', label: 'Average decision time' },
            { value: '94%', label: 'Group satisfaction rate' },
            { value: '50+', label: 'Dietary restrictions handled' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-brand-500">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
