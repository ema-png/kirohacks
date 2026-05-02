// Get best matching menu items for a specific person at a restaurant
// Used by StepResults to show per-person meal suggestions
export function getPersonMenuMatches(restaurant, person) {
  const allTags = [...(person.diet || []), ...(person.flavors || [])]
  const avoidTags = person.avoid || []

  return (restaurant.menu || [])
    .map(item => {
      const hasAvoid = avoidTags.some(a =>
        item.avoidTags?.includes(a) || item.name?.toLowerCase().includes(a.toLowerCase())
      )
      const matchCount = allTags.filter(t => item.matchTags?.includes(t)).length
      return { ...item, matchCount, hasAvoid }
    })
    .filter(item => !item.hasAvoid)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 2)
}
