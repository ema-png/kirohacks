import React from 'react'
import { steps } from '../data/mockData'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent-100/30 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold px-4 py-2 rounded-full">
            ⚡ Ridiculously simple
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            From chaos to{' '}
            <span className="text-brand-500">consensus</span>
            <br />
            in four steps.
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No spreadsheets. No voting. No arguments. Just tell the AI what everyone needs.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 via-brand-200 to-green-200 z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 group">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 text-center">
                {/* Number + icon */}
                <div className="flex flex-col items-center mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-2xl shadow-lg mb-3`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-black ${step.textColor} tracking-widest`}>
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow between steps (mobile/tablet) */}
              {i < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-2 text-gray-300">
                  <svg className="w-5 h-5 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-16 bg-gradient-to-r from-brand-50 to-amber-50 rounded-3xl border border-brand-100 p-8 text-center">
          <p className="text-2xl font-black text-gray-900 mb-2">
            Average decision time: <span className="text-brand-500">28 seconds.</span>
          </p>
          <p className="text-gray-500">
            Down from the industry average of "we never actually decided and just got pizza again."
          </p>
        </div>
      </div>
    </section>
  )
}
