import React, { useEffect, useMemo, useRef } from 'react';
import {
  Navigation,
  MapPin,
  ExternalLink,
  Walking,
  Sparkles,
  AlertTriangle,
  Shield,
  RotateCcw,
  ChevronRight,
  Route,
  Calendar,
  X
} from '../utils/icons';
import { getCategory, getStatus } from '../utils/activityMeta';
import {
  findNearbySpots,
  findRouteSpots,
  findSpotsNearPlan,
  resolveCoords,
  formatDistance,
  walkingMinutes,
  ALERT_RADIUS_KM
} from '../utils/geo';
import { useLocation } from '../context/LocationContext';
import { notify } from '../utils/alerts';
import { sanitizeUrl } from '../utils/sanitize';

/** One tappable suggestion row. */
function SpotRow({ spot, meta }) {
  const cat = getCategory(spot.kind);
  const CatIcon = cat.icon;
  const safeUrl = sanitizeUrl(spot.mapsUrl)
    || `https://maps.google.com/?q=${encodeURIComponent(`${spot.name} NYC`)}`;

  return (
    <li>
      <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="spa-row py-4">
        <span className="spa-tile flex-shrink-0" style={{ backgroundColor: cat.soft, color: cat.color }}>
          <CatIcon className="w-4 h-4" />
        </span>

        <span className="flex-1 min-w-0">
          <span className="block font-heading font-bold text-[15px] text-[var(--text-primary)] leading-snug truncate">
            {spot.name}
          </span>
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[12px] text-[var(--text-muted)] mt-1">
            {meta}
          </span>
          {spot.mustTry && (
            <span className="block text-[12px] text-[var(--text-secondary)] mt-1 truncate">
              Pide: {spot.mustTry}
            </span>
          )}
        </span>

        <ExternalLink className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
      </a>
    </li>
  );
}

function Section({ icon: Icon, title, hint, children }) {
  return (
    <div className="space-y-2.5">
      <div>
        <span className="spa-eyebrow">
          <Icon className="w-3 h-3 text-[var(--accent-primary-text)]" />
          {title}
        </span>
        {hint && <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-snug">{hint}</p>}
      </div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

/**
 * Location-aware suggestions.
 *
 * Three questions, in the order they matter while you're out:
 *   1. ¿Qué tengo a la vuelta ahora mismo?
 *   2. ¿Qué me queda de camino a mi próxima parada?
 *   3. ¿Qué hay alrededor de lo que sigue en el plan de hoy?
 *
 * The permission itself is handled by LocationContext, which asks as soon as
 * the app opens; this component only reacts to the resulting state.
 *
 * `variant="compact"` renders a single condensed card for the itinerary
 * screen, where this is a sidebar concern rather than the main event.
 */
export default function NearbyAlerts({
  recommendations = [],
  day = null,
  variant = 'full'
}) {
  const { coords, status, updatedAt, requestLocation, disableLocation } = useLocation();
  const alertedIdsRef = useRef(new Set());

  // Today's remaining stops, plus the next one we can actually put on a map.
  //
  // Deliberately not just `pending[0]`: plenty of stops are things like
  // "Desayuno en bodega" with no address and no landmark to match, and
  // anchoring the route to an unplaceable stop would silently kill this
  // section. Walking forward to the first *locatable* stop keeps the
  // "de camino" list working for the rest of the day.
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

  // Order matters, and it is not the order the sections are displayed in.
  //
  // The route is computed FIRST and the other two lists exclude whatever it
  // claims. On a short leg the nearest-by-distance list would otherwise
  // swallow every candidate and leave "De camino" permanently empty — and
  // "te queda de paso" is strictly more actionable than "está a 300 m en la
  // dirección contraria", so it gets first pick.
  const onRoute = useMemo(
    () => (coords && nextStopCoords
      ? findRouteSpots(recommendations, coords, nextStopCoords, { limit: variant === 'compact' ? 3 : 5 })
      : []),
    [recommendations, coords, nextStopCoords, variant]
  );

  const routeIds = useMemo(() => onRoute.map(s => s.id), [onRoute]);

  const nearby = useMemo(
    () => (coords
      ? findNearbySpots(recommendations, coords, { limit: variant === 'compact' ? 3 : 5 })
          .filter(s => !routeIds.includes(s.id))
      : []),
    [recommendations, coords, variant, routeIds]
  );

  const nearPlan = useMemo(
    () => (coords
      ? findSpotsNearPlan(recommendations, upcomingStops, {
          excludeIds: [...routeIds, ...nearby.map(s => s.id)]
        })
      : []),
    [recommendations, coords, upcomingStops, routeIds, nearby]
  );

  // The "worth interrupting you" check looks at everything close by, not just
  // whichever list ended up owning the spot.
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

  const hasAnything = nearby.length > 0 || onRoute.length > 0 || nearPlan.length > 0;

  // ── Not tracking yet ────────────────────────────────────────────────
  if (status !== 'ready') {
    const copy = {
      idle: { title: 'Sugerencias por ubicación', body: 'Activa la ubicación y te digo qué lugares de tu lista tienes cerca y cuáles te quedan de camino.', cta: 'Activar ubicación' },
      locating: { title: 'Buscando dónde estás…', body: 'Estamos leyendo la ubicación de tu dispositivo. Si tu navegador pide permiso, acéptalo.', cta: 'Buscando…' },
      denied: { title: 'Ubicación bloqueada', body: 'Tu navegador bloqueó el permiso. Actívalo desde el candado en la barra de direcciones (o Ajustes → Safari → Ubicación) y vuelve a intentar.', cta: 'Intentar de nuevo' },
      unavailable: { title: 'No pudimos ubicarte', body: 'Tu dispositivo no devolvió una ubicación. Revisa que el GPS esté encendido.', cta: 'Intentar de nuevo' },
      off: { title: 'Ubicación desactivada', body: 'Desactivaste las sugerencias por ubicación. Puedes volver a encenderlas cuando quieras.', cta: 'Volver a activar' }
    }[status] || {};

    const isProblem = status === 'denied' || status === 'unavailable';

    if (variant === 'compact') {
      return (
        <button onClick={requestLocation} className="spa-row py-4 w-full">
          <span className="spa-tile flex-shrink-0 bg-[var(--accent-primary-soft)] text-[var(--accent-primary-text)]">
            <Navigation className="w-4 h-4" />
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="block font-heading font-bold text-[15px] text-[var(--text-primary)]">{copy.title}</span>
            <span className="block text-[12px] text-[var(--text-muted)] mt-0.5 truncate">{copy.cta}</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
        </button>
      );
    }

    return (
      <section className="spa-card p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          <span
            className="spa-tile flex-shrink-0"
            style={isProblem
              ? { backgroundColor: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)', color: 'var(--accent-amber-text)' }
              : { backgroundColor: 'var(--accent-primary-soft)', color: 'var(--accent-primary-text)' }}
          >
            {isProblem ? <AlertTriangle className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-black text-lg text-[var(--text-primary)] leading-tight">{copy.title}</h2>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-1.5">{copy.body}</p>
          </div>
        </div>

        <button
          onClick={requestLocation}
          disabled={status === 'locating'}
          className="spa-btn spa-btn-primary w-full min-h-[3.25rem] disabled:opacity-60"
        >
          <Navigation className="w-4 h-4" />
          {copy.cta}
        </button>

        <p className="flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
          <Shield className="w-3 h-3 flex-shrink-0 mt-0.5 text-[var(--accent-emerald-text)]" />
          Tu ubicación se usa solo en este dispositivo para calcular distancias. No se guarda ni se envía a ningún servidor.
        </p>
      </section>
    );
  }

  // ── Compact (itinerary screen) ──────────────────────────────────────
  if (variant === 'compact') {
    const top = [...onRoute, ...nearby].slice(0, 3);
    if (top.length === 0) return null;

    return (
      <section className="space-y-3">
        <span className="spa-eyebrow">
          <Navigation className="w-3 h-3 text-[var(--accent-primary-text)]" />
          Cerca de ti ahora
        </span>
        <ul className="space-y-2">
          {top.map(spot => (
            <SpotRow
              key={spot.id}
              spot={spot}
              meta={
                <>
                  <span className="font-mono font-bold text-[var(--accent-primary-text)]">~{formatDistance(spot.km)}</span>
                  <span className="flex items-center gap-1">
                    <Walking className="w-3 h-3" />
                    {walkingMinutes(spot.km)} min
                  </span>
                  {spot.detourKm !== undefined && <span>de camino</span>}
                </>
              }
            />
          ))}
        </ul>
      </section>
    );
  }

  // ── Full (En Vivo) ──────────────────────────────────────────────────
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="spa-eyebrow">
          <Navigation className="w-3 h-3 text-[var(--accent-primary-text)]" />
          Según dónde estás
        </span>
        <div className="flex items-center gap-1.5">
          <span className="spa-chip h-8 text-[11px]">
            <RotateCcw className="w-3 h-3" />
            {updatedAt ? updatedAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : 'En vivo'}
          </span>
          <button
            onClick={disableLocation}
            className="spa-tile-sm bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-rose-text)] transition-colors"
            aria-label="Desactivar sugerencias por ubicación"
            title="Desactivar ubicación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {veryClose.length > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ backgroundColor: 'color-mix(in srgb, var(--accent-emerald) 14%, transparent)' }}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--accent-emerald-text)]" />
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">
              {veryClose.length === 1
                ? `${veryClose[0].name} está a la vuelta`
                : `${veryClose.length} lugares de tu lista están a menos de ${formatDistance(ALERT_RADIUS_KM)}`}
            </strong>
            {' '}— buen momento para desviarte un poco.
          </p>
        </div>
      )}

      {onRoute.length > 0 && (
        <Section
          icon={Route}
          title="De camino"
          hint={nextStopTitle ? `Te quedan de paso rumbo a “${nextStopTitle}”.` : undefined}
        >
          {onRoute.map(spot => (
            <SpotRow
              key={spot.id}
              spot={spot}
              meta={
                <>
                  <span className="font-mono font-bold text-[var(--accent-primary-text)]">~{formatDistance(spot.km)}</span>
                  <span className="flex items-center gap-1">
                    <Walking className="w-3 h-3" />
                    {walkingMinutes(spot.km)} min
                  </span>
                  <span>
                    {spot.detourKm < 0.05
                      ? 'sin desvío'
                      : `+${formatDistance(spot.detourKm)} de desvío`}
                  </span>
                </>
              }
            />
          ))}
        </Section>
      )}

      {nearby.length > 0 && (
        <Section icon={MapPin} title="A la vuelta" hint="Lo más cercano a donde estás parado.">
          {nearby.map(spot => (
            <SpotRow
              key={spot.id}
              spot={spot}
              meta={
                <>
                  <span className="font-mono font-bold text-[var(--accent-primary-text)]">~{formatDistance(spot.km)}</span>
                  <span className="flex items-center gap-1">
                    <Walking className="w-3 h-3" />
                    {walkingMinutes(spot.km)} min
                  </span>
                  <span className="truncate">{spot.zone}</span>
                </>
              }
            />
          ))}
        </Section>
      )}

      {nearPlan.length > 0 && (
        <Section icon={Calendar} title="Cerca de tu plan de hoy" hint="Alrededor de las paradas que todavía te faltan.">
          {nearPlan.map(spot => (
            <SpotRow
              key={spot.id}
              spot={spot}
              meta={
                <>
                  <span className="font-mono font-bold text-[var(--accent-primary-text)]">~{formatDistance(spot.km)}</span>
                  <span className="truncate">
                    de {spot.nearStopTime ? `${spot.nearStopTime} · ` : ''}{spot.nearStopTitle}
                  </span>
                </>
              }
            />
          ))}
        </Section>
      )}

      {!hasAnything && (
        <div className="spa-card p-8 text-center space-y-2">
          <span className="spa-tile-lg mx-auto bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
            <MapPin className="w-6 h-6" />
          </span>
          <p className="font-heading font-bold text-[var(--text-primary)]">Nada de la lista cerca</p>
          <p className="text-[13px] text-[var(--text-muted)]">
            No hay spots pendientes en un radio de 5 km ni de camino a tu próxima parada.
          </p>
        </div>
      )}

      <p className="flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed px-1">
        <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 mt-1" />
        Distancias aproximadas: se miden al barrio o punto de referencia de cada lugar, no a su puerta.
      </p>
    </section>
  );
}
