import React, { useState, useMemo, useEffect } from "react";
import { rankRestaurants } from "../../api/rankRestaurants";
import { PERSON_COLORS, AVATARS } from "./StepPeople";
import { VIBE_OPTIONS, CUISINE_OPTIONS } from "./StepVibe";

function FilterSummaryCard({ location, people, vibe, cuisine, otherCuisine = '' }) {
  const [open, setOpen] = useState(false);

  const vibeLabels = (vibe || [])
    .map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label)
    .filter(Boolean);
  const cuisineLabels = [
    ...(cuisine || [])
      .filter((id) => id && id !== "no_preference")
      .map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label)
      .filter(Boolean),
    ...(otherCuisine.trim() ? [otherCuisine.trim()] : []),
  ];

  return (
    <div className="mt-3 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Filters used for this search
        </p>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {location?.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
                <span aria-hidden>📍</span>
                {location.trim()}
              </span>
            )}
            {vibeLabels.map((label) => (
              <span key={label} className="inline-flex items-center rounded-full bg-violet-50 border border-violet-200 px-2.5 py-1 text-xs font-medium text-violet-800">
                {label}
              </span>
            ))}
            {cuisineLabels.map((label) => (
              <span key={label} className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-900">
                {label}
              </span>
            ))}
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Group ({people.length})
          </p>
          <ul className="space-y-2">
            {people.map((person, i) => {
              const name = person.name?.trim() || `Person ${i + 1}`;
              const diet = [...(person.diet || []), person.otherDiet].filter(Boolean);
              const flavors = [...(person.flavors || []), person.otherFlavors].filter(Boolean);
              const avoid = [...(person.avoid || []), person.otherAvoid].filter(Boolean);
              const color = PERSON_COLORS[i % PERSON_COLORS.length];
              return (
                <li key={person.id} className={`flex gap-2.5 rounded-xl border px-2.5 py-2 text-xs ${color.border} ${color.bg}`}>
                  <span className="text-base shrink-0 leading-none pt-0.5">{AVATARS[i % AVATARS.length]}</span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-bold text-gray-900">{name}</span>
                      {person.budget && <span className="font-semibold text-brand-600">{person.budget}</span>}
                    </div>
                    {diet.length > 0 && (
                      <p className="text-gray-600 leading-snug">
                        <span className="text-gray-400 font-medium">Diet:</span> {diet.slice(0, 6).join(", ")}{diet.length > 6 ? "…" : ""}
                      </p>
                    )}
                    {flavors.length > 0 && (
                      <p className="text-gray-600 leading-snug">
                        <span className="text-gray-400 font-medium">Cravings:</span> {flavors.slice(0, 5).join(", ")}{flavors.length > 5 ? "…" : ""}
                      </p>
                    )}
                    {avoid.length > 0 && (
                      <p className="text-gray-600 leading-snug">
                        <span className="text-gray-400 font-medium">Avoid:</span> {avoid.slice(0, 4).join(", ")}{avoid.length > 4 ? "…" : ""}
                      </p>
                    )}
                    {!person.budget && diet.length === 0 && flavors.length === 0 && avoid.length === 0 && (
                      <p className="text-gray-400 italic">No preferences set</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

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
function RestaurantCard({ restaurant, people, rank, cuisine = [], otherCuisine = '' }) {
  const { satisfiedCount, totalPeople, passesHardDiet, reasoning } = restaurant;
  const satisfactionPct = Math.round((satisfiedCount / Math.max(totalPeople, 1)) * 100);
  const isBest = rank === 0;

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 bg-white ${
      isBest ? "border-brand-300 shadow-lg shadow-brand-500/10" : "border-gray-100 hover:border-gray-200 hover:shadow-md"
    }`}>
      {isBest && (
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 px-4 py-1.5">
          <span className="text-white text-xs font-black">⭐ BEST MATCH FOR YOUR GROUP</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji + rank */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
              {restaurant.emoji}
            </div>
            <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
              isBest ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {rank + 1}
            </div>
          </div>

          {/* Info */}
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
              {restaurant.isOpen === true && (
                <span className="text-xs font-semibold text-green-600">● Open</span>
              )}
              {restaurant.isOpen === false && (
                <span className="text-xs font-semibold text-red-500">● Closed</span>
              )}
            </div>

            {/* Group satisfaction bar */}
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

        {/* Tags from group preferences */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {/* Cuisine tags (preset only) */}
          {cuisine.map((id) => {
            const label = CUISINE_OPTIONS.find((c) => c.id === id)?.label;
            const emoji = CUISINE_OPTIONS.find((c) => c.id === id)?.emoji;
            if (!label) return null;
            return (
              <span key={id} className="text-xs px-3 py-1.5 rounded-full border font-medium bg-gray-100 text-gray-700 border-gray-200">
                {emoji} {label}
              </span>
            );
          })}
          {/* Diet tags */}
          {[...new Set(people.flatMap((p) => p.diet || []))].map((d) => (
            <span key={d} className="text-xs px-3 py-1.5 rounded-full border font-medium bg-green-100 text-green-700 border-green-200">
              ✓ {d}
            </span>
          ))}
          {/* Flavor tags */}
          {[...new Set(people.flatMap((p) => p.flavors || []))].map((t) => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full border font-medium bg-orange-100 text-orange-700 border-orange-200">
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-3">
          {restaurant.yelpUrl && (
            <a
              href={restaurant.yelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all"
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
export default function StepResults({ location, people, vibe = [], cuisine = [], otherCuisine = '', onReset }) {
  const [sortBy, setSortBy] = useState("match");
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    rankRestaurants({ people, vibe, cuisine, otherCuisine, openNow: true, location })
      .then((data) => { if (!cancelled) setAiData(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
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
        <p className="text-sm font-semibold text-gray-600">
          Finding restaurants for your group…
        </p>
        <p className="text-xs text-gray-400">
          Checking dietary needs, budgets, and vibes
        </p>
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
        <button onClick={onReset} className="text-xs font-semibold text-brand-500 border border-brand-200 px-4 py-2 rounded-xl hover:bg-brand-50 transition-all">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-3 shrink-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-0.5">Results</p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {sorted.length} spots near <span className="text-brand-500">{location}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked for {people.length} {people.length === 1 ? "person" : "people"} · AI-matched
            </p>
          </div>
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-all shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Start over
          </button>
        </div>

        <FilterSummaryCard
          location={location}
          people={people}
          vibe={vibe}
          cuisine={cuisine}
          otherCuisine={otherCuisine}
        />

        {/* AI summary banner */}
        {aiData?.aiSummary && (
          <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
            <p className="text-xs font-bold text-brand-600 mb-0.5">✦ AI Pick</p>
            <p className="text-xs text-gray-700 leading-relaxed">{aiData.aiSummary}</p>
            {aiData.groupInsight && (
              <p className="text-xs text-gray-400 mt-1 italic">{aiData.groupInsight}</p>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { key: "match", label: "⭐ Best match" },
            { key: "distance", label: "📍 Nearest" },
            { key: "rating", label: "★ Top rated" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                sortBy === s.key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 min-h-0">
        {sorted.map((r, i) => (
          <RestaurantCard key={r.id} restaurant={r} people={people} rank={i} cuisine={cuisine} otherCuisine={otherCuisine} />
        ))}
      </div>
    </div>
  );
}
