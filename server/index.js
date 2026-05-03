import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}
const YELP_KEY = process.env.YELP_API_KEY;

// ─── Yelp ─────────────────────────────────────────────────────────────────────
async function fetchYelpRestaurants(location, vibe = []) {
  if (!YELP_KEY) throw new Error("YELP_API_KEY not set in .env");

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
    ? [...new Set(vibe.flatMap((v) => (vibeToCategory[v] || "restaurants").split(",")))].join(",")
    : "restaurants";

  const params = new URLSearchParams({
    location,
    categories,
    limit: "8",
    sort_by: "best_match",
    open_now: "true",
  });

  const res = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
    headers: { Authorization: `Bearer ${YELP_KEY}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Yelp API error: ${err.error?.description || res.status}`);
  }

  const data = await res.json();

  return (data.businesses || []).map((b) => ({
    id: b.id,
    name: b.name,
    emoji: getCuisineEmoji(b.categories?.map((c) => c.alias) || [], b.name),
    cuisine: b.categories?.map((c) => c.title).join(" · ") || "Restaurant",
    address: [b.location?.address1, b.location?.city].filter(Boolean).join(", "),
    distance: b.distance ? Math.round((b.distance / 1609.34) * 10) / 10 : null,
    rating: b.rating || 0,
    reviews: b.review_count || 0,
    price: b.price || "$",
    priceNum: (b.price || "$").length,
    website: b.url || null,
    phone: b.phone || null,
    imageUrl: b.image_url || null,
    yelpUrl: b.url || null,
    lat: b.coordinates?.latitude ?? null,
    lng: b.coordinates?.longitude ?? null,
  }));
}

// ─── Cuisine emoji ────────────────────────────────────────────────────────────
const CUISINE_EMOJI = {
  mexican: "🌮", italian: "🍝", japanese: "🍣", chinese: "🥡", thai: "🍜",
  indian: "🍛", american: "🍔", mediterranean: "🥙", korean: "🥢", vietnamese: "🍲",
  french: "🥐", greek: "🫒", pizza: "🍕", sushi: "🍱", burger: "🍔",
  seafood: "🦞", vegetarian: "🥗", vegan: "🌱", bakery: "🥐", cafe: "☕",
  bar: "🍺", steak: "🥩", bbq: "🍖", default: "🍽️",
};

function getCuisineEmoji(aliases = [], name = "") {
  const combined = [...aliases, name].join(" ").toLowerCase();
  for (const [key, emoji] of Object.entries(CUISINE_EMOJI)) {
    if (combined.includes(key)) return emoji;
  }
  return CUISINE_EMOJI.default;
}

// ─── AI ranking ───────────────────────────────────────────────────────────────
async function aiRankAndRecommend(restaurants, people, vibe, location) {
  const candidates = restaurants.slice(0, 8);

  const groupSummary = people
    .map((p, i) => {
      const name = p.name?.trim() || `Person ${i + 1}`;
      const parts = [];
      if (p.diet?.length) parts.push(`dietary: ${p.diet.join(", ")}`);
      if (p.otherDiet) parts.push(`other diet: ${p.otherDiet}`);
      if (p.flavors?.length) parts.push(`craves: ${p.flavors.join(", ")}`);
      if (p.avoid?.length) parts.push(`avoids: ${p.avoid.join(", ")}`);
      if (p.budget) parts.push(`budget: ${p.budget}`);
      return `- ${name}: ${parts.join(" | ") || "no preferences"}`;
    })
    .join("\n");

  // Use simple numeric keys so the AI can't mangle Yelp's long IDs
  const restaurantList = candidates
    .map((r, i) => `[${i}] ${r.name} — ${r.cuisine}, ${r.price || "$"}, rated ${r.rating}/5, ${r.distance ? r.distance + " mi" : ""}, ${r.address}`)
    .join("\n");

  const prompt = `You are a restaurant recommendation engine.

LOCATION: ${location}
VIBE: ${vibe.join(", ") || "none"}
GROUP:
${groupSummary}

RESTAURANTS (use the number in brackets as the id):
${restaurantList}

Rank these for the group. Hard-filter any that fail a person's dietary need (Vegan, Vegetarian, Halal, Nut-Free, Gluten-Free) or budget to the bottom.
A person with no preferences is automatically satisfied by any restaurant.

Respond with ONLY valid JSON:
{
  "rankedIds": [0, 1, 2, ...],
  "scores": { "0": 0-100 },
  "passesHardDiet": { "0": true/false },
  "passesBudget": { "0": true/false },
  "satisfiedCounts": { "0": number },
  "reasoning": { "0": "one sentence" },
  "aiSummary": "2-sentence summary of why the top pick is best",
  "groupInsight": "one sentence about the group's constraints"
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0].message.content);

  // Map numeric indices back to real restaurant objects
  return {
    ...result,
    rankedIds: (result.rankedIds || []).map((i) => candidates[i]?.id).filter(Boolean),
    scores: Object.fromEntries(Object.entries(result.scores || {}).map(([i, v]) => [candidates[+i]?.id, v])),
    passesHardDiet: Object.fromEntries(Object.entries(result.passesHardDiet || {}).map(([i, v]) => [candidates[+i]?.id, v])),
    passesBudget: Object.fromEntries(Object.entries(result.passesBudget || {}).map(([i, v]) => [candidates[+i]?.id, v])),
    satisfiedCounts: Object.fromEntries(Object.entries(result.satisfiedCounts || {}).map(([i, v]) => [candidates[+i]?.id, v])),
    reasoning: Object.fromEntries(Object.entries(result.reasoning || {}).map(([i, v]) => [candidates[+i]?.id, v])),
  };
}

// ─── Local fallback scorer ────────────────────────────────────────────────────
const HARD_DIET_TAGS = ["Vegan", "Vegetarian", "Halal", "Nut-Free", "Gluten-Free"];

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
  burgers: [], steak: [], seafood: ["Gluten-Free"], bakeries: [],
};

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

function inferDietSupport(aliases) {
  const diets = new Set();
  for (const alias of aliases)
    for (const [key, supported] of Object.entries(CUISINE_DIET_MAP))
      if (alias.includes(key)) supported.forEach((d) => diets.add(d));
  return [...diets];
}

function inferFlavorTags(aliases) {
  const flavors = new Set();
  for (const alias of aliases)
    for (const [key, tags] of Object.entries(CUISINE_FLAVOR_MAP))
      if (alias.includes(key)) tags.forEach((t) => flavors.add(t));
  return [...flavors];
}

function inferVibeTags(aliases) {
  const vibes = new Set();
  for (const alias of aliases)
    for (const [key, tags] of Object.entries(CUISINE_VIBE_MAP))
      if (alias.includes(key)) tags.forEach((t) => vibes.add(t));
  if (vibes.size === 0) vibes.add("casual");
  return [...vibes];
}

function localScoreRestaurant(restaurant, people, vibe) {
  const aliases = restaurant.cuisine.toLowerCase().split(" · ").map((s) => s.trim());
  const dietSupport = inferDietSupport(aliases);
  const flavorTags = inferFlavorTags(aliases);
  const vibeTags = inferVibeTags(aliases);

  let passesHardDiet = true;
  for (const person of people) {
    const hardNeeds = (person.diet || []).filter((d) => HARD_DIET_TAGS.includes(d));
    for (const need of hardNeeds) {
      if (!dietSupport.includes(need)) { passesHardDiet = false; break; }
    }
  }

  let passesBudget = true;
  for (const person of people) {
    if (!person.budget) continue;
    const budgetNum = parseInt(person.budget.replace("$", "").replace("+", ""));
    const avgPrice = restaurant.priceNum * 8;
    if (avgPrice > budgetNum * 1.5) passesBudget = false;
  }

  const hardPenalty = !passesHardDiet || !passesBudget ? -1000 : 0;

  let totalDietScore = 0, totalFlavorScore = 0, totalBudgetScore = 0, satisfiedCount = 0;

  for (const person of people) {
    const dietOk = !person.diet?.length || person.diet.some((d) => dietSupport.includes(d));
    totalDietScore += dietOk ? 100 : 0;

    const personFlavors = [...(person.diet || []), ...(person.flavors || [])];
    const flavorMatches = personFlavors.filter((f) => flavorTags.includes(f)).length;
    totalFlavorScore += personFlavors.length ? (flavorMatches / personFlavors.length) * 100 : 100;

    if (person.budget) {
      const budgetNum = parseInt(person.budget.replace("$", "").replace("+", ""));
      const avgPrice = restaurant.priceNum * 8;
      totalBudgetScore += avgPrice <= budgetNum ? 100 : avgPrice <= budgetNum * 1.3 ? 50 : 0;
    } else {
      totalBudgetScore += 100;
    }

    if (dietOk && (personFlavors.length === 0 || flavorMatches > 0)) satisfiedCount++;
  }

  const n = Math.max(people.length, 1);
  const vibeMatches = vibe.filter((v) => vibeTags.includes(v)).length;
  const vibeComp = vibe.length ? (vibeMatches / vibe.length) * 100 * 0.15 : 15;
  const ratingBonus = (restaurant.rating / 5) * 5;

  const score = Math.round(
    (totalDietScore / n) * 0.3 +
    (totalFlavorScore / n) * 0.35 +
    (totalBudgetScore / n) * 0.2 +
    vibeComp + ratingBonus + hardPenalty
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
  };
}

app.get("/health", (req, res) => res.json({ status: "ok" }));

// ─── /api/rank ────────────────────────────────────────────────────────────────
app.post("/api/rank", async (req, res) => {
  try {
    const { people = [], vibe = [], location = "" } = req.body;
    if (!people.length) return res.status(400).json({ error: "No people provided" });
    if (!location.trim()) return res.status(400).json({ error: "No location provided" });

    const restaurants = await fetchYelpRestaurants(location, vibe);
    console.log(`Yelp returned ${restaurants.length} restaurants for "${location}"`);
    if (!restaurants.length) return res.status(404).json({ error: `No restaurants found near "${location}"` });

    let ranked, aiSummary = null, groupInsight = null, usedFallback = false;

    try {
          const aiResult = await aiRankAndRecommend(restaurants, people, vibe, location);

      ranked = (aiResult.rankedIds || [])
        .map((id) => {
          const r = restaurants.find((x) => x.id === id);
          if (!r) return null;
          return {
            ...r,
            score: aiResult.scores?.[id] ?? 0,
            passesHardDiet: aiResult.passesHardDiet?.[id] ?? true,
            passesBudget: aiResult.passesBudget?.[id] ?? true,
            satisfiedCount: aiResult.satisfiedCounts?.[id] ?? people.length,
            totalPeople: people.length,
            reasoning: aiResult.reasoning?.[id] ?? null,
          };
        })
        .filter(Boolean);
      console.log(`AI ranked ${ranked.length} restaurants`);

      aiSummary = aiResult.aiSummary ?? null;
      groupInsight = aiResult.groupInsight ?? null;
    } catch (aiErr) {
      console.warn("AI ranking failed, using local fallback:", aiErr.message);
      usedFallback = true;
      ranked = restaurants
        .map((r) => ({ ...r, ...localScoreRestaurant(r, people, vibe) }))
        .sort((a, b) => b.score - a.score);
    }

    res.json({ ranked, aiSummary, groupInsight, usedFallback });
  } catch (err) {
    console.error("Rank error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => console.log(`PlateShare API running on :${PORT}`));

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is busy — kill it with: lsof -ti :${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    throw err;
  }
});
