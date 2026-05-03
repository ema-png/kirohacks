const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Rank restaurants using the AI + Yelp backend.
 *
 * @param {{ people: object[], vibe: string[], location: string }} params
 * @returns {Promise<{
 *   ranked: object[],
 *   aiSummary: string|null,
 *   groupInsight: string|null,
 *   usedFallback: boolean,
 *   error: string|null
 * }>}
 */
export async function rankRestaurants({ people, vibe, location }) {
  try {
    const res = await fetch(`${API_URL}/api/rank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ people, vibe, location }),
      signal: AbortSignal.timeout(60_000), // 60s — Yelp + AI can take a moment
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `API error ${res.status}`);
    }

    const data = await res.json();
    return { ...data, usedFallback: false, error: null };
  } catch (err) {
    console.warn("Ranking API unavailable:", err.message);
    return {
      ranked: [],
      aiSummary: null,
      groupInsight: null,
      usedFallback: true,
      error: err.message,
    };
  }
}
