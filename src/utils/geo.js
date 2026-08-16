/**
 * "¿Qué hay cerca de mí?" support.
 *
 * The curated recommendations carry a `zone` (neighbourhood) but no
 * lat/lng, so distances here are computed against neighbourhood centroids.
 * That's accurate enough to answer "¿me queda de paso?" — which is the actual
 * question — but it is NOT street-level precision, and the UI says so rather
 * than pretending otherwise.
 *
 * The device's coordinates never leave the browser: they're held in component
 * state, compared against this static table, and never persisted or sent
 * anywhere.
 */

/** Approximate centre of each zone used by the recommendations data. */
export const ZONE_COORDS = {
  'Greenwich Village': { lat: 40.7336, lon: -74.0027 },
  "Hell's Kitchen": { lat: 40.7638, lon: -73.9918 },
  'Midtown Manhattan': { lat: 40.7549, lon: -73.9840 },
  'Chelsea & Meatpacking': { lat: 40.7465, lon: -74.0014 },
  'Lower East Side': { lat: 40.7180, lon: -73.9880 },
  'Hudson Yards & High Line': { lat: 40.7540, lon: -74.0020 },
  'Brooklyn (DUMBO / Gowanus)': { lat: 40.7033, lon: -73.9881 },
  'Queens (Astoria / Flushing)': { lat: 40.7644, lon: -73.9235 },
  'Hudson Valley': { lat: 41.4200, lon: -73.9550 },
  'East Village': { lat: 40.7265, lon: -73.9815 },
  'SoHo': { lat: 40.7233, lon: -74.0020 },
  'Upper West Side': { lat: 40.7870, lon: -73.9754 },
  'Upper East Side': { lat: 40.7736, lon: -73.9566 },
  'Financial District': { lat: 40.7075, lon: -74.0113 },
  'Harlem': { lat: 40.8116, lon: -73.9465 },
  'Williamsburg': { lat: 40.7141, lon: -73.9614 }
};

/** Fixed anchors of this trip, always considered alongside the spots. */
export const TRIP_ANCHORS = [
  { id: 'anchor-hotel', name: 'Marriott Marquis (tu hotel)', zone: 'Times Square', kind: 'hotel', lat: 40.7590, lon: -73.9845 },
  { id: 'anchor-ashe', name: 'Arthur Ashe Stadium', zone: 'Flushing Meadows', kind: 'usopen', lat: 40.7498, lon: -73.8448 },
  { id: 'anchor-gct', name: 'Grand Central Terminal', zone: 'Midtown Manhattan', kind: 'transit', lat: 40.7527, lon: -73.9772 },
  { id: 'anchor-highline', name: 'The High Line', zone: 'Chelsea & Meatpacking', kind: 'sights', lat: 40.7480, lon: -74.0048 }
];

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Great-circle distance between two points, in kilometres. */
export function distanceKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** "450 m" / "1.8 km" — the unit people actually think in while walking. */
export function formatDistance(km) {
  if (km < 1) return `${Math.round(km / 0.05) * 50} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** Rough walking time at a city pace of ~4.5 km/h. */
export function walkingMinutes(km) {
  return Math.max(1, Math.round((km / 4.5) * 60));
}

/**
 * Ranks curated spots by distance from `here`.
 *
 * Only spots whose zone we can place on the map are considered — an unknown
 * zone is skipped rather than guessed at, so nothing is ever shown with a
 * made-up distance. Already-visited spots drop out.
 */
export function findNearbySpots(recommendations = [], here, { limit = 6, maxKm = 5 } = {}) {
  if (!here) return [];

  const fromRecs = recommendations
    .filter(rec => !rec.visited)
    .map(rec => {
      const coords = ZONE_COORDS[rec.zone];
      if (!coords) return null;
      return {
        id: rec.id,
        name: rec.name,
        zone: rec.zone,
        kind: rec.category,
        mustTry: rec.mustTry || rec.mustOrder,
        mapsUrl: rec.mapsUrl,
        km: distanceKm(here, coords)
      };
    })
    .filter(Boolean);

  const fromAnchors = TRIP_ANCHORS.map(anchor => ({
    id: anchor.id,
    name: anchor.name,
    zone: anchor.zone,
    kind: anchor.kind,
    isAnchor: true,
    km: distanceKm(here, { lat: anchor.lat, lon: anchor.lon })
  }));

  return [...fromRecs, ...fromAnchors]
    .filter(item => item.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

/** Distance under which something is worth interrupting the user about. */
export const ALERT_RADIUS_KM = 0.8;
