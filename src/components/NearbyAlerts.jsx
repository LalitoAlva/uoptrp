import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Navigation,
  MapPin,
  ExternalLink,
  Walking,
  Sparkles,
  AlertTriangle,
  Shield,
  RotateCcw,
  ChevronRight
} from '../utils/icons';
import { getCategory } from '../utils/activityMeta';
import { findNearbySpots, formatDistance, walkingMinutes, ALERT_RADIUS_KM } from '../utils/geo';
import { notify } from '../utils/alerts';
import { sanitizeUrl } from '../utils/sanitize';

/**
 * "¿Qué hay cerca de mí ahorita?"
 *
 * Asks for the device location only when the user taps the button — never on
 * mount — then ranks the curated spots by distance and raises a one-time
 * heads-up when something genuinely close shows up. Coordinates stay in this
 * component's state: nothing is persisted and nothing is sent anywhere.
 */
export default function NearbyAlerts({ recommendations = [] }) {
  const [status, setStatus] = useState('idle'); // idle | locating | ready | denied | unavailable
  const [here, setHere] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const alertedIdsRef = useRef(new Set());

  const nearby = findNearbySpots(recommendations, here);
  const veryClose = nearby.filter(s => s.km <= ALERT_RADIUS_KM && !s.isAnchor);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }

    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setUpdatedAt(new Date());
        setStatus('ready');
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Raise the heads-up once per spot per session, so re-locating a few metres
  // away doesn't re-notify about the same taquería.
  useEffect(() => {
    if (status !== 'ready') return;
    const fresh = veryClose.filter(s => !alertedIdsRef.current.has(s.id));
    if (fresh.length === 0) return;

    fresh.forEach(s => alertedIdsRef.current.add(s.id));
    const first = fresh[0];
    notify(
      fresh.length === 1
        ? `Estás a ${formatDistance(first.km)} de ${first.name} — buen momento para pasar`
        : `Tienes ${fresh.length} lugares de la lista a menos de ${formatDistance(ALERT_RADIUS_KM)} de aquí`,
      'info'
    );
  }, [status, veryClose]);

  // ── Not located yet ──────────────────────────────────────────────────
  if (status !== 'ready') {
    const copy = {
      idle: {
        title: '¿Qué hay cerca de mí?',
        body: 'Comparte tu ubicación y te digo qué lugares de tu lista tienes a la vuelta, con la distancia y los minutos a pie.',
        cta: 'Usar mi ubicación'
      },
      locating: {
        title: 'Buscando dónde estás…',
        body: 'Un momento, estamos leyendo la ubicación de tu dispositivo.',
        cta: 'Buscando…'
      },
      denied: {
        title: 'Ubicación bloqueada',
        body: 'Tu navegador bloqueó el permiso. Actívalo desde el candado de la barra de direcciones (o en Ajustes → Safari → Ubicación) y vuelve a intentar.',
        cta: 'Intentar de nuevo'
      },
      unavailable: {
        title: 'No pudimos ubicarte',
        body: 'Tu dispositivo no devolvió una ubicación. Revisa que el GPS esté encendido e inténtalo otra vez.',
        cta: 'Intentar de nuevo'
      }
    }[status];

    const isProblem = status === 'denied' || status === 'unavailable';

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
            <h2 className="font-heading font-black text-lg text-[var(--text-primary)] leading-tight">
              {copy.title}
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-1.5">
              {copy.body}
            </p>
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

  // ── Located ──────────────────────────────────────────────────────────
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="spa-eyebrow">
          <Navigation className="w-3 h-3 text-[var(--accent-primary-text)]" />
          Cerca de ti
        </span>
        <button
          onClick={requestLocation}
          className="spa-chip h-8 text-[11px]"
          aria-label="Actualizar mi ubicación"
        >
          <RotateCcw className="w-3 h-3" />
          {updatedAt
            ? updatedAt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
            : 'Actualizar'}
        </button>
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

      {nearby.length === 0 ? (
        <div className="spa-card p-8 text-center space-y-2">
          <span className="spa-tile-lg mx-auto bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
            <MapPin className="w-6 h-6" />
          </span>
          <p className="font-heading font-bold text-[var(--text-primary)]">Nada de la lista cerca</p>
          <p className="text-[13px] text-[var(--text-muted)]">
            No hay spots pendientes en un radio de 5 km desde donde estás.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {nearby.map((spot) => {
            const cat = getCategory(spot.kind);
            const CatIcon = cat.icon;
            const safeUrl = sanitizeUrl(spot.mapsUrl)
              || `https://maps.google.com/?q=${encodeURIComponent(`${spot.name} NYC`)}`;

            return (
              <li key={spot.id}>
                <a
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spa-row py-4"
                >
                  <span className="spa-tile flex-shrink-0" style={{ backgroundColor: cat.soft, color: cat.color }}>
                    <CatIcon className="w-4 h-4" />
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block font-heading font-bold text-[15px] text-[var(--text-primary)] leading-snug truncate">
                      {spot.name}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[12px] text-[var(--text-muted)] mt-1">
                      <span className="font-mono font-bold text-[var(--accent-primary-text)]">
                        ~{formatDistance(spot.km)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Walking className="w-3 h-3" />
                        {walkingMinutes(spot.km)} min
                      </span>
                      <span className="truncate">{spot.zone}</span>
                    </span>
                  </span>

                  <ExternalLink className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <p className="flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed px-1">
        <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 mt-1" />
        Distancias aproximadas: se miden al centro del barrio de cada lugar, no a su puerta.
      </p>
    </section>
  );
}
