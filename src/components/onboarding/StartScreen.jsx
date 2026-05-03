import React from 'react'
import { START_SCREEN_STICKERS } from '../../data/startStickers'

const DEFAULT_START_EMOJIS = ['🍜', '🌮', '🍕', '🥗', '🍱']

export default function StartScreen({ onStart }) {
  const stickerItems = START_SCREEN_STICKERS.filter((s) => s?.src)
  const useStickers = stickerItems.length > 0
  const rowItems = useStickers ? stickerItems : DEFAULT_START_EMOJIS.map((emoji) => ({ emoji }))

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
      {/* Stickers (image URLs) or default emojis — edit src/data/startStickers.js */}
      <div className={`flex gap-5 ${useStickers ? 'items-center' : 'text-5xl sm:text-6xl'}`}>
        {rowItems.map((item, i) => (
          <span
            key={item.src ?? item.emoji ?? i}
            className="animate-float inline-flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            {item.src ? (
              <img
                src={item.src}
                alt={item.alt ?? ''}
                className="h-full w-full object-contain select-none"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ) : (
              item.emoji
            )}
          </span>
        ))}
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Stop arguing about
          <br />
          <span className="text-brand-600">
            what to eat.
          </span>
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Tell us where you are and what everyone wants.
          We'll find a spot that works for the whole group.
        </p>
      </div>

      <button
        onClick={onStart}
        className="group flex items-center gap-3 rounded-2xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-lift transition-all duration-200 hover:bg-brand-600"
      >
        Start Here
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
