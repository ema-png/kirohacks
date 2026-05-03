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
    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <p className="text-sm font-bold uppercase tracking-wider text-gray-900 sm:text-base">
          Filters used for this search
        </p>
        <svg
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800">
                <span aria-hidden>📍</span>
                {location.trim()}
              </span>
            )}
            {vibeLabels.map((label) => (
              <span key={label} className="inline-flex items-center rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-sm font-medium text-accent-900">
                {label}
              </span>
            ))}
            {cuisineLabels.map((label) => (
              <span key={label} className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-950">
                {label}
              </span>
            ))}
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-900 sm:text-base">
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
                <li key={person.id} className={`flex gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${color.border} ${color.bg}`}>
                  <span className="shrink-0 pt-0.5 text-base leading-none">{AVATARS[i % AVATARS.length]}</span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-bold text-gray-900">{name}</span>
                      {person.budget && <span className="font-semibold text-brand-700">{person.budget}</span>}
                    </div>
                    {diet.length > 0 && (
                      <p className="leading-snug text-gray-800">
                        <span className="font-semibold text-gray-700">Diet:</span> {diet.slice(0, 6).join(", ")}{diet.length > 6 ? "…" : ""}
                      </p>
                    )}
                    {flavors.length > 0 && (
                      <p className="leading-snug text-gray-800">
                        <span className="font-semibold text-gray-700">Cravings:</span> {flavors.slice(0, 5).join(", ")}{flavors.length > 5 ? "…" : ""}
                      </p>
                    )}
                    {avoid.length > 0 && (
                      <p className="leading-snug text-gray-800">
                        <span className="font-semibold text-gray-700">Avoid:</span> {avoid.slice(0, 4).join(", ")}{avoid.length > 4 ? "…" : ""}
                      </p>
                    )}
                    {!person.budget && diet.length === 0 && flavors.length === 0 && avoid.length === 0 && (
                      <p className="italic text-gray-700">No preferences set</p>
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
        <div className="mb-1 flex items-center gap-2">
          <span className="text-base">{AVATARS[index % AVATARS.length]}</span>
          <span className="text-sm font-bold text-gray-900">{personKey}</span>
          <span className="ml-auto text-sm font-semibold text-amber-800">
            ⚠ Limited options
          </span>
        </div>
        <p className="pl-7 text-sm text-gray-700">May need to customize order</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-3 ${color.border} ${color.bg}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">{AVATARS[index % AVATARS.length]}</span>
        <span className="text-sm font-bold text-gray-900">{personKey}</span>
        <span className="ml-auto text-sm font-semibold text-emerald-800">
          ✓ {recs.length} suggestion{recs.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-2 pl-7">
        {recs.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 text-base">{item.emoji || "🍽️"}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-gray-900">{item.name}</p>
              <p className="mt-0.5 text-sm leading-snug text-gray-700">{item.desc}</p>
              {item.matchNote && (
                <p className="mt-0.5 text-sm italic leading-snug text-brand-700">{item.matchNote}</p>
              )}
              {item.price && (
                <p className="mt-0.5 text-sm font-bold text-brand-700">{item.price}</p>
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
        <div className="bg-brand-600 px-4 py-2">
          <span className="text-sm font-black tracking-wide text-white">⭐ BEST MATCH FOR YOUR GROUP</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji + rank */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
              {restaurant.emoji}
            </div>
            <div className={`absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-sm font-black ${
              isBest ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-800"
            }`}>
              {rank + 1}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-bold leading-tight text-gray-900">{restaurant.name}</p>
                <p className="mt-0.5 text-sm text-gray-700">{restaurant.cuisine}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-950">
                ★ {restaurant.rating}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-gray-800">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {restaurant.distance} mi
              </span>
              <span className="text-sm text-gray-700">{restaurant.price}</span>
              <span className="text-sm text-gray-700">{restaurant.address}</span>
              {restaurant.isOpen === true && (
                <span className="text-sm font-semibold text-emerald-800">● Open</span>
              )}
              {restaurant.isOpen === false && (
                <span className="text-sm font-semibold text-red-700">● Closed</span>
              )}
            </div>

            {/* Group satisfaction bar */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Group match</span>
                <span className={`text-sm font-bold ${satisfactionPct >= 80 ? "text-accent-700" : satisfactionPct >= 50 ? "text-brand-600" : "text-brand-700"}`}>
                  {satisfiedCount}/{totalPeople} people satisfied
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    satisfactionPct >= 80 ? "bg-accent-500" : satisfactionPct >= 50 ? "bg-brand-400" : "bg-brand-600"
                  }`}
                  style={{ width: `${satisfactionPct}%` }}
                />
              </div>
            </div>

            {reasoning && (
              <p className="mt-2 text-sm italic leading-relaxed text-gray-800">✦ {reasoning}</p>
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
              <span key={id} className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900">
                {emoji} {label}
              </span>
            );
          })}
          {/* Diet tags */}
          {[...new Set(people.flatMap((p) => p.diet || []))].map((d) => (
            <span key={d} className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-950">
              ✓ {d}
            </span>
          ))}
          {/* Flavor tags */}
          {[...new Set(people.flatMap((p) => p.flavors || []))].map((t) => (
            <span key={t} className="rounded-full border border-orange-300 bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-950">
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-300"
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
        <p className="text-base font-semibold text-gray-800">
          Finding restaurants for your group…
        </p>
        <p className="text-sm text-gray-700">
          Checking dietary needs, budgets, and vibes
        </p>
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <p className="text-3xl">😕</p>
        <p className="text-base font-semibold text-gray-900">No restaurants found</p>
        <p className="text-sm text-gray-700">
          {aiData?.error || "Make sure the backend server is running on port 3001"}
        </p>
        <button onClick={onReset} className="rounded-xl border border-brand-300 px-4 py-2.5 text-sm font-semibold text-brand-800 transition-all hover:bg-brand-50">
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
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-accent-600">Results</p>
            <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              {sorted.length} spots near <span className="text-brand-600">{location}</span>
            </h2>
            <p className="mt-1 text-sm text-gray-800 sm:text-base">
              Ranked for {people.length} {people.length === 1 ? "person" : "people"} · AI-matched
            </p>
          </div>
          <button onClick={onReset} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-800 transition-all hover:bg-gray-100">
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


        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { key: "match", label: "⭐ Best match" },
            { key: "distance", label: "📍 Nearest" },
            { key: "rating", label: "★ Top rated" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                sortBy === s.key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
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
