import { useEffect, useMemo, useRef } from 'react';
import { getStatus } from '../utils/activityMeta';
import {
  findNearbySpots,
  findRouteSpots,
  findSpotsNearPlan,
  resolveCoords,
  formatDistance,
  ALERT_RADIUS_KM
} from '../utils/geo';
import { useLocation } from '../context/LocationContext';
import { notify } from '../utils/alerts';

/**
 * Everything the "cerca de ti" popup shows, computed independently of it.
 *
 * Lives in a hook rather than inside the sheet component because the
 * proximity toast has to keep firing while the popup is *closed* — that's the
 * whole point of an alert. Mount this once, high in the tree; the sheet is
 * then a pure renderer of what it returns.
 */
export function useNearby(recommendations = [], day = null) {
  const { coords, status, updatedAt, isRefreshing, requestLocation, refresh, disableLocation } = useLocation();
  const alertedIdsRef = useRef(new Set());

  // Today's remaining stops, plus the next one we can actually put on a map.
  //
  // Deliberately not just `pending[0]`: plenty of stops are things like
  // "Desayuno en bodega" with no address and no landmark to match, and
  // anchoring the route to an unplaceable stop would silently kill the
  // "de camino" list for the rest of the day.
  const { upcomingStops, nextStopCoords, nextStopTitle } = useMemo(() => {
    const pending = (day?.timeline || []).filter(item => {
      const st = getStatus(item);
      return st !== 'hecho' && st !== 'no_hecho';
    });

    let target = null;
    let targetCoords = null;
    for (const stop of pending) {
      const c = resolveCoords(stop);
      if (c) { target = stop; targetCoords = c; break; }
    }

    return {
      upcomingStops: pending,
      nextStopCoords: targetCoords,
      nextStopTitle: target?.title || null
    };
  }, [day]);

  // Order matters, and it is not the display order. The route is computed
  // FIRST and the other lists exclude whatever it claims: on a short leg the
  // nearest-by-distance list would otherwise swallow every candidate and
  // leave "De camino" permanently empty — and "te queda de paso" is strictly
  // more actionable than "está a 300 m en la dirección contraria".
  // Limits are generous because the sheet filters these lists by category:
  // a tight cap would make "solo cerveza" come back empty just because the
  // top few happened to be restaurants.
  const onRoute = useMemo(
    () => (coords && nextStopCoords
      ? findRouteSpots(recommendations, coords, nextStopCoords, { limit: 12 })
      : []),
    [recommendations, coords, nextStopCoords]
  );

  const routeIds = useMemo(() => onRoute.map(s => s.id), [onRoute]);

  const nearby = useMemo(
    () => (coords
      ? findNearbySpots(recommendations, coords, { limit: 14 }).filter(s => !routeIds.includes(s.id))
      : []),
    [recommendations, coords, routeIds]
  );

  const nearPlan = useMemo(
    () => (coords
      ? findSpotsNearPlan(recommendations, upcomingStops, {
          limit: 12,
          excludeIds: [...routeIds, ...nearby.map(s => s.id)]
        })
      : []),
    [recommendations, coords, upcomingStops, routeIds, nearby]
  );

  const veryClose = useMemo(
    () => [...onRoute, ...nearby].filter(s => s.km <= ALERT_RADIUS_KM && !s.isAnchor),
    [onRoute, nearby]
  );

  // One heads-up per spot per session — walking a few metres shouldn't
  // re-announce the same taquería.
  useEffect(() => {
    if (status !== 'ready') return;
    const fresh = veryClose.filter(s => !alertedIdsRef.current.has(s.id));
    if (fresh.length === 0) return;

    fresh.forEach(s => alertedIdsRef.current.add(s.id));
    const first = fresh[0];
    notify(
      fresh.length === 1
        ? `Estás a ${formatDistance(first.km)} de ${first.name} — buen momento para pasar`
        : `Tienes ${fresh.length} lugares de tu lista a menos de ${formatDistance(ALERT_RADIUS_KM)}`,
      'info'
    );
  }, [status, veryClose]);

  return {
    status,
    updatedAt,
    isRefreshing,
    requestLocation,
    refresh,
    disableLocation,
    onRoute,
    nearby,
    nearPlan,
    veryClose,
    nextStopTitle,
    total: onRoute.length + nearby.length + nearPlan.length
  };
}
