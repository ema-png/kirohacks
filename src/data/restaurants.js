// Mock restaurant database with menu items tagged by diet/flavor profile
export const RESTAURANT_DB = [
  {
    id: 1,
    name: "Chipotle Mexican Grill",
    emoji: "🌯",
    cuisine: "Mexican · Fast Casual",
    address: "142 Mission St",
    distance: 0.3,
    rating: 4.4,
    reviews: 1820,
    price: "$",
    priceNum: 1,
    website: "https://www.chipotle.com",
    vibeMatch: ["fast-casual", "casual", "takeout"],
    tags: ["Customizable", "Fast", "Group-Friendly"],
    mapX: 62,
    mapY: 44,
    dietSupport: ["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Dairy-Free"],
    menu: [
      {
        name: "Sofritas Burrito Bowl",
        desc: "Plant-based protein, black beans, fajita veggies, fresh salsa, guac",
        price: "$9.25",
        matchTags: [
          "Vegan",
          "Vegetarian",
          "High Protein",
          "Savory",
          "Dairy-Free",
        ],
        avoidTags: [],
        emoji: "🥣",
      },
      {
        name: "Chicken Keto Bowl",
        desc: "No rice, double chicken, cheese, sour cream, guac, jalapeños",
        price: "$11.50",
        matchTags: ["Keto", "High Protein", "Salty", "Spicy"],
        avoidTags: ["Mushrooms"],
        emoji: "🍗",
      },
      {
        name: "Kids Burrito Bowl",
        desc: "Rice, beans, mild salsa, cheese — simple and satisfying",
        price: "$4.75",
        matchTags: ["Comfort Food", "Mild", "Budget"],
        avoidTags: [],
        emoji: "🍱",
      },
      {
        name: "Veggie Burrito",
        desc: "Fajita veggies, black beans, rice, pico, guac wrapped in a flour tortilla",
        price: "$8.50",
        matchTags: ["Vegetarian", "Vegan", "Savory", "Comfort Food"],
        avoidTags: [],
        emoji: "🌯",
      },
    ],
  },
  {
    id: 2,
    name: "Sweetgreen",
    emoji: "🥗",
    cuisine: "Salads · Healthy",
    address: "225 Bush St",
    distance: 0.5,
    rating: 4.5,
    reviews: 940,
    price: "$$",
    priceNum: 2,
    website: "https://www.sweetgreen.com",
    vibeMatch: ["casual", "fast-casual", "takeout", "outdoor"],
    tags: ["Healthy", "Fresh", "Customizable"],
    mapX: 35,
    mapY: 30,
    dietSupport: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto"],
    menu: [
      {
        name: "Harvest Bowl",
        desc: "Roasted chicken, wild rice, roasted sweet potato, apple, goat cheese, balsamic",
        price: "$14.25",
        matchTags: ["High Protein", "Savory", "Comfort Food", "Gluten-Free"],
        avoidTags: [],
        emoji: "🥣",
      },
      {
        name: "Guacamole Greens",
        desc: "Romaine, black beans, corn, tomato, tortilla chips, lime squeeze",
        price: "$12.50",
        matchTags: ["Vegan", "Vegetarian", "Savory", "Light"],
        avoidTags: [],
        emoji: "🥗",
      },
      {
        name: "Kale Caesar",
        desc: "Kale, shaved parmesan, breadcrumbs, caesar dressing",
        price: "$11.75",
        matchTags: ["Vegetarian", "Savory", "Light"],
        avoidTags: [],
        emoji: "🥬",
      },
      {
        name: "Protein Plate",
        desc: "Double chicken, roasted veggies, no grains, tahini dressing",
        price: "$15.00",
        matchTags: ["Keto", "High Protein", "Gluten-Free", "Dairy-Free"],
        avoidTags: [],
        emoji: "💪",
      },
    ],
  },
  {
    id: 3,
    name: "Shake Shack",
    emoji: "🍔",
    cuisine: "American · Burgers",
    address: "1 Grant Ave",
    distance: 0.2,
    rating: 4.6,
    reviews: 2340,
    price: "$$",
    priceNum: 2,
    website: "https://www.shakeshack.com",
    vibeMatch: ["casual", "fast-casual", "sit-down", "outdoor"],
    tags: ["Popular", "Comfort Food", "Fast"],
    mapX: 50,
    mapY: 60,
    dietSupport: ["Vegetarian"],
    menu: [
      {
        name: "ShackBurger",
        desc: "Beef patty, American cheese, lettuce, tomato, ShackSauce",
        price: "$8.99",
        matchTags: ["Comfort Food", "Savory", "Salty", "Umami"],
        avoidTags: [],
        emoji: "🍔",
      },
      {
        name: "'Shroom Burger",
        desc: "Crispy portobello mushroom, muenster & cheddar cheese, lettuce, tomato",
        price: "$9.49",
        matchTags: ["Vegetarian", "Comfort Food", "Savory"],
        avoidTags: ["Mushrooms"],
        emoji: "🍄",
      },
      {
        name: "Crinkle Cut Fries",
        desc: "Classic crinkle-cut, perfectly salted",
        price: "$3.99",
        matchTags: ["Comfort Food", "Salty", "Budget", "Vegan"],
        avoidTags: [],
        emoji: "🍟",
      },
      {
        name: "Vanilla Shake",
        desc: "Hand-spun vanilla custard milkshake",
        price: "$5.99",
        matchTags: ["Sweet", "Comfort Food", "Dessert"],
        avoidTags: ["Dairy-Free", "Vegan"],
        emoji: "🥤",
      },
    ],
  },
  {
    id: 4,
    name: "Tartine Manufactory",
    emoji: "🥐",
    cuisine: "Bakery · Café",
    address: "595 Alabama St",
    distance: 0.8,
    rating: 4.7,
    reviews: 3100,
    price: "$$$",
    priceNum: 3,
    website: "https://www.tartinebakery.com",
    vibeMatch: ["fancy", "sit-down", "casual", "outdoor"],
    tags: ["Artisan", "Cozy", "Brunch"],
    mapX: 20,
    mapY: 65,
    dietSupport: ["Vegetarian"],
    menu: [
      {
        name: "Avocado Toast",
        desc: "Country bread, smashed avocado, chili flakes, lemon, sea salt",
        price: "$14.00",
        matchTags: ["Vegetarian", "Vegan", "Savory", "Light"],
        avoidTags: [],
        emoji: "🥑",
      },
      {
        name: "Morning Bun",
        desc: "Flaky croissant dough, orange zest, cinnamon sugar",
        price: "$5.50",
        matchTags: ["Sweet", "Comfort Food", "Dessert"],
        avoidTags: ["Vegan", "Dairy-Free", "Gluten-Free"],
        emoji: "🥐",
      },
      {
        name: "Grain Bowl",
        desc: "Farro, roasted beets, kale, soft egg, tahini",
        price: "$16.00",
        matchTags: ["Vegetarian", "High Protein", "Savory", "Umami"],
        avoidTags: [],
        emoji: "🥣",
      },
    ],
  },
  {
    id: 5,
    name: "Burma Superstar",
    emoji: "🍜",
    cuisine: "Burmese · Asian",
    address: "309 Clement St",
    distance: 1.2,
    rating: 4.8,
    reviews: 4200,
    price: "$$",
    priceNum: 2,
    website: "https://www.burmasuperstar.com",
    vibeMatch: ["sit-down", "casual", "fancy"],
    tags: ["Unique", "Flavorful", "Group-Friendly"],
    mapX: 78,
    mapY: 25,
    dietSupport: ["Vegan", "Vegetarian", "Gluten-Free"],
    menu: [
      {
        name: "Tea Leaf Salad",
        desc: "Fermented tea leaves, crunchy mix-ins, tomatoes, lime",
        price: "$13.50",
        matchTags: ["Vegan", "Savory", "Umami", "Light"],
        avoidTags: [],
        emoji: "🥗",
      },
      {
        name: "Rainbow Salad",
        desc: "Shredded cabbage, carrots, noodles, peanuts, tamarind dressing",
        price: "$12.00",
        matchTags: ["Vegan", "Vegetarian", "Sweet", "Savory", "Light"],
        avoidTags: ["Nut-Free"],
        emoji: "🌈",
      },
      {
        name: "Mohinga",
        desc: "Fish noodle soup, lemongrass, crispy fritters",
        price: "$14.00",
        matchTags: ["Savory", "Umami", "Comfort Food", "Spicy"],
        avoidTags: ["Vegan", "Vegetarian"],
        emoji: "🍜",
      },
      {
        name: "Samusa Soup",
        desc: "Crispy samosas in a spiced yellow split pea soup",
        price: "$11.00",
        matchTags: ["Vegan", "Vegetarian", "Spicy", "Comfort Food", "Savory"],
        avoidTags: [],
        emoji: "🥘",
      },
    ],
  },
  {
    id: 6,
    name: "Tacos El Gordo",
    emoji: "🌮",
    cuisine: "Mexican · Street Tacos",
    address: "88 Valencia St",
    distance: 0.6,
    rating: 4.3,
    reviews: 870,
    price: "$",
    priceNum: 1,
    website: "https://www.tacosdelgordo.com",
    vibeMatch: ["casual", "fast-casual", "takeout", "drive-thru"],
    tags: ["Cheap", "Authentic", "Fast"],
    mapX: 45,
    mapY: 78,
    dietSupport: ["Gluten-Free"],
    menu: [
      {
        name: "Carne Asada Taco",
        desc: "Grilled beef, onion, cilantro, salsa verde, corn tortilla",
        price: "$3.50",
        matchTags: ["Savory", "Salty", "Spicy", "Budget", "Gluten-Free"],
        avoidTags: ["Vegan", "Vegetarian"],
        emoji: "🌮",
      },
      {
        name: "Al Pastor Taco",
        desc: "Marinated pork, pineapple, onion, cilantro",
        price: "$3.50",
        matchTags: ["Savory", "Sweet", "Spicy", "Budget"],
        avoidTags: ["Vegan", "Vegetarian", "Keto"],
        emoji: "🌮",
      },
      {
        name: "Nopales Taco",
        desc: "Grilled cactus, black beans, salsa, corn tortilla",
        price: "$3.00",
        matchTags: ["Vegan", "Vegetarian", "Budget", "Savory", "Gluten-Free"],
        avoidTags: [],
        emoji: "🌵",
      },
      {
        name: "Horchata",
        desc: "House-made rice milk, cinnamon, vanilla",
        price: "$2.50",
        matchTags: ["Sweet", "Budget", "Vegan"],
        avoidTags: [],
        emoji: "🥛",
      },
    ],
  },
];

// Get best matching menu items for a specific person at a restaurant
// Used by StepResults to show per-person meal suggestions
export function getPersonMenuMatches(restaurant, person) {
  const allTags = [...(person.diet || []), ...(person.flavors || [])];
  const avoidTags = person.avoid || [];

  return (restaurant.menu || [])
    .map((item) => {
      const hasAvoid = avoidTags.some(
        (a) =>
          item.avoidTags?.includes(a) ||
          item.name?.toLowerCase().includes(a.toLowerCase()),
      );
      const matchCount = allTags.filter((t) =>
        item.matchTags?.includes(t),
      ).length;
      return { ...item, matchCount, hasAvoid };
    })
    .filter((item) => !item.hasAvoid)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 2);
}

// ─── Three-phase ranking strategy ─────────────────────────────────────────────
// Phase 1: Hard filters (dietary non-negotiables + budget accommodation)
// Phase 2: Budget fit (ensure all people have options within budget)
// Phase 3: Weighted scoring (diet 30%, flavors 35%, budget 20%, vibe 15%)

const HARD_DIET_TAGS = [
  "Vegan",
  "Vegetarian",
  "Halal",
  "Nut-Free",
  "Gluten-Free",
];

/**
 * Check if restaurant supports all hard dietary requirements for the group
 */
function passesHardDietFilter(restaurant, people) {
  for (const person of people) {
    const hardNeeds = (person.diet || []).filter((d) =>
      HARD_DIET_TAGS.includes(d),
    );
    for (const need of hardNeeds) {
      if (!(restaurant.dietSupport || []).includes(need)) return false;
    }
  }
  return true;
}

/**
 * Check if restaurant has at least one item within each person's budget
 */
function passesBudgetFilter(restaurant, people) {
  for (const person of people) {
    if (!person.budget) continue;
    const budgetNum = parseInt(person.budget.replace("$", "").replace("+", ""));
    const menuPrices = (restaurant.menu || []).map((m) =>
      parseFloat(m.price?.replace("$", "") || "0"),
    );
    const cheapest = Math.min(...menuPrices);
    if (cheapest > budgetNum) return false;
  }
  return true;
}

/**
 * Score a restaurant using weighted averages
 * Returns: { score, satisfiedCount, passesHardDiet, passesBudget }
 */
export function scoreRestaurant(restaurant, people, vibe = []) {
  // Phase 1: Hard filters
  const passesHardDiet = passesHardDietFilter(restaurant, people);
  const passesBudget = passesBudgetFilter(restaurant, people);

  // Restaurants that fail hard filters get a penalty score
  const hardFilterPenalty = !passesHardDiet || !passesBudget ? -1000 : 0;

  // Phase 3: Weighted scoring
  let totalDietScore = 0;
  let totalFlavorScore = 0;
  let totalBudgetScore = 0;
  let satisfiedCount = 0;

  for (const person of people) {
    const allTags = [...(person.diet || []), ...(person.flavors || [])];
    const avoidTags = person.avoid || [];

    // Diet satisfaction (30% weight)
    const dietSupported =
      !person.diet?.length ||
      person.diet.some((d) => (restaurant.dietSupport || []).includes(d));
    totalDietScore += dietSupported ? 100 : 0;

    // Safe menu items (not violating avoids)
    const safeItems = (restaurant.menu || []).filter(
      (item) =>
        !avoidTags.some(
          (a) => item.avoidTags?.includes(a) || item.matchTags?.includes(a),
        ),
    );

    // Flavor/craving tag match (35% weight) — weighted average
    const maxPossibleMatches = allTags.length || 1;
    const flavorScores = safeItems.map((item) => {
      const matches = allTags.filter((t) => item.matchTags?.includes(t)).length;
      return matches / maxPossibleMatches;
    });
    const avgFlavorScore = flavorScores.length
      ? (flavorScores.reduce((a, b) => a + b, 0) / flavorScores.length) * 100
      : 0;
    totalFlavorScore += avgFlavorScore;

    // Budget fit (20% weight)
    if (person.budget) {
      const budgetNum = parseInt(
        person.budget.replace("$", "").replace("+", ""),
      );
      const affordableCount = safeItems.filter(
        (item) => parseFloat(item.price?.replace("$", "") || "0") <= budgetNum,
      ).length;
      totalBudgetScore += safeItems.length
        ? (affordableCount / safeItems.length) * 100
        : 0;
    } else {
      totalBudgetScore += 100; // no budget constraint = full score
    }

    // Count satisfied people
    if (dietSupported && safeItems.length > 0) satisfiedCount++;
  }

  const n = Math.max(people.length, 1);
  const dietComponent = (totalDietScore / n) * 0.3;
  const flavorComponent = (totalFlavorScore / n) * 0.35;
  const budgetComponent = (totalBudgetScore / n) * 0.2;

  // Vibe match (15% weight)
  const vibeMatchCount = vibe.filter((v) =>
    (restaurant.vibeMatch || []).includes(v),
  ).length;
  const vibeComponent = vibe.length
    ? (vibeMatchCount / vibe.length) * 100 * 0.15
    : 15; // no vibe preference = neutral bonus

  const score = Math.round(
    dietComponent +
      flavorComponent +
      budgetComponent +
      vibeComponent +
      hardFilterPenalty,
  );

  return {
    score: Math.max(score, 0),
    satisfiedCount,
    totalPeople: people.length,
    passesHardDiet,
    passesBudget,
  };
}
