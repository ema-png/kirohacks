import React, { useState, useMemo, useEffect } from "react";
import { rankRestaurants } from "../../api/rankRestaurants";
import { PERSON_COLORS, AVATARS } from "./StepPeople";
import { VIBE_OPTIONS, CUISINE_OPTIONS } from "./StepVibe";

function FilterSummaryCard({ location, people, vibe, cuisine }) {
  const vibeLabels = (vibe || [])
    .map((id) => VIBE_OPTIONS.find((v) => v.id === id)?.label)
    .filter(Boolean);
  const cuisineLabels = (cuisine || [])
    .filter((id) => id && id !== "no_preference")
    .map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="mt-3 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        Filters used for this search
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {location?.trim() && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
            <span aria-hidden>📍</span>
            {location.trim()}
          </span>
        )}
        {vibeLabels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-full bg-violet-50 border border-violet-200 px-2.5 py-1 text-xs font-medium text-violet-800"
          >
            {label}
          </span>
        ))}
        {cuisineLabels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-900"
          >
            {label}
          </span>
        ))}
        {!location?.trim() && vibeLabels.length === 0 && cuisineLabels.length === 0 && (
          <span className="text-xs text-gray-400">Location & style from your flow</span>
        )}
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
            <li
              key={person.id}
              className={`flex gap-2.5 rounded-xl border px-2.5 py-2 text-xs ${color.border} ${color.bg}`}
            >
              <span className="text-base shrink-0 leading-none pt-0.5">
                {AVATARS[i % AVATARS.length]}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-bold text-gray-900">{name}</span>
                  {person.budget && (
                    <span className="font-semibold text-brand-600">{person.budget}</span>
                  )}
                </div>
                {diet.length > 0 && (
                  <p className="text-gray-600 leading-snug">
                    <span className="text-gray-400 font-medium">Diet:</span>{" "}
                    {diet.slice(0, 6).join(", ")}
                    {diet.length > 6 ? "…" : ""}
                  </p>
                )}
                {flavors.length > 0 && (
                  <p className="text-gray-600 leading-snug">
                    <span className="text-gray-400 font-medium">Cravings:</span>{" "}
                    {flavors.slice(0, 5).join(", ")}
                    {flavors.length > 5 ? "…" : ""}
                  </p>
                )}
                {avoid.length > 0 && (
                  <p className="text-gray-600 leading-snug">
                    <span className="text-gray-400 font-medium">Avoid:</span>{" "}
                    {avoid.slice(0, 4).join(", ")}
                    {avoid.length > 4 ? "…" : ""}
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
  );
}

// ─── Mock Map ────────────────────────────────────────────────────────────────
function MockMap({ restaurants, selectedId, onSelect }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden rounded-2xl">
      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Fake road lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <line
          x1="0"
          y1="30%"
          x2="100%"
          y2="35%"
          stroke="#e2e8f0"
          strokeWidth="5"
        />
        <line
          x1="0"
          y1="70%"
          x2="100%"
          y2="68%"
          stroke="#e2e8f0"
          strokeWidth="5"
        />
        <line
          x1="30%"
          y1="0"
          x2="32%"
          y2="100%"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <line
          x1="60%"
          y1="0"
          x2="62%"
          y2="100%"
          stroke="#e2e8f0"
          strokeWidth="5"
        />
        <line
          x1="80%"
          y1="0"
          x2="78%"
          y2="100%"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        <text x="5" y="48%" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
          Mission St
        </text>
        <text x="5" y="29%" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
          Market St
        </text>
        <text x="5" y="69%" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
          Valencia St
        </text>
      </svg>

      {/* "You are here" pin */}
      <div
        className="absolute"
        style={{ left: "50%", top: "55%", transform: "translate(-50%,-50%)" }}
      >
        <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-blue-600 font-bold whitespace-nowrap">
          You
        </div>
      </div>

      {/* Restaurant pins */}
      {restaurants.map((r, idx) => {
        const isSelected = r.id === selectedId;
        const isBest = idx === 0;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="absolute group"
            style={{
              left: `${r.mapX}%`,
              top: `${r.mapY}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div
              className={`relative flex flex-col items-center transition-all duration-200 ${isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"}`}
            >
              <div
                className={`px-2.5 py-1.5 rounded-xl shadow-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-brand-500 text-white shadow-brand-500/40"
                    : isBest
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <span>{r.emoji}</span>
                <span className="hidden sm:inline">{r.name.split(" ")[0]}</span>
                {isBest && (
                  <span className="bg-amber-400 text-gray-900 text-xs px-1 rounded font-black">
                    ★
                  </span>
                )}
              </div>
              <div
                className={`w-0.5 h-3 ${isSelected ? "bg-brand-500" : isBest ? "bg-gray-900" : "bg-gray-400"}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${isSelected ? "bg-brand-500" : isBest ? "bg-gray-900" : "bg-gray-400"}`}
              />
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-2 right-3 text-xs text-slate-400 font-medium">
        PlateShare Maps · Mock Data
      </div>
    </div>
  );
}

// ─── Per-person meal matches (AI-generated) ───────────────────────────────────
function PersonMatches({ person, restaurant, index }) {
  const color = PERSON_COLORS[index % PERSON_COLORS.length];
  const personKey = person.name?.trim() || `Person ${index + 1}`;

  // Try exact match first, then case-insensitive, then first available key
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
        <p className="text-xs text-gray-400 pl-7">
          May need to customize order
        </p>
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
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {item.name}
              </p>
              <p className="text-xs text-gray-400 leading-tight">{item.desc}</p>
              {item.matchNote && (
                <p className="text-xs text-brand-500 leading-tight italic mt-0.5">
                  {item.matchNote}
                </p>
              )}
              {item.price && (
                <p className="text-xs font-bold text-brand-600 mt-0.5">
                  {item.price}
                </p>
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

  const {
    score,
    satisfiedCount,
    totalPeople,
    passesHardDiet,
    passesBudget,
    reasoning,
  } = restaurant;
  const satisfactionPct = Math.round(
    (satisfiedCount / Math.max(totalPeople, 1)) * 100,
  );
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
      {/* Best match banner */}
      {isBest && !hasWarning && (
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 px-4 py-1.5 flex items-center gap-2">
          <span className="text-white text-xs font-black">
            ⭐ BEST MATCH FOR YOUR GROUP
          </span>
        </div>
      )}

      {/* Warning banner for hard-filter failures */}
      {hasWarning && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center gap-2">
          <span className="text-amber-700 text-xs font-semibold">
            ⚠{" "}
            {!passesHardDiet
              ? "Doesn't fully support group's dietary needs"
              : "Some items may exceed budget"}
          </span>
        </div>
      )}

      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji + rank */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
              {restaurant.emoji}
            </div>
            <div
              className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                isBest && !hasWarning
                  ? "bg-brand-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {rank + 1}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {restaurant.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {restaurant.cuisine}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                ★ {restaurant.rating}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {restaurant.distance} mi
              </span>
              <span className="text-xs text-gray-400">{restaurant.price}</span>
              <span className="text-xs text-gray-400">
                {restaurant.address}
              </span>
            </div>

            {/* Group satisfaction bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">
                  Group match
                </span>
                <span
                  className={`text-xs font-bold ${satisfactionPct >= 80 ? "text-green-600" : satisfactionPct >= 50 ? "text-amber-600" : "text-red-500"}`}
                >
                  {satisfiedCount}/{totalPeople} people satisfied
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    satisfactionPct >= 80
                      ? "bg-green-500"
                      : satisfactionPct >= 50
                        ? "bg-amber-500"
                        : "bg-red-400"
                  }`}
                  style={{ width: `${satisfactionPct}%` }}
                />
              </div>
            </div>

            {/* AI reasoning snippet */}
            {reasoning && (
              <p className="mt-2 text-xs text-gray-500 italic leading-relaxed">
                ✦ {reasoning}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(restaurant.tags || []).map((t) => (
            <span
              key={t}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
          {(restaurant.dietSupport || []).slice(0, 3).map((d) => (
            <span
              key={d}
              className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
            >
              ✓ {d}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 mt-3">
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Visit website
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-700 py-1.5 rounded-xl hover:bg-brand-50 transition-all"
          >
            {expanded ? "Hide" : "Show"} meals for each person
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Per-person meal matches */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-50 pt-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            What each person can order
          </p>
          {people.map((person, i) => (
            <PersonMatches
              key={person.id}
              person={person}
              restaurant={restaurant}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Results Step ────────────────────────────────────────────────────────
export default function StepResults({ location, people, vibe = [], cuisine = [], onReset }) {
  const [sortBy, setSortBy] = useState("match");
  const [selectedId, setSelectedId] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch AI ranking once on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    console.log("[StepResults] Fetching with:", {
      location,
      people: people.length,
      vibe,
      cuisine,
    });

    rankRestaurants({ people, vibe, cuisine, location })
      .then((data) => {
        console.log("[StepResults] Got data:", {
          ranked: data.ranked?.length,
          error: data.error,
          usedFallback: data.usedFallback,
        });
        if (cancelled) return;
        setAiData(data);
        if (data.ranked?.length > 0) setSelectedId(data.ranked[0].id);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Re-sort the already-ranked list when user changes sort mode
  const sorted = useMemo(() => {
    if (!aiData?.ranked) return [];
    const list = [...aiData.ranked];
    if (sortBy === "distance")
      return list.sort((a, b) => a.distance - b.distance);
    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list; // 'match' — already in AI rank order
  }, [aiData, sortBy]);

  // Map always shows best-match order
  const sortedForMap = useMemo(() => {
    if (!aiData?.ranked) return [];
    return [...aiData.ranked].sort((a, b) => b.score - a.score);
  }, [aiData]);

  // ── Loading state ──────────────────────────────────────────────────────────
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

  // ── No results state ───────────────────────────────────────────────────────
  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <p className="text-3xl">😕</p>
        <p className="text-sm font-semibold text-gray-700">
          No restaurants found
        </p>
        <p className="text-xs text-gray-400">
          {aiData?.error ||
            "Make sure the backend server is running on port 3001"}
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
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-0.5">
              Results
            </p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {sorted.length} spots near{" "}
              <span className="text-brand-500">{location}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked for {people.length}{" "}
              {people.length === 1 ? "person" : "people"} ·{" "}
              {aiData?.usedFallback ? "Smart match" : "AI-matched"}
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-all shrink-0"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Start over
          </button>
        </div>

        <FilterSummaryCard
          location={location}
          people={people}
          vibe={vibe}
          cuisine={cuisine}
        />

        {/* AI summary banner */}
        {aiData?.aiSummary && (
          <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
            <p className="text-xs font-bold text-brand-600 mb-0.5">✦ AI Pick</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {aiData.aiSummary}
            </p>
            {aiData.groupInsight && (
              <p className="text-xs text-gray-400 mt-1 italic">
                {aiData.groupInsight}
              </p>
            )}
          </div>
        )}

        {/* Sort controls */}
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

      {/* Map + list layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden min-h-0">
        {/* Map panel */}
        <div className="h-48 lg:h-auto lg:w-[45%] shrink-0 px-6 pb-3 lg:pb-6 lg:pt-0">
          <MockMap
            restaurants={sortedForMap}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Restaurant list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 min-h-0">
          {sorted.map((r, i) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              people={people}
              rank={i}
              isSelected={r.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
