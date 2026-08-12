// Free, no-API-key geocoding via OpenStreetMap's Nominatim. Their usage
// policy caps this at ~1 request/second and requires a real User-Agent —
// fine for the handful of properties this app has, and results are cached
// back onto the row so a given address is only ever looked up once.
export async function geocodeAddress(addressLine, municipality) {
  const query = `${addressLine}, ${municipality}, Latvia`
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'apkomfort-web/1.0 (birojs@apkomforts.com)' } })
    if (!res.ok) return null
    const results = await res.json()
    const hit = results[0]
    if (!hit) return null
    return { lat: Number(hit.lat), lng: Number(hit.lon) }
  } catch {
    return null
  }
}

// Geocodes any property missing coordinates, one at a time (rate-limit
// friendly), and writes the result back so subsequent loads are instant.
// Capped per call so a page render can't run long enough to hit a
// serverless function timeout — any leftovers just get picked up (and
// cached) on the next page load.
export async function ensurePropertyCoordinates(sb, properties, maxPerCall = 5) {
  const missing = properties.filter(p => p.lat == null || p.lng == null).slice(0, maxPerCall)
  for (const p of missing) {
    const coords = await geocodeAddress(p.address_line, p.municipality)
    if (coords) {
      await sb.from('properties').update({ lat: coords.lat, lng: coords.lng }).eq('id', p.id)
      p.lat = coords.lat
      p.lng = coords.lng
    }
    await new Promise(r => setTimeout(r, 1100))
  }
  return properties
}
