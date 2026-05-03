import React from 'react'
import { START_SCREEN_STICKERS } from '../../data/startStickers'

const DEFAULT_START_EMOJIS = ['🍜', '🌮', '🍕', '🥗', '🍱']

export default function StartScreen({ onStart }) {
  const stickerItems = START_SCREEN_STICKERS.filter((s) => s?.src)
  const useStickers = stickerItems.length > 0
  const rowItems = useStickers ? stickerItems : DEFAULT_START_EMOJIS.map((emoji) => ({ emoji }))

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-8">
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

      {/* Headline */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
          Stop arguing about
          <br />
          <span className="text-brand-500">what to eat.</span>
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Tell us where you are and what everyone wants.
          We'll find a spot that works for the whole group.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 hover:scale-105 transition-all duration-200"
      >
        Start Here
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  )
}
