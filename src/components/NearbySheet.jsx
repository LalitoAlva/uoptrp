import React, { useMemo, useState } from 'react';
import BottomSheet from './BottomSheet';
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
import { getCategory } from '../utils/activityMeta';
import { formatDistance, walkingMinutes, ALERT_RADIUS_KM } from '../utils/geo';
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
 * "Cerca de ti", as a popup rather than a block wedged into En Vivo.
 *
 * Opened from the compass button in the header. All the computation lives in
 * `useNearby`, mounted up in App, so the proximity alerts keep firing while
 * this sheet is closed — the popup is only the detailed view of something
 * that is always running.
 */
export default function NearbySheet({ isOpen, onClose, data }) {
  const {
    status, updatedAt, isRefreshing, requestLocation, refresh, disableLocation,
    onRoute: allOnRoute, nearby: allNearby, nearPlan: allNearPlan, veryClose, nextStopTitle
  } = data;

  const [typeFilter, setTypeFilter] = useState('all');

  // Only offer the categories that are actually around right now — a filter
  // chip that always returns nothing is worse than no chip.
  const availableTypes = useMemo(() => {
    const counts = new Map();
    [...allOnRoute, ...allNearby, ...allNearPlan].forEach(spot => {
      const cat = getCategory(spot.kind);
      const entry = counts.get(cat.label) || { label: cat.label, icon: cat.icon, kinds: new Set(), count: 0 };
      entry.kinds.add(spot.kind);
      entry.count += 1;
      counts.set(cat.label, entry);
    });
    return [...counts.values()].sort((a, b) => b.count - a.count);
  }, [allOnRoute, allNearby, allNearPlan]);

  const matchesFilter = useMemo(() => {
    if (typeFilter === 'all') return () => true;
    // Filter by the *label*, not the raw kind: several kinds collapse to one
    // human category (culture/sights → "Paseos", books/shopping → "Compras"),
    // and the chips show the human one.
    return (spot) => getCategory(spot.kind).label === typeFilter;
  }, [typeFilter]);

  const onRoute = useMemo(() => allOnRoute.filter(matchesFilter), [allOnRoute, matchesFilter]);
  const nearby = useMemo(() => allNearby.filter(matchesFilter), [allNearby, matchesFilter]);
  const nearPlan = useMemo(() => allNearPlan.filter(matchesFilter), [allNearPlan, matchesFilter]);

  const total = onRoute.length + nearby.length + nearPlan.length;
  const totalUnfiltered = allOnRoute.length + allNearby.length + allNearPlan.length;

  // ── Not tracking yet ────────────────────────────────────────────────
  if (status !== 'ready') {
    const copy = {
      idle: { title: 'Sugerencias por ubicación', body: 'Activa la ubicación y te digo qué lugares de tu lista tienes cerca y cuáles te quedan de camino a tu próxima parada.', cta: 'Activar ubicación' },
      locating: { title: 'Buscando dónde estás…', body: 'Estamos leyendo la ubicación de tu dispositivo. Si tu navegador pide permiso, acéptalo.', cta: 'Buscando…' },
      denied: { title: 'Ubicación bloqueada', body: 'Tu navegador bloqueó el permiso. Actívalo desde el candado en la barra de direcciones (o Ajustes → Safari → Ubicación) y vuelve a intentar.', cta: 'Intentar de nuevo' },
      unavailable: { title: 'No pudimos ubicarte', body: 'Tu dispositivo no devolvió una ubicación. Revisa que el GPS esté encendido.', cta: 'Intentar de nuevo' },
      off: { title: 'Ubicación desactivada', body: 'Desactivaste las sugerencias por ubicación. Puedes volver a encenderlas cuando quieras.', cta: 'Volver a activar' }
    }[status] || { title: 'Cerca de ti', body: '', cta: 'Activar ubicación' };

    const isProblem = status === 'denied' || status === 'unavailable';

    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={copy.title}
        subtitle="Lugares de tu lista según dónde estés"
        icon={isProblem ? AlertTriangle : Navigation}
        accent={isProblem ? 'var(--accent-amber-text)' : 'var(--accent-primary-text)'}
        accentBg={isProblem
          ? 'color-mix(in srgb, var(--accent-amber) 16%, transparent)'
          : 'var(--accent-primary-soft)'}
        footer={
          <button
            onClick={requestLocation}
            disabled={status === 'locating'}
            className="spa-btn spa-btn-primary w-full min-h-[3.25rem] disabled:opacity-60"
          >
            <Navigation className="w-4 h-4" />
            {copy.cta}
          </button>
        }
      >
        <div className="space-y-5">
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">{copy.body}</p>
          <p className="flex items-start gap-2 text-[12px] text-[var(--text-muted)] leading-relaxed">
            <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--accent-emerald-text)]" />
            Tu ubicación se usa solo en este dispositivo para calcular distancias. No se guarda ni se
            envía a ningún servidor.
          </p>
        </div>
      </BottomSheet>
    );
  }

  // ── Tracking ────────────────────────────────────────────────────────
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Cerca de ti"
      subtitle={
        totalUnfiltered > 0
          ? `${total} de ${totalUnfiltered} lugares · más cercano primero`
          : 'Nada de tu lista cerca ahora'
      }
      icon={Navigation}
      footer={
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="spa-btn spa-btn-primary flex-1 min-h-[3.25rem] disabled:opacity-60"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin-back' : ''}`} />
            {isRefreshing ? 'Actualizando…' : 'Actualizar ubicación'}
          </button>
          <button
            onClick={() => { disableLocation(); onClose(); }}
            className="spa-btn spa-btn-ghost min-h-[3.25rem] px-4"
            aria-label="Desactivar sugerencias por ubicación"
            title="Desactivar ubicación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[var(--accent-emerald)] animate-soft-pulse" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)]" />
            </span>
            Siguiendo tu ubicación
          </span>
          {updatedAt && (
            <span className="font-mono">
              {updatedAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {availableTypes.length > 1 && (
          <div className="spa-rail hide-scrollbar -mx-1 px-1">
            <button
              onClick={() => setTypeFilter('all')}
              aria-pressed={typeFilter === 'all'}
              className={`spa-chip ${typeFilter === 'all' ? 'spa-chip-accent' : ''}`}
            >
              Todo
              <span className="font-mono text-[10px] opacity-70">{totalUnfiltered}</span>
            </button>
            {availableTypes.map((type) => {
              const TypeIcon = type.icon;
              const isActive = typeFilter === type.label;
              return (
                <button
                  key={type.label}
                  onClick={() => setTypeFilter(isActive ? 'all' : type.label)}
                  aria-pressed={isActive}
                  className={`spa-chip ${isActive ? 'spa-chip-accent' : ''}`}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  {type.label}
                  <span className="font-mono text-[10px] opacity-70">{type.count}</span>
                </button>
              );
            })}
          </div>
        )}

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
                  : `${veryClose.length} lugares están a menos de ${formatDistance(ALERT_RADIUS_KM)}`}
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
                      {spot.detourKm < 0.05 ? 'sin desvío' : `+${formatDistance(spot.detourKm)} de desvío`}
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

        {total === 0 && (
          <div className="py-8 text-center space-y-3">
            <span className="spa-tile-lg mx-auto bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
              <MapPin className="w-6 h-6" />
            </span>
            {typeFilter === 'all' ? (
              <>
                <p className="font-heading font-bold text-[var(--text-primary)]">Nada de la lista cerca</p>
                <p className="text-[13px] text-[var(--text-muted)]">
                  No hay spots pendientes en un radio de 5 km ni de camino a tu próxima parada.
                </p>
              </>
            ) : (
              <>
                <p className="font-heading font-bold text-[var(--text-primary)]">
                  Nada de “{typeFilter}” por aquí
                </p>
                <button onClick={() => setTypeFilter('all')} className="spa-btn spa-btn-ghost min-h-[2.75rem]">
                  Ver los {totalUnfiltered} lugares cerca
                </button>
              </>
            )}
          </div>
        )}

        <p className="flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
          <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 mt-1" />
          Distancias aproximadas: se miden al barrio o punto de referencia de cada lugar, no a su puerta.
        </p>

      </div>
    </BottomSheet>
  );
}
