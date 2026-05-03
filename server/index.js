import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const YELP_KEY = process.env.YELP_API_KEY;

// ─── Yelp: search restaurants near a location ─────────────────────────────────
async function fetchYelpRestaurants(location, vibe = []) {
  if (!YELP_KEY) throw new Error("YELP_API_KEY not set in .env");

  // Map vibe tags to Yelp categories
  const vibeToCategory = {
    fancy: "newamerican,french,italian",
    "sit-down": "restaurants",
    casual: "restaurants",
    "fast-casual": "hotdogs,sandwiches,mexican",
    takeout: "restaurants",
    outdoor: "restaurants",
    bar: "bars",
    "drive-thru": "hotdogs,burgers",
  };

  const categories = vibe.length
    ? [
        ...new Set(
          vibe.flatMap((v) => (vibeToCategory[v] || "restaurants").split(",")),
        ),
      ].join(",")
    : "restaurants";

  const params = new URLSearchParams({
    location,
    categories,
    limit: "15",
    sort_by: "best_match",
    open_now: "true",
  });

  const res = await fetch(
    `https://api.yelp.com/v3/businesses/search?${params}`,
    {
      headers: { Authorization: `Bearer ${YELP_KEY}` },
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Yelp API error: ${err.error?.description || res.status}`);
  }

  const data = await res.json();

  return (data.businesses || []).map((b, idx) => ({
    id: b.id,
    name: b.name,
    emoji: getCuisineEmoji(b.categories?.map((c) => c.alias) || [], b.name),
    cuisine: b.categories?.map((c) => c.title).join(" · ") || "Restaurant",
    address: [b.location?.address1, b.location?.city]
      .filter(Boolean)
      .join(", "),
    distance: b.distance ? Math.round((b.distance / 1609.34) * 10) / 10 : null, // meters → miles
    rating: b.rating || 0,
    reviews: b.review_count || 0,
    price: b.price || "$$",
    priceNum: (b.price || "$$").length,
    website: b.url || null,
    phone: b.phone || null,
    imageUrl: b.image_url || null,
    yelpUrl: b.url || null,
    // Spread pins across a grid for the mock map
    mapX: 10 + ((idx * 19) % 75),
    mapY: 10 + ((idx * 27) % 75),
  }));
}

// ─── Cuisine emoji helper ─────────────────────────────────────────────────────
const CUISINE_EMOJI = {
  mexican: "🌮",
  italian: "🍝",
  japanese: "🍣",
  chinese: "🥡",
  thai: "🍜",
  indian: "🍛",
  american: "🍔",
  mediterranean: "🥙",
  korean: "🥢",
  vietnamese: "🍲",
  french: "🥐",
  greek: "🫒",
  pizza: "🍕",
  sushi: "🍱",
  burger: "🍔",
  seafood: "🦞",
  vegetarian: "🥗",
  vegan: "🌱",
  bakery: "🥐",
  cafe: "☕",
  bar: "🍺",
  steak: "🥩",
  bbq: "🍖",
  default: "🍽️",
};

function getCuisineEmoji(aliases = [], name = "") {
  const combined = [...aliases, name].join(" ").toLowerCase();
  for (const [key, emoji] of Object.entries(CUISINE_EMOJI)) {
    if (combined.includes(key)) return emoji;
  }
  return CUISINE_EMOJI.default;
}

// ─── AI: rank + generate per-person recommendations ───────────────────────────
async function aiRankAndRecommend(restaurants, people, vibe, location) {
  const groupSummary = people
    .map((p, i) => {
      const name = p.name?.trim() || `Person ${i + 1}`;
      const parts = [];
      if (p.diet?.length) parts.push(`dietary: ${p.diet.join(", ")}`);
      if (p.otherDiet) parts.push(`other diet: ${p.otherDiet}`);
      if (p.flavors?.length) parts.push(`craves: ${p.flavors.join(", ")}`);
      if (p.otherFlavors) parts.push(`other cravings: ${p.otherFlavors}`);
      if (p.avoid?.length) parts.push(`avoids: ${p.avoid.join(", ")}`);
      if (p.otherAvoid) parts.push(`also avoids: ${p.otherAvoid}`);
      if (p.budget) parts.push(`budget per meal: ${p.budget}`);
      return `- ${name}: ${parts.join(" | ")}`;
    })
    .join("\n");

  // Build a stable name list so AI uses the exact same keys we'll look up
  const personNames = people.map((p, i) => p.name?.trim() || `Person ${i + 1}`);

  const restaurantList = restaurants
    .map(
      (r) =>
        `[${r.id}] ${r.name} — ${r.cuisine}, ${r.price || "$$"}, rated ${r.rating}/5 (${r.reviews} reviews), ${r.distance ? r.distance + " mi away" : ""}, at ${r.address}`,
    )
    .join("\n");

  const prompt = `You are a restaurant recommendation engine with deep knowledge of restaurant menus worldwide.

LOCATION: ${location}
VIBE PREFERENCES: ${vibe.join(", ") || "none specified"}

GROUP (${people.length} ${people.length === 1 ? "person" : "people"}):
${groupSummary}

PERSON NAMES (use these EXACT strings as keys in perPersonRecs):
${personNames.map((n, i) => `${i + 1}. "${n}"`).join("\n")}

RESTAURANTS TO EVALUATE:
${restaurantList}

YOUR TASK:
1. HARD FILTERS FIRST — rank restaurants that fail any person's non-negotiable dietary need (Vegan, Vegetarian, Halal, Nut-Free, Gluten-Free) or budget last, and flag them.

2. WEIGHTED SCORING for the rest:
   - Dietary satisfaction: 30% — can all people find something to eat?
   - Flavor/craving match: 35% — how well does the menu match each person's cravings?
   - Budget fit: 20% — does the price range work for everyone?
   - Vibe match: 15% — does the restaurant atmosphere match the group's vibe?

3. PER-PERSON DISH RECOMMENDATIONS — for EVERY restaurant and EVERY person, use your knowledge of that restaurant's actual menu (or typical dishes for that cuisine) to suggest 1-2 specific dishes. Match their dietary needs and cravings, avoid their restrictions. Use real dish names, brief descriptions, and realistic price estimates.

IMPORTANT: In perPersonRecs, use the EXACT person name strings listed above as keys.

Respond with ONLY valid JSON:
{
  "rankedIds": ["id1", "id2", ...],
  "scores": { "id": 0-100, ... },
  "passesHardDiet": { "id": true/false, ... },
  "passesBudget": { "id": true/false, ... },
  "satisfiedCounts": { "id": numberOfPeopleSatisfied, ... },
  "reasoning": { "id": "one sentence why this rank", ... },
  "perPersonRecs": {
    "restaurantId": {
      "EXACT_PERSON_NAME": [
        { "name": "Dish Name", "desc": "brief description", "price": "$X.XX", "emoji": "🍽️", "matchNote": "why this fits them" }
      ]
    }
  },
  "aiSummary": "2-sentence summary of why the top pick is best for this specific group",
  "groupInsight": "one sentence about the group's collective preferences or any tricky constraints"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
    timeout: 20_000, // 20s max
  });

  return JSON.parse(completion.choices[0].message.content);
}

// ─── Local fallback scorer (no AI needed) ─────────────────────────────────────
// Uses Yelp data + group tags to score restaurants when OpenAI is unavailable

const HARD_DIET_TAGS = [
  "Vegan",
  "Vegetarian",
  "Halal",
  "Nut-Free",
  "Gluten-Free",
];

// Map Yelp cuisine aliases to what diets they likely support
const CUISINE_DIET_MAP = {
  vegan: ["Vegan", "Vegetarian", "Dairy-Free"],
  vegetarian: ["Vegetarian"],
  salad: ["Vegan", "Vegetarian", "Gluten-Free"],
  indian: ["Vegan", "Vegetarian", "Halal"],
  thai: ["Vegan", "Vegetarian", "Gluten-Free"],
  mexican: ["Vegetarian", "Gluten-Free"],
  japanese: ["Gluten-Free"],
  mediterranean: ["Vegan", "Vegetarian", "Halal"],
  halal: ["Halal"],
  gluten_free: ["Gluten-Free"],
  chinese: ["Vegan", "Vegetarian"],
  korean: ["Vegan", "Vegetarian"],
  pizza: ["Vegetarian"],
  burgers: [],
  steak: [],
  seafood: ["Gluten-Free"],
  bakeries: [],
};

// Map Yelp cuisine aliases to flavor tags
const CUISINE_FLAVOR_MAP = {
  mexican: ["Savory", "Spicy", "Comfort Food"],
  italian: ["Savory", "Comfort Food", "Umami"],
  japanese: ["Umami", "Savory", "Light"],
  chinese: ["Savory", "Umami", "Spicy"],
  thai: ["Spicy", "Sweet", "Savory", "Light"],
  indian: ["Spicy", "Savory", "Comfort Food"],
  american: ["Comfort Food", "Savory", "Salty"],
  mediterranean: ["Savory", "Light"],
  korean: ["Spicy", "Savory", "Umami", "Smoky"],
  vietnamese: ["Savory", "Light", "Umami"],
  french: ["Savory", "Sweet", "Comfort Food"],
  pizza: ["Savory", "Comfort Food", "Salty"],
  burgers: ["Comfort Food", "Savory", "Salty"],
  seafood: ["Savory", "Light", "Umami"],
  bakeries: ["Sweet", "Comfort Food"],
  bbq: ["Smoky", "Savory", "Comfort Food"],
  salad: ["Light", "Savory"],
  steak: ["Savory", "Umami", "Smoky"],
  vegan: ["Light", "Savory"],
  vegetarian: ["Light", "Savory"],
  cafe: ["Sweet", "Light", "Comfort Food"],
};

// Map Yelp cuisine aliases to vibe tags
const CUISINE_VIBE_MAP = {
  burgers: ["casual", "fast-casual"],
  pizza: ["casual", "fast-casual", "takeout"],
  mexican: ["casual", "fast-casual", "takeout"],
  hotdogs: ["casual", "fast-casual", "drive-thru"],
  sandwiches: ["casual", "fast-casual", "takeout"],
  french: ["fancy", "sit-down"],
  italian: ["sit-down", "fancy"],
  japanese: ["sit-down", "casual"],
  steak: ["fancy", "sit-down"],
  bars: ["bar"],
  cafe: ["casual", "outdoor"],
  bakeries: ["casual"],
  salad: ["casual", "fast-casual"],
};

function inferDietSupport(cuisineAliases) {
  const diets = new Set();
  for (const alias of cuisineAliases) {
    for (const [key, supported] of Object.entries(CUISINE_DIET_MAP)) {
      if (alias.includes(key)) supported.forEach((d) => diets.add(d));
    }
  }
  return [...diets];
}

function inferFlavorTags(cuisineAliases) {
  const flavors = new Set();
  for (const alias of cuisineAliases) {
    for (const [key, tags] of Object.entries(CUISINE_FLAVOR_MAP)) {
      if (alias.includes(key)) tags.forEach((t) => flavors.add(t));
    }
  }
  return [...flavors];
}

function inferVibeTags(cuisineAliases) {
  const vibes = new Set();
  for (const alias of cuisineAliases) {
    for (const [key, tags] of Object.entries(CUISINE_VIBE_MAP)) {
      if (alias.includes(key)) tags.forEach((t) => vibes.add(t));
    }
  }
  if (vibes.size === 0) vibes.add("casual"); // default
  return [...vibes];
}

function localScoreRestaurant(restaurant, people, vibe) {
  const aliases = restaurant.cuisine
    .toLowerCase()
    .split(" · ")
    .map((s) => s.trim());
  const dietSupport = inferDietSupport(aliases);
  const flavorTags = inferFlavorTags(aliases);
  const vibeTags = inferVibeTags(aliases);

  // Phase 1: Hard diet filter
  let passesHardDiet = true;
  for (const person of people) {
    const hardNeeds = (person.diet || []).filter((d) =>
      HARD_DIET_TAGS.includes(d),
    );
    for (const need of hardNeeds) {
      if (!dietSupport.includes(need)) {
        passesHardDiet = false;
        break;
      }
    }
  }

  // Phase 1: Budget filter — compare price level to budget
  let passesBudget = true;
  for (const person of people) {
    if (!person.budget) continue;
    const budgetNum = parseInt(person.budget.replace("$", "").replace("+", ""));
    // Rough price-per-item estimate from Yelp price level
    const avgPrice = restaurant.priceNum * 8; // $=8, $$=16, $$$=24, $$$$=32
    if (avgPrice > budgetNum * 1.5) passesBudget = false;
  }

  const hardPenalty = !passesHardDiet || !passesBudget ? -1000 : 0;

  // Phase 2: Weighted scoring
  let totalDietScore = 0;
  let totalFlavorScore = 0;
  let totalBudgetScore = 0;
  let satisfiedCount = 0;

  for (const person of people) {
    // Diet (30%)
    const dietOk =
      !person.diet?.length || person.diet.some((d) => dietSupport.includes(d));
    totalDietScore += dietOk ? 100 : 0;

    // Flavor (35%)
    const personFlavors = [...(person.diet || []), ...(person.flavors || [])];
    const maxTags = personFlavors.length || 1;
    const flavorMatches = personFlavors.filter((f) =>
      flavorTags.includes(f),
    ).length;
    totalFlavorScore += (flavorMatches / maxTags) * 100;

    // Budget (20%)
    if (person.budget) {
      const budgetNum = parseInt(
        person.budget.replace("$", "").replace("+", ""),
      );
      const avgPrice = restaurant.priceNum * 8;
      totalBudgetScore +=
        avgPrice <= budgetNum ? 100 : avgPrice <= budgetNum * 1.3 ? 50 : 0;
    } else {
      totalBudgetScore += 100;
    }

    if (dietOk && flavorMatches > 0) satisfiedCount++;
  }

  const n = Math.max(people.length, 1);
  const dietComp = (totalDietScore / n) * 0.3;
  const flavorComp = (totalFlavorScore / n) * 0.35;
  const budgetComp = (totalBudgetScore / n) * 0.2;

  // Vibe (15%)
  const vibeMatches = vibe.filter((v) => vibeTags.includes(v)).length;
  const vibeComp = vibe.length ? (vibeMatches / vibe.length) * 100 * 0.15 : 15;

  // Rating bonus (tiebreaker)
  const ratingBonus = (restaurant.rating / 5) * 5;

  const score = Math.round(
    dietComp + flavorComp + budgetComp + vibeComp + ratingBonus + hardPenalty,
  );

  return {
    score: Math.max(score, 0),
    satisfiedCount,
    totalPeople: people.length,
    passesHardDiet,
    passesBudget,
    dietSupport,
    tags: flavorTags.slice(0, 3),
    vibeMatch: vibeTags,
    reasoning: null,
    perPersonRecs: {},
  };
}

// ─── /api/rank ────────────────────────────────────────────────────────────────
app.post("/api/rank", async (req, res) => {
  try {
    const { people = [], vibe = [], location = "" } = req.body;

    if (!people.length) {
      return res.status(400).json({ error: "No people provided" });
    }
    if (!location.trim()) {
      return res.status(400).json({ error: "No location provided" });
    }

    // 1. Fetch real restaurants from Yelp
    const restaurants = await fetchYelpRestaurants(location, vibe);

    if (!restaurants.length) {
      return res
        .status(404)
        .json({ error: `No restaurants found near "${location}"` });
    }

    // 2. Try AI ranking, fall back to local scoring
    let ranked,
      aiSummary = null,
      groupInsight = null,
      usedFallback = false;

    try {
      const aiResult = await aiRankAndRecommend(
        restaurants,
        people,
        vibe,
        location,
      );

      ranked = (aiResult.rankedIds || [])
        .map((id) => {
          const r = restaurants.find((x) => x.id === id);
          if (!r) return null;
          return {
            ...r,
            score: aiResult.scores?.[id] ?? 0,
            passesHardDiet: aiResult.passesHardDiet?.[id] ?? true,
            passesBudget: aiResult.passesBudget?.[id] ?? true,
            satisfiedCount: aiResult.satisfiedCounts?.[id] ?? 0,
            totalPeople: people.length,
            reasoning: aiResult.reasoning?.[id] ?? null,
            perPersonRecs: aiResult.perPersonRecs?.[id] ?? {},
          };
        })
        .filter(Boolean);

      aiSummary = aiResult.aiSummary ?? null;
      groupInsight = aiResult.groupInsight ?? null;
    } catch (aiErr) {
      console.warn("AI ranking failed, using local fallback:", aiErr.message);
      usedFallback = true;

      ranked = restaurants
        .map((r) => ({
          ...r,
          ...localScoreRestaurant(r, people, vibe),
        }))
        .sort((a, b) => b.score - a.score);
    }

    res.json({ ranked, aiSummary, groupInsight, usedFallback });
  } catch (err) {
    console.error("Rank error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () =>
  console.log(`PlateShare API running on :${PORT}`),
);

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is busy — kill it with: lsof -ti :${PORT} | xargs kill -9`,
    );
    process.exit(1);
  } else {
    throw err;
  }
});
