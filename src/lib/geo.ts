import type { Location } from '~/data/locations'

/** Returns the distance in km between two points using the haversine formula */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Pick a decoy from the closest candidates that aren't the same city */
export function pickNearbyDecoy(
  selected: Location,
  candidates: Location[],
): Location {
  const scored = candidates
    .filter(
      (c) =>
        !(c.city === selected.city && c.country === selected.country),
    )
    .map((c) => ({
      location: c,
      distance: haversineDistance(selected.lat, selected.lng, c.lat, c.lng),
    }))
    .sort((a, b) => a.distance - b.distance)

  const pool = scored.slice(0, 10)
  return pool[Math.floor(Math.random() * pool.length)]!.location
}
