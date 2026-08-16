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

import { NYC_PLACES } from '../data/nycPlaces';

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

/**
 * Fixed anchors of this trip, always considered alongside the spots.
 *
 * Only the two that belong to *this* trip specifically. Grand Central and the
 * High Line used to live here too, but they're now in NYC_PLACES as proper
 * attractions — keeping both copies would list them twice under different
 * ids, since the two sources are merged before ranking.
 */
export const TRIP_ANCHORS = [
  { id: 'anchor-hotel', name: 'Marriott Marquis (tu hotel)', zone: 'Times Square', kind: 'hotel', lat: 40.7590, lon: -73.9845 },
  { id: 'anchor-ashe', name: 'Arthur Ashe Stadium', zone: 'Flushing Meadows', kind: 'usopen', lat: 40.7498, lon: -73.8448 }
];

/**
 * Keyword → coordinates for the venues this specific trip actually visits.
 *
 * Itinerary stops carry a title and sometimes an address, but never lat/lng,
 * so placing them on the map means matching text. Keys are lowercase
 * substrings checked against `title + address`; the most specific entries are
 * listed first because the first match wins. Anything unmatched stays
 * unplaced rather than being guessed at — a stop with no coordinates is
 * simply excluded from route calculations.
 */
const LANDMARK_COORDS = [
  ['arthur ashe', { lat: 40.7498, lon: -73.8448 }],
  ['flushing meadows', { lat: 40.7498, lon: -73.8448 }],
  ['flushing', { lat: 40.7595, lon: -73.8300 }],
  ['marriott marquis', { lat: 40.7590, lon: -73.9857 }],
  ['times square', { lat: 40.7580, lon: -73.9855 }],
  ['grand central', { lat: 40.7527, lon: -73.9772 }],
  ['penn station', { lat: 40.7506, lon: -73.9935 }],
  ['ewr', { lat: 40.6895, lon: -74.1745 }],
  ['newark', { lat: 40.6895, lon: -74.1745 }],
  ['jfk', { lat: 40.6413, lon: -73.7781 }],
  ['intrepid', { lat: 40.7645, lon: -74.0000 }],
  ['top of the rock', { lat: 40.7593, lon: -73.9794 }],
  ['rockefeller', { lat: 40.7587, lon: -73.9787 }],
  ['moma', { lat: 40.7614, lon: -73.9776 }],
  ['museum of modern art', { lat: 40.7614, lon: -73.9776 }],
  ['high line', { lat: 40.7480, lon: -74.0048 }],
  ['chelsea market', { lat: 40.7424, lon: -74.0061 }],
  ['strand', { lat: 40.7332, lon: -73.9907 }],
  ['katz', { lat: 40.7223, lon: -73.9874 }],
  ["joe's pizza", { lat: 40.7302, lon: -74.0027 }],
  ['carmine st', { lat: 40.7302, lon: -74.0027 }],
  ['keens', { lat: 40.7501, lon: -73.9857 }],
  ['village vanguard', { lat: 40.7359, lon: -74.0016 }],
  ['birdland', { lat: 40.7583, lon: -73.9899 }],
  ['red lion', { lat: 40.7288, lon: -74.0016 }],
  ['55 bar', { lat: 40.7340, lon: -74.0021 }],
  ['blue note', { lat: 40.7307, lon: -74.0007 }],
  ['central park', { lat: 40.7812, lon: -73.9665 }],
  ['levain', { lat: 40.7796, lon: -73.9803 }],
  ['bluestone lane', { lat: 40.7620, lon: -73.9770 }],
  ['burger joint', { lat: 40.7644, lon: -73.9776 }],
  ['parker hotel', { lat: 40.7644, lon: -73.9776 }],
  ['apple store', { lat: 40.7638, lon: -73.9729 }],
  ['5ta avenida', { lat: 40.7638, lon: -73.9729 }],
  ['yankee', { lat: 40.8296, lon: -73.9262 }],
  ['bronx', { lat: 40.8296, lon: -73.9262 }],
  ['dumbo', { lat: 40.7033, lon: -73.9881 }],
  ['brooklyn flea', { lat: 40.7033, lon: -73.9881 }],
  ['other half', { lat: 40.7228, lon: -73.9573 }],
  ['williamsburg', { lat: 40.7141, lon: -73.9614 }],
  ['cold spring', { lat: 41.4200, lon: -73.9550 }],
  ['beacon', { lat: 41.5048, lon: -73.9696 }],
  ['bleecker', { lat: 40.7310, lon: -74.0030 }],
  ['west village', { lat: 40.7358, lon: -74.0036 }],
  ['greenwich', { lat: 40.7336, lon: -74.0027 }],
  ['lower east side', { lat: 40.7180, lon: -73.9880 }],
  ['chinatown', { lat: 40.7158, lon: -73.9970 }],
  ['soho', { lat: 40.7233, lon: -74.0020 }],
  ["hell's kitchen", { lat: 40.7638, lon: -73.9918 }],
  ['9na avenida', { lat: 40.7620, lon: -73.9905 }],
  ['9th ave', { lat: 40.7620, lon: -73.9905 }],
  ['chelsea', { lat: 40.7465, lon: -74.0014 }],
  ['midtown', { lat: 40.7549, lon: -73.9840 }],
  ['broadway', { lat: 40.7590, lon: -73.9845 }],
  ['queens', { lat: 40.7644, lon: -73.9235 }],
  ['brooklyn', { lat: 40.6782, lon: -73.9442 }],
  ['manhattan', { lat: 40.7580, lon: -73.9855 }]
];

/**
 * Best-effort coordinates for an itinerary stop or recommendation.
 *
 * Tries the record's zone first (that's structured data), then falls back to
 * keyword-matching the title and address. Returns null when nothing matches,
 * which callers must handle — never a default "somewhere in Manhattan", since
 * a wrong location is worse than no location when the whole point is "¿me
 * queda de camino?".
 */
export function resolveCoords(place) {
  if (!place) return null;

  if (place.zone && ZONE_COORDS[place.zone]) return ZONE_COORDS[place.zone];

  const haystack = `${place.title || place.name || ''} ${place.address || ''} ${place.sub || ''}`.toLowerCase();
  if (!haystack.trim()) return null;

  for (const [keyword, coords] of LANDMARK_COORDS) {
    if (haystack.includes(keyword)) return coords;
  }
  return null;
}

/**
 * Perpendicular distance from a point to the segment A→B, in kilometres.
 *
 * Projects onto a local flat plane (longitude scaled by cos(lat)), which is
 * accurate well past the few kilometres this app ever measures. The clamp on
 * `t` is what makes it a *segment* rather than an infinite line: a bar two
 * neighbourhoods past your destination shouldn't count as "on the way".
 */
export function distanceToSegmentKm(p, a, b) {
  const kx = 111.32 * Math.cos(toRad((a.lat + b.lat) / 2));
  const ky = 110.57;

  const ax = a.lon * kx, ay = a.lat * ky;
  const bx = b.lon * kx, by = b.lat * ky;
  const px = p.lon * kx, py = p.lat * ky;

  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  // Degenerate segment (you're already at the destination) → plain distance.
  if (lenSq === 0) return distanceKm(p, a);

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const cx = ax + t * dx, cy = ay + t * dy;

  return Math.hypot(px - cx, py - cy);
}

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

/**
 * "450 m" / "1.8 km" — the unit people actually think in while walking.
 *
 * Anything under 50 m rounds to "0 m", which reads like a bug rather than
 * "you're standing on it", so that band gets its own wording. Worth being
 * careful here: these are neighbourhood-level estimates, and a confident
 * "0 m" would overstate the precision we actually have.
 */
export function formatDistance(km) {
  if (km < 0.05) return 'a unos pasos';
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

  const fromRecs = locatableCandidates(recommendations)
    .map(({ rec, coords }) => toSpot(rec, { km: distanceKm(here, coords) }));

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

/** Turns one recommendation into the shape the nearby lists render. */
function toSpot(rec, extra = {}) {
  return {
    id: rec.id,
    name: rec.name,
    zone: rec.zone,
    kind: rec.category,
    mustTry: rec.mustTry || rec.mustOrder || rec.note,
    // Music venues carry what they actually play — "Música" alone doesn't
    // help you choose between a jazz cellar and a salsa floor.
    genre: rec.genre || rec.subcategory || null,
    mapsUrl: rec.mapsUrl,
    ...extra
  };
}

/**
 * Everything the nearby lists can suggest: the trip's own recommendations
 * plus the curated attractions/culture/pastimes.
 *
 * The curated places carry real venue coordinates, while recommendations only
 * resolve to a neighbourhood — so a place's own lat/lon is always preferred
 * when it has one. Anything that can't be located is dropped rather than
 * guessed at, since a wrong distance is worse than a missing one.
 */
function locatableCandidates(recommendations = [], { excludeIds = [] } = {}) {
  const skip = new Set(excludeIds);
  const out = [];
  const seenNames = new Set();

  recommendations.forEach(rec => {
    if (rec.visited || skip.has(rec.id)) return;
    const coords = resolveCoords(rec);
    if (!coords) return;
    seenNames.add(normaliseName(rec.name));
    out.push({ rec, coords });
  });

  NYC_PLACES.forEach(place => {
    if (skip.has(place.id)) return;
    // The trip's own recommendations win over the curated list when they're
    // the same venue: "Birdland Jazz Club" and "Birdland" are one place, and
    // listing both twice under different ids just wastes a row.
    if (isDuplicateName(place.name, seenNames)) return;
    out.push({ rec: place, coords: { lat: place.lat, lon: place.lon } });
  });

  return out;
}

/** Lowercase, unaccented, punctuation-free — for comparing venue names. */
export function normaliseName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True when `name` refers to a venue already in `seen`.
 *
 * Exact match, or one name fully containing the other — that's what catches
 * "Birdland" vs "Birdland Jazz Club" and "Joe's Pizza" vs "Joe's Pizza
 * (Original)". The 4-character floor stops short words creating false
 * positives against every longer name.
 */
export function isDuplicateName(name, seen) {
  const candidate = normaliseName(name);
  if (!candidate) return false;
  if (seen.has(candidate)) return true;

  for (const existing of seen) {
    if (existing.length < 4 || candidate.length < 4) continue;
    if (existing.includes(candidate) || candidate.includes(existing)) return true;
  }
  return false;
}

/**
 * Spots that sit inside a corridor along the way from `from` to `to`.
 *
 * This is the "¿qué me queda de paso?" list. A spot qualifies when it is
 * within `corridorKm` of the straight line between the two points AND the
 * detour is small relative to the trip itself — otherwise on a long haul
 * (Manhattan → Flushing) the corridor would sweep up half of Queens.
 *
 * Ranked by plain distance from where you are — nearest first, like every
 * other list in this feature. The detour cost is still computed and shown on
 * each row, since it's the thing that tells you whether a stop is worth it,
 * but it isn't what decides the order: when you're standing on a corner
 * deciding where to go, "closest" is the ordering you expect.
 */
export function findRouteSpots(recommendations = [], from, to, { corridorKm = 1, limit = 5, excludeIds = [] } = {}) {
  if (!from || !to) return [];

  const legKm = distanceKm(from, to);
  if (legKm < 0.3) return []; // Already there — "on the way" is meaningless.

  return locatableCandidates(recommendations, { excludeIds })
    .map(({ rec, coords }) => {
      const offRouteKm = distanceToSegmentKm(coords, from, to);
      if (offRouteKm > corridorKm) return null;

      // Detour = walk to it, then on to the destination, minus going direct.
      const detourKm = distanceKm(from, coords) + distanceKm(coords, to) - legKm;

      return toSpot(rec, { km: distanceKm(from, coords), offRouteKm, detourKm });
    })
    .filter(Boolean)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

/**
 * Spots clustered around today's remaining stops.
 *
 * Answers "cuando llegue a donde voy, ¿qué hay alrededor?" — useful before
 * you set off, which is when the route list is still empty. Each result
 * records which stop it is near so the UI can say so.
 */
export function findSpotsNearPlan(recommendations = [], stops = [], { radiusKm = 1.2, limit = 6, excludeIds = [] } = {}) {
  const placedStops = stops
    .map(stop => ({ stop, coords: resolveCoords(stop) }))
    .filter(entry => entry.coords);

  if (placedStops.length === 0) return [];

  const results = [];

  for (const { rec, coords } of locatableCandidates(recommendations, { excludeIds })) {
    // Nearest stop of the day wins the label.
    let best = null;
    for (const { stop, coords: stopCoords } of placedStops) {
      const km = distanceKm(coords, stopCoords);
      if (!best || km < best.km) best = { km, stop };
    }

    if (best && best.km <= radiusKm) {
      results.push(toSpot(rec, {
        km: best.km,
        nearStopTitle: best.stop.title,
        nearStopTime: best.stop.time
      }));
    }
  }

  return results.sort((a, b) => a.km - b.km).slice(0, limit);
}
