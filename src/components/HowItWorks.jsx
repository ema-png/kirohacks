import React from 'react'
import { steps } from '../data/mockData'
import { HOW_IT_WORKS_STICKERS } from '../data/howItWorksStickers'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden pt-20 pb-8 sm:pt-24 sm:pb-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-96 w-96 -translate-y-1/2 rounded-full bg-accent-200/35 blur-3xl" />
        <div className="absolute -right-16 top-1/2 h-80 w-80 translate-y-[-30%] rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-plate-peach-fuzz/55 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <div className="mb-16 space-y-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">The flow</p>
          <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            4 steps take you from
            <br />
            <span className="text-brand-600">
              Chaos → Consensus
            </span>
          </h2>
        </div>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-[4.5rem] z-0 hidden h-0.5 bg-accent-300 lg:block" />

          {steps.map((step, i) => (
            <div key={i} className="group relative z-10">
              <div className="rounded-3xl border border-plate-peach bg-white/90 p-6 text-center shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-lift">
                <div className="flex flex-col items-center mb-4">
                  {HOW_IT_WORKS_STICKERS[i] && (
                    <div className="mb-3 flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                      <img
                        src={HOW_IT_WORKS_STICKERS[i].src}
                        alt={HOW_IT_WORKS_STICKERS[i].alt}
                        className="h-full w-full object-contain select-none"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  )}
                  <span className={`text-xs font-black ${step.textColor} tracking-widest`}>
                    STEP {step.number}
                  </span>
                </div>

                <h3 className="mb-2 font-display text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>

              {/* Arrow between steps (mobile/tablet) */}
              {i < steps.length - 1 && (
                <div className="my-2 flex justify-center text-accent-200 lg:hidden">
                  <svg className="w-5 h-5 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="relative mb-3 mt-16 overflow-hidden rounded-3xl border border-plate-peach bg-white px-8 pb-9 pt-8 text-center shadow-soft backdrop-blur-sm sm:mb-4">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-200/30 blur-2xl" />
          <p className="relative mb-2 font-display text-2xl font-black text-slate-900">
            Average decision time:{' '}
            <span className="text-brand-600">28 seconds.</span>
          </p>
          <p className="relative text-slate-600">so everyone leaves happy (and full) :)</p>
        </div>
      </div>
    </section>
  )
}
