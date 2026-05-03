import React, { useState, useMemo, useEffect } from "react";
import { rankRestaurants } from "../../api/rankRestaurants";
import { PERSON_COLORS, AVATARS } from "./StepPeople";

// ─── Per-person meal matches (AI-generated) ───────────────────────────────────
function PersonMatches({ person, restaurant, index }) {
  const color = PERSON_COLORS[index % PERSON_COLORS.length];
  const personKey = person.name?.trim() || `Person ${index + 1}`;

  const recsMap = restaurant.perPersonRecs ?? {};
  const recs =
    recsMap[personKey] ??
    recsMap[
      Object.keys(recsMap).find(
        (k) => k.toLowerCase() === personKey.toLowerCase(),
      )
    ] ??
    Object.values(recsMap)[index] ??
    [];

  if (recs.length === 0) {
    return (
      <div className={`rounded-xl border p-3 ${color.border} ${color.bg}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">{AVATARS[index % AVATARS.length]}</span>
          <span className="text-xs font-bold text-gray-700">{personKey}</span>
          <span className="ml-auto text-xs text-amber-600 font-semibold">
            ⚠ Limited options
          </span>
        </div>
        <p className="text-xs text-gray-400 pl-7">May need to customize order</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-3 ${color.border} ${color.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{AVATARS[index % AVATARS.length]}</span>
        <span className="text-xs font-bold text-gray-700">{personKey}</span>
        <span className="ml-auto text-xs text-green-600 font-semibold">
          ✓ {recs.length} suggestion{recs.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-2 pl-7">
        {recs.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-sm shrink-0">{item.emoji || "🍽️"}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{item.name}</p>
              <p className="text-xs text-gray-400 leading-tight">{item.desc}</p>
              {item.matchNote && (
                <p className="text-xs text-brand-500 leading-tight italic mt-0.5">{item.matchNote}</p>
              )}
              {item.price && (
                <p className="text-xs font-bold text-brand-600 mt-0.5">{item.price}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Single restaurant card ───────────────────────────────────────────────────
function RestaurantCard({ restaurant, people, rank, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const { satisfiedCount, totalPeople, passesHardDiet, passesBudget, reasoning } = restaurant;
  const satisfactionPct = Math.round((satisfiedCount / Math.max(totalPeople, 1)) * 100);
  const isBest = rank === 0;
  const hasWarning = !passesHardDiet || !passesBudget;

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-brand-400 shadow-xl shadow-brand-500/15"
          : hasWarning
            ? "border-amber-100 hover:border-amber-200 hover:shadow-md opacity-75"
            : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      } bg-white`}
      onClick={() => onSelect(restaurant.id)}
    >
      {isBest && !hasWarning && (
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 px-4 py-1.5 flex items-center gap-2">
          <span className="text-white text-xs font-black">⭐ BEST MATCH FOR YOUR GROUP</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
              {restaurant.emoji}
            </div>
            <div
              className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                isBest && !hasWarning ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {rank + 1}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{restaurant.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{restaurant.cuisine}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                ★ {restaurant.rating}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {restaurant.distance} mi
              </span>
              <span className="text-xs text-gray-400">{restaurant.price}</span>
              <span className="text-xs text-gray-400">{restaurant.address}</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">Group match</span>
                <span className={`text-xs font-bold ${satisfactionPct >= 80 ? "text-green-600" : satisfactionPct >= 50 ? "text-amber-600" : "text-red-500"}`}>
                  {satisfiedCount}/{totalPeople} people satisfied
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    satisfactionPct >= 80 ? "bg-green-500" : satisfactionPct >= 50 ? "bg-amber-500" : "bg-red-400"
                  }`}
                  style={{ width: `${satisfactionPct}%` }}
                />
              </div>
            </div>

            {reasoning && (
              <p className="mt-2 text-xs text-gray-500 italic leading-relaxed">✦ {reasoning}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(restaurant.tags || []).map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
          {(restaurant.dietSupport || [])
            .filter((d) => people.some((p) => p.diet?.includes(d)))
            .slice(0, 3)
            .map((d) => (
              <span key={d} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ {d}</span>
            ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          {restaurant.yelpUrl && (
            <a
              href={restaurant.yelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Yelp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Results Step ────────────────────────────────────────────────────────
export default function StepResults({ location, people, vibe = [], onReset }) {
  const [sortBy, setSortBy] = useState("match");
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    rankRestaurants({ people, vibe, location })
      .then((data) => {
        if (cancelled) return;
        setAiData(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const sorted = useMemo(() => {
    if (!aiData?.ranked) return [];
    const list = [...aiData.ranked];
    if (sortBy === "distance") return list.sort((a, b) => a.distance - b.distance);
    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [aiData, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin" />
        <p className="text-sm font-semibold text-gray-600">AI is ranking restaurants for your group…</p>
        <p className="text-xs text-gray-400">Checking dietary needs, budgets, and vibes</p>
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <p className="text-3xl">😕</p>
        <p className="text-sm font-semibold text-gray-700">No restaurants found</p>
        <p className="text-xs text-gray-400">
          {aiData?.error || "Make sure the backend server is running on port 3001"}
        </p>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-500 border border-brand-200 px-4 py-2 rounded-xl hover:bg-brand-50 transition-all"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 shrink-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-0.5">Results</p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {sorted.length} spots near <span className="text-brand-500">{location}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked for {people.length} {people.length === 1 ? "person" : "people"} ·{" "}
              {aiData?.usedFallback ? "Smart match" : "AI-matched"}
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-all shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Start over
          </button>
        </div>

        {aiData?.aiSummary && (
          <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
            <p className="text-xs font-bold text-brand-600 mb-0.5">✦ AI Pick</p>
            <p className="text-xs text-gray-700 leading-relaxed">{aiData.aiSummary}</p>
            {aiData.groupInsight && (
              <p className="text-xs text-gray-400 mt-1 italic">{aiData.groupInsight}</p>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          {[
            { key: "match", label: "⭐ Best match" },
            { key: "distance", label: "📍 Nearest" },
            { key: "rating", label: "★ Top rated" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                sortBy === s.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant list — full width now */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 min-h-0">
        {sorted.map((r, i) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            people={people}
            rank={i}
            isSelected={false}
            onSelect={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
