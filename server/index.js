import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, ".env") });

const app = express();
const corsOptions = {
  origin: [
    "https://nobeef.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}
const YELP_KEY = process.env.YELP_API_KEY;

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

// ─── Yelp ─────────────────────────────────────────────────────────────────────
async function fetchYelpRestaurants(location, vibe = [], cuisine = [], otherCuisine = '', openNow = true) {
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

  const cuisineToYelpAlias = {
    mexican: "mexican", italian: "italian", japanese: "japanese",
    chinese: "chinese", thai: "thai", indian: "indpak", korean: "korean",
    vietnamese: "vietnamese", french: "french", mediterranean: "mediterranean",
    greek: "greek", american: "newamerican,tradamerican", seafood: "seafood",
    bbq: "bbq", pizza: "pizza", middle_eastern: "mideastern,persian",
    caribbean: "caribbean", latin: "latin", breakfast_brunch: "breakfast_brunch",
    desserts: "desserts,icecream,bakeries,cakeshop",
    drinks_na: "bubbletea,juicebars,coffee,tea",
  };

  const vibeCategories = vibe.flatMap((v) => (vibeToCategory[v] || "restaurants").split(",")).map(s => s.trim()).filter(Boolean);
  const selectedCuisines = cuisine.filter((c) => c && c !== "no_preference");

  async function yelpSearch(categories, limit = 20) {
    const params = new URLSearchParams({
      location,
      categories: [...new Set(categories)].join(","),
      limit: String(limit),
      sort_by: "best_match",
    });
    if (openNow) params.set("open_now", "true");
    const res = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
      headers: { Authorization: `Bearer ${YELP_KEY}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Yelp API error: ${err.error?.description || res.status}`);
    }
    const data = await res.json();
    return data.businesses || [];
  }

  let businesses = [];

  if (selectedCuisines.length > 1) {
    // Fetch separately per cuisine so each gets fair representation, then merge & dedupe
    const allCuisines = [...selectedCuisines];
    if (otherCuisine.trim()) allCuisines.push('__other__');
    const perCuisine = Math.max(4, Math.ceil(20 / allCuisines.length));
    const results = await Promise.all(
      allCuisines.map((c) => {
        if (c === '__other__') {
          const params = new URLSearchParams({ location, term: otherCuisine.trim(), limit: String(perCuisine), sort_by: "best_match", open_now: "true" });
          return fetch(`https://api.yelp.com/v3/businesses/search?${params}`, { headers: { Authorization: `Bearer ${YELP_KEY}` } })
            .then(r => r.json()).then(d => d.businesses || []);
        }
        const aliases = (cuisineToYelpAlias[c] || c).split(",").map(s => s.trim());
        const cats = [...new Set([...vibeCategories, ...aliases])];
        return yelpSearch(cats.length ? cats : ["restaurants"], perCuisine);
      })
    );
    const seen = new Set();
    for (const list of results) {
      for (const b of list) {
        if (!seen.has(b.id)) { seen.add(b.id); businesses.push(b); }
      }
    }
  } else {
    // Single cuisine or no cuisine — one request
    const fromCuisine = selectedCuisines.flatMap((c) => (cuisineToYelpAlias[c] || c).split(",").map(s => s.trim()));
    const cats = [...new Set([...vibeCategories, ...fromCuisine])];
    if (otherCuisine.trim()) {
      // Use term search for other cuisine
      const params = new URLSearchParams({ location, term: otherCuisine.trim(), limit: "10", sort_by: "best_match", open_now: "true" });
      const r = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, { headers: { Authorization: `Bearer ${YELP_KEY}` } });
      const d = await r.json();
      const otherResults = d.businesses || [];
      const mainResults = await yelpSearch(cats.length ? cats : ["restaurants"], 10);
      const seen = new Set();
      for (const b of [...mainResults, ...otherResults]) {
        if (!seen.has(b.id)) { seen.add(b.id); businesses.push(b); }
      }
    } else {
      businesses = await yelpSearch(cats.length ? cats : ["restaurants"], 20);
    }
  }

  return businesses.map((b) => ({
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
    yelpUrl: b.url || null,
    lat: b.coordinates?.latitude ?? null,
    lng: b.coordinates?.longitude ?? null,
    isOpen: b.is_closed === false ? true : b.is_closed === true ? false : null,
  }));
}

// ─── AI ranking ───────────────────────────────────────────────────────────────
async function aiRankAndRecommend(restaurants, people, vibe, cuisine, otherCuisine, location) {
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
      if (p.budget) parts.push(`budget: ${p.budget}`);
      return `- ${name}: ${parts.join(" | ") || "no preferences"}`;
    })
    .join("\n");

  const cuisineLabels = [
    ...cuisine.filter((c) => c && c !== "no_preference"),
    ...(otherCuisine.trim() ? [otherCuisine.trim()] : []),
  ];

  const restaurantList = restaurants
    .map((r, i) => `[${i}] ${r.name} — ${r.cuisine}, ${r.price || "$"}, rated ${r.rating}/5, ${r.distance ? r.distance + " mi" : ""}, ${r.address}`)
    .join("\n");

  const prompt = `You are a restaurant recommendation engine.

LOCATION: ${location}
VIBE: ${vibe.join(", ") || "none"}
CUISINE PREFERENCES: ${cuisineLabels.join(", ") || "any"}

GROUP:
${groupSummary}

RESTAURANTS (use the number in brackets as the id):
${restaurantList}

Rank these for the group and return the best 8 results.

RANKING RULES:
1. HARD DIETARY RULE: If any person has a dietary restriction (Vegan, Vegetarian, Halal, Nut-Free, Gluten-Free), the restaurant MUST accommodate it. Skip any that cannot.
2. Use the group's dietary needs, flavor cravings, avoided ingredients, and budgets as the primary ranking signal.
3. Prefer restaurants that match the cuisine preferences if specified.
4. A person with no preferences is automatically satisfied by any restaurant.

Return exactly 8 rankedIds (or fewer if less than 8 restaurants exist). Respond with ONLY valid JSON:
{
  "rankedIds": [0, 1, 2, ...],
  "scores": { "0": 0-100 },
  "passesHardDiet": { "0": true/false },
  "passesBudget": { "0": true/false },
  "satisfiedCounts": { "0": number },
  "reasoning": { "0": "one sentence" },
  "aiSummary": "2-sentence summary of why the top pick is best for this group",
  "groupInsight": "one sentence about the group's key constraints or preferences"
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0].message.content);

  // Map numeric indices back to real restaurant IDs
  return {
    ...result,
    rankedIds: (result.rankedIds || []).map((i) => restaurants[i]?.id).filter(Boolean),
    scores: Object.fromEntries(Object.entries(result.scores || {}).map(([i, v]) => [restaurants[+i]?.id, v])),
    passesHardDiet: Object.fromEntries(Object.entries(result.passesHardDiet || {}).map(([i, v]) => [restaurants[+i]?.id, v])),
    passesBudget: Object.fromEntries(Object.entries(result.passesBudget || {}).map(([i, v]) => [restaurants[+i]?.id, v])),
    satisfiedCounts: Object.fromEntries(Object.entries(result.satisfiedCounts || {}).map(([i, v]) => [restaurants[+i]?.id, v])),
    reasoning: Object.fromEntries(Object.entries(result.reasoning || {}).map(([i, v]) => [restaurants[+i]?.id, v])),
  };
}

// ─── /health ──────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── /api/rank ────────────────────────────────────────────────────────────────
app.post("/api/rank", async (req, res) => {
  try {
    const { people = [], vibe = [], cuisine = [], otherCuisine = '', openNow = true, location = "" } = req.body;
    if (!people.length) return res.status(400).json({ error: "No people provided" });
    if (!location.trim()) return res.status(400).json({ error: "No location provided" });

    const restaurants = await fetchYelpRestaurants(location, vibe, cuisine, otherCuisine, openNow);
    console.log(`Yelp returned ${restaurants.length} restaurants for "${location}"`);

    if (!restaurants.length) {
      return res.status(404).json({ error: `No restaurants found near "${location}"` });
    }

    const aiResult = await aiRankAndRecommend(restaurants, people, vibe, cuisine, otherCuisine, location);

    const ranked = (aiResult.rankedIds || [])
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
      .filter(Boolean)
      .filter((r) => r.passesHardDiet && r.satisfiedCount > 0);

    console.log(`Returning ${ranked.length} ranked restaurants`);

    res.json({
      ranked,
      aiSummary: aiResult.aiSummary ?? null,
      groupInsight: aiResult.groupInsight ?? null,
      usedFallback: false,
    });
  } catch (err) {
    console.error("Rank error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => console.log(`NoBeef API running on :${PORT}`));

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is busy — kill it with: lsof -ti :${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    throw err;
  }
});
