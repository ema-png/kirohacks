import React from 'react'
import { steps } from '../data/mockData'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white relative overflow-hidden pt-20 pb-8 sm:pt-24 sm:pb-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent-100/30 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative mx-auto w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            4 steps take you from
            <br />
            
            <span className="text-black-400">Chaos →</span>{' '}

            <span className="text-green-500"> 
              
              Consensus</span>
 
          </h2>
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
        <div className="mt-16 mb-3 bg-gradient-to-r from-brand-50 to-amber-50 rounded-3xl border border-brand-100 px-8 pt-8 pb-9 text-center sm:mb-4">
          <p className="text-2xl font-black text-gray-900 mb-2">
            Average decision time: <span className="text-brand-500">28 seconds.</span>
          </p>
          <p className="text-gray-500">
            so everyone leaves happy (and full) :)
          </p>
        </div>
      </div>
    </section>
  )
}
