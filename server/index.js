import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 3001
const YELP_KEY = process.env.YELP_API_KEY

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// ─── Main endpoint: find restaurants ─────────────────────────────────────────
// POST /api/restaurants
// Body: { location, vibe, people }
app.post('/api/restaurants', async (req, res) => {
  const { location, vibe = [], people = [] } = req.body

  if (!location) {
    return res.status(400).json({ error: 'location is required' })
  }

  if (!YELP_KEY) {
    return res.status(500).json({ error: 'YELP_API_KEY not set in .env' })
  }

  try {
    const params = new URLSearchParams({
      term: 'restaurants',
      limit: 10,
      sort_by: 'best_match',
      radius: 1500,
    })

    // Use precise coords if available, otherwise fall back to location string
    const { coords } = req.body
    if (coords?.lat && coords?.lon) {
      params.set('latitude', coords.lat)
      params.set('longitude', coords.lon)
    } else {
      params.set('location', location)
    }

    // Map vibe selections to Yelp category filters
    const vibeCategories = getYelpCategories(vibe)
    if (vibeCategories) params.set('categories', vibeCategories)

    const yelpRes = await fetch(
      `https://api.yelp.com/v3/businesses/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${YELP_KEY}`,
          Accept: 'application/json',
        },
      }
    )

    if (!yelpRes.ok) {
      const err = await yelpRes.text()
      console.error('Yelp error:', err)
      return res.status(502).json({ error: 'Yelp API error', detail: err })
    }

    const data = await yelpRes.json()
    const businesses = data.businesses || []

    // Transform Yelp response into the shape our frontend expects
    const restaurants = businesses.map((b, idx) => ({
      id: b.id,
      name: b.name,
      emoji: getCuisineEmoji(b.categories),
      cuisine: b.categories.map(c => c.title).join(' · '),
      address: b.location.address1 || b.location.display_address?.[0] || '',
      distance: metersToMiles(b.distance),
      rating: b.rating,
      reviews: b.review_count,
      price: b.price || '$',
      priceNum: (b.price || '$').length,
      website: b.url,
      phone: b.display_phone,
      image: b.image_url,
      isClosed: b.is_closed,
      // Real coordinates for the map
      lat: b.coordinates?.latitude,
      lon: b.coordinates?.longitude,
      tags: b.categories.map(c => c.title).slice(0, 3),
      dietSupport: inferDietSupport(b.categories),
      vibeMatch: inferVibeMatch(b.categories, b.price),
      mapX: 20 + (idx * 13) % 65,
      mapY: 20 + (idx * 17) % 60,
      menu: getMockMenu(b.categories, b.price),
    }))

    // Score restaurants against group preferences
    const scored = restaurants
      .map(r => ({ ...r, ...scoreRestaurant(r, people, vibe) }))
      .sort((a, b) => b.score - a.score)

    res.json({ restaurants: scored, location })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function metersToMiles(meters) {
  return Math.round((meters / 1609.34) * 10) / 10
}

function getCuisineEmoji(categories) {
  const titles = categories.map(c => c.alias).join(' ')
  if (titles.includes('mexican')) return '🌮'
  if (titles.includes('pizza')) return '🍕'
  if (titles.includes('burger')) return '🍔'
  if (titles.includes('sushi') || titles.includes('japanese')) return '🍱'
  if (titles.includes('chinese')) return '🥡'
  if (titles.includes('italian')) return '🍝'
  if (titles.includes('salad') || titles.includes('healthy')) return '🥗'
  if (titles.includes('thai')) return '🍜'
  if (titles.includes('indian')) return '🍛'
  if (titles.includes('korean')) return '🥩'
  if (titles.includes('vegan') || titles.includes('vegetarian')) return '🥦'
  if (titles.includes('bakery') || titles.includes('cafe')) return '☕'
  if (titles.includes('seafood')) return '🦞'
  if (titles.includes('chicken')) return '🍗'
  if (titles.includes('sandwich')) return '🥪'
  return '🍽️'
}

function inferDietSupport(categories) {
  const aliases = categories.map(c => c.alias).join(' ')
  const support = []
  if (aliases.includes('vegan')) support.push('Vegan', 'Vegetarian', 'Dairy-Free')
  if (aliases.includes('vegetarian')) support.push('Vegetarian')
  if (aliases.includes('gluten_free') || aliases.includes('gluten-free')) support.push('Gluten-Free')
  if (aliases.includes('halal')) support.push('Halal')
  if (aliases.includes('kosher')) support.push('Kosher')
  if (aliases.includes('salad') || aliases.includes('healthy')) support.push('Vegetarian', 'Gluten-Free')
  if (aliases.includes('mexican') || aliases.includes('latin')) support.push('Gluten-Free')
  return [...new Set(support)]
}

function inferVibeMatch(categories, price) {
  const aliases = categories.map(c => c.alias).join(' ')
  const vibes = []
  const priceLen = (price || '$').length

  if (priceLen >= 3) vibes.push('fancy', 'sit-down')
  if (priceLen <= 2) vibes.push('casual', 'fast-casual')
  if (aliases.includes('fast_food') || aliases.includes('hotdog')) vibes.push('drive-thru', 'fast-casual')
  if (aliases.includes('bars') || aliases.includes('pub')) vibes.push('bar')
  if (aliases.includes('cafe') || aliases.includes('coffee')) vibes.push('casual', 'outdoor')
  if (aliases.includes('pizza') || aliases.includes('sandwiches')) vibes.push('takeout', 'casual')

  return [...new Set(vibes)]
}

// Lightweight scoring — same logic as frontend but runs on real data
function scoreRestaurant(restaurant, people, vibe = []) {
  let score = 0
  let satisfiedCount = 0

  // Vibe bonus
  const vibeMatches = vibe.filter(v => restaurant.vibeMatch?.includes(v)).length
  score += vibeMatches * 15

  for (const person of people) {
    let personScore = 0
    const allTags = [...(person.diet || []), ...(person.flavors || [])]
    const avoidTags = person.avoid || []

    const dietSupported = person.diet?.length === 0 ||
      person.diet?.some(d => restaurant.dietSupport.includes(d))
    if (dietSupported) personScore += 30

    const matchingItems = (restaurant.menu || []).filter(item => {
      const hasAvoid = avoidTags.some(a =>
        item.avoidTags?.includes(a) || item.matchTags?.includes(a)
      )
      if (hasAvoid) return false
      return allTags.some(t => item.matchTags?.includes(t))
    })
    personScore += matchingItems.length * 10

    if (person.budget) {
      const budgetNum = parseInt(person.budget.replace('$', '').replace('+', ''))
      const prices = (restaurant.menu || []).map(m => parseFloat(m.price?.replace('$', '') || '0'))
      const cheapest = Math.min(...prices.filter(p => p > 0))
      if (!isNaN(cheapest) && cheapest <= budgetNum) personScore += 20
    }

    if (personScore > 20) satisfiedCount++
    score += personScore
  }

  return {
    score: Math.round(score / Math.max(people.length, 1)),
    satisfiedCount,
    totalPeople: people.length,
  }
}

// Generic mock menu based on cuisine type — used until real menu scraping is added
function getMockMenu(categories, price) {
  const aliases = categories.map(c => c.alias).join(' ')
  const priceNum = (price || '$').length

  if (aliases.includes('mexican')) {
    return [
      { name: 'Burrito Bowl', desc: 'Rice, beans, protein, salsa, guac', price: priceNum <= 1 ? '$4.00' : '$10.00', matchTags: ['Savory', 'Comfort Food', 'Gluten-Free'], avoidTags: [], emoji: '🥣' },
      { name: 'Veggie Tacos', desc: 'Grilled veggies, salsa, corn tortilla', price: priceNum <= 1 ? '$3.50' : '$9.00', matchTags: ['Vegan', 'Vegetarian', 'Savory'], avoidTags: [], emoji: '🌮' },
      { name: 'Protein Bowl', desc: 'Double protein, no rice, cheese, jalapeños', price: '$12.00', matchTags: ['Keto', 'High Protein', 'Spicy', 'Salty'], avoidTags: [], emoji: '🍗' },
    ]
  }
  if (aliases.includes('burger') || aliases.includes('fast_food')) {
    return [
      { name: 'Classic Burger', desc: 'Beef patty, cheese, lettuce, tomato', price: '$9.00', matchTags: ['Comfort Food', 'Savory', 'Salty', 'Umami'], avoidTags: [], emoji: '🍔' },
      { name: 'Veggie Burger', desc: 'Plant-based patty, all the toppings', price: '$10.00', matchTags: ['Vegetarian', 'Comfort Food', 'Savory'], avoidTags: [], emoji: '🥦' },
      { name: 'Fries', desc: 'Crispy, salted', price: '$4.00', matchTags: ['Comfort Food', 'Salty', 'Budget', 'Vegan'], avoidTags: [], emoji: '🍟' },
    ]
  }
  if (aliases.includes('salad') || aliases.includes('healthy')) {
    return [
      { name: 'Protein Bowl', desc: 'Grains, roasted veggies, protein, dressing', price: '$14.00', matchTags: ['High Protein', 'Savory', 'Gluten-Free', 'Keto'], avoidTags: [], emoji: '🥣' },
      { name: 'Green Salad', desc: 'Mixed greens, seasonal veggies, vinaigrette', price: '$12.00', matchTags: ['Vegan', 'Vegetarian', 'Light', 'Gluten-Free'], avoidTags: [], emoji: '🥗' },
    ]
  }
  if (aliases.includes('pizza')) {
    return [
      { name: 'Margherita Pizza', desc: 'Tomato, mozzarella, basil', price: '$14.00', matchTags: ['Vegetarian', 'Comfort Food', 'Savory'], avoidTags: [], emoji: '🍕' },
      { name: 'Pepperoni Pizza', desc: 'Classic pepperoni, tomato sauce, cheese', price: '$15.00', matchTags: ['Comfort Food', 'Savory', 'Salty', 'Umami'], avoidTags: ['Vegan', 'Vegetarian'], emoji: '🍕' },
    ]
  }
  if (aliases.includes('sushi') || aliases.includes('japanese')) {
    return [
      { name: 'Veggie Roll', desc: 'Cucumber, avocado, pickled radish', price: '$8.00', matchTags: ['Vegan', 'Vegetarian', 'Light', 'Savory'], avoidTags: [], emoji: '🍱' },
      { name: 'Salmon Roll', desc: 'Fresh salmon, rice, nori', price: '$12.00', matchTags: ['High Protein', 'Savory', 'Umami'], avoidTags: ['Vegan', 'Vegetarian'], emoji: '🍣' },
    ]
  }
  // Generic fallback
  return [
    { name: 'House Special', desc: 'Chef\'s signature dish', price: priceNum <= 1 ? '$8.00' : priceNum === 2 ? '$14.00' : '$22.00', matchTags: ['Savory', 'Comfort Food'], avoidTags: [], emoji: '🍽️' },
    { name: 'Vegetarian Option', desc: 'Fresh seasonal vegetables', price: priceNum <= 1 ? '$7.00' : '$13.00', matchTags: ['Vegetarian', 'Vegan', 'Light'], avoidTags: [], emoji: '🥦' },
  ]
}

function getYelpCategories(vibe) {
  const map = {
    'fancy': 'newamerican,french,italian',
    'sit-down': 'restaurants',
    'fast-casual': 'hotdogs,sandwiches,mexican',
    'drive-thru': 'hotdogs,burgers',
    'bar': 'bars,gastropubs',
    'outdoor': 'restaurants',
    'takeout': 'restaurants',
    'casual': 'restaurants',
  }
  const cats = vibe.flatMap(v => (map[v] || '').split(',')).filter(Boolean)
  return cats.length ? [...new Set(cats)].join(',') : null
}

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ PlateShare server running on http://localhost:${PORT}`)
  console.log(`   Yelp key: ${YELP_KEY ? '✓ loaded' : '✗ MISSING — check server/.env'}`)
})
