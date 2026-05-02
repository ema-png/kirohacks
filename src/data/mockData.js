export const friends = [
  {
    id: 1,
    name: 'Alex',
    avatar: '🧑‍🦱',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
    dotColor: 'bg-violet-500',
    tags: ['Vegan', 'High Protein', 'Savory', 'No Dairy'],
    budget: '$12',
  },
  {
    id: 2,
    name: 'Jordan',
    avatar: '👩‍🦰',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500',
    tags: ['Keto', 'No Mushrooms', 'Salty', 'Spicy OK'],
    budget: '$18',
  },
  {
    id: 3,
    name: 'Sam',
    avatar: '🧑‍🦳',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    tags: ['Comfort Food', 'Sweet Drink', 'No Restrictions'],
    budget: '$5',
  },
]

export const aiResult = {
  restaurant: {
    name: 'Chipotle Mexican Grill',
    cuisine: 'Mexican / Fast Casual',
    distance: '0.3 mi away',
    rating: 4.4,
    priceRange: '$',
    emoji: '🌯',
    tags: ['Customizable', 'Fast', 'Group-Friendly'],
  },
  baseMeal: 'Burrito Bowl — rice, black beans, fajita veggies, salsa, guac',
  remixes: [
    {
      friend: 'Alex',
      avatar: '🧑‍🦱',
      color: 'bg-violet-50 border-violet-200',
      headerColor: 'bg-violet-500',
      mod: 'Double sofritas (plant protein), extra guac, no cheese, no sour cream',
      note: 'Vegan + high protein ✓',
    },
    {
      friend: 'Jordan',
      avatar: '👩‍🦰',
      color: 'bg-rose-50 border-rose-200',
      headerColor: 'bg-rose-500',
      mod: 'No rice, extra chicken, extra cheese, jalapeños, skip the beans',
      note: 'Keto-friendly, no mushrooms ✓',
    },
    {
      friend: 'Sam',
      avatar: '🧑‍🦳',
      color: 'bg-amber-50 border-amber-200',
      headerColor: 'bg-amber-500',
      mod: 'Kids bowl — rice, beans, mild salsa + a fountain drink',
      note: 'Under $5, comfort food ✓',
    },
  ],
}

export const features = [
  {
    icon: '🤝',
    title: 'Group Preference Matching',
    desc: 'Collects every person\'s tastes, cravings, and vibes — then finds the overlap that makes everyone happy.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
  {
    icon: '🥗',
    title: 'Dietary Restriction Handling',
    desc: 'Vegan, keto, gluten-free, nut allergy, halal — the AI knows what\'s off the table before it suggests anything.',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
  },
  {
    icon: '💰',
    title: 'Budget Balancing',
    desc: 'Different people, different wallets. The AI finds spots where everyone can order something they actually want.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
  },
  {
    icon: '🌶️',
    title: 'Craving & Flavor Matching',
    desc: 'Salty, sweet, spicy, savory, comfort food — the AI maps flavor profiles to real menu options nearby.',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
  },
  {
    icon: '📍',
    title: 'Nearby Restaurant Discovery',
    desc: 'Location-aware search finds real spots close to your group — not just generic recommendations.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    icon: '🍱',
    title: 'Base Meal + Modular Remixes',
    desc: 'One shared meal, personalized for each person. Everyone orders from the same place, customized their way.',
    color: 'from-brand-500 to-amber-500',
    bg: 'bg-orange-50',
  },
  {
    icon: '⚡',
    title: 'Fast Decision Making',
    desc: 'What used to take 45 minutes of group chat chaos now takes under 30 seconds.',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: '🧠',
    title: 'AI Mediator Agent',
    desc: 'Not a search engine. Not a delivery app. A true AI agent that negotiates preferences and finds the middle ground.',
    color: 'from-accent-500 to-pink-600',
    bg: 'bg-fuchsia-50',
  },
]

export const problems = [
  {
    emoji: '💬',
    title: '"I\'m vegan, I can\'t eat there."',
    desc: 'One person\'s restriction kills the whole suggestion.',
  },
  {
    emoji: '💸',
    title: '"That place is too expensive for me."',
    desc: 'Budget gaps make group decisions awkward and slow.',
  },
  {
    emoji: '🤷',
    title: '"I don\'t care, you pick."',
    desc: 'Nobody wants to decide, so nobody does. You\'re still hungry.',
  },
  {
    emoji: '📱',
    title: '47 messages later, still no plan.',
    desc: 'Group chats spiral. Everyone has opinions. Nothing gets decided.',
  },
  {
    emoji: '😤',
    title: '"We always go where YOU want."',
    desc: 'Someone always feels like their preferences don\'t matter.',
  },
  {
    emoji: '🕐',
    title: 'You\'re hungry NOW.',
    desc: 'The longer the debate, the worse everyone\'s mood gets.',
  },
]

export const steps = [
  {
    number: '01',
    icon: '📍',
    title: 'Drop Your Location',
    desc: 'Share where your group is. The AI finds real restaurants nearby — not just popular chains.',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    number: '02',
    icon: '👥',
    title: 'Add Everyone\'s Profile',
    desc: 'Each person adds their dietary needs, cravings, flavor preferences, and budget. Takes 30 seconds.',
    color: 'bg-violet-500',
    lightColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
  {
    number: '03',
    icon: '🤖',
    title: 'AI Finds the Middle Ground',
    desc: 'The mediator agent analyzes all preferences simultaneously and identifies the best shared option.',
    color: 'bg-brand-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-brand-600',
  },
  {
    number: '04',
    icon: '🍽️',
    title: 'Get Your Personalized Plan',
    desc: 'One restaurant, one base meal, and a custom remix for each person. Everyone wins.',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
]

export const differentiators = [
  {
    icon: '❌',
    label: 'Not just a restaurant finder',
    sub: 'Yelp, Google Maps',
    desc: 'Those show you options. We make the decision for your whole group.',
  },
  {
    icon: '❌',
    label: 'Not just food delivery',
    sub: 'DoorDash, Uber Eats',
    desc: 'Those serve individuals. We serve groups with conflicting needs.',
  },
  {
    icon: '❌',
    label: 'Not just a recommendation engine',
    sub: 'Generic AI food apps',
    desc: 'Those suggest what you might like. We negotiate between what everyone needs.',
  },
  {
    icon: '✅',
    label: 'A true group mediator',
    sub: 'Social Plate-Share',
    desc: 'An AI agent that holds everyone\'s constraints at once and finds the real middle ground.',
    highlight: true,
  },
]
