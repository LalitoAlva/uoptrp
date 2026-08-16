import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Zap
} from '../utils/icons';
import { sanitizeUrl } from '../utils/sanitize';
import { STATUS_ORDER, STATUS_CONFIG, getStatus, getStatusConfig, getCategory } from '../utils/activityMeta';
import NearbyAlerts from './NearbyAlerts';
import confetti from 'canvas-confetti';

/**
 * The "I'm standing on a street corner in Queens" screen: one big answer to
 * "what now?", one big button to get there, and one tap to mark it done.
 */
export default function LiveTripCompanion({ tripData, onChangeActivityStatus, onEditActivity }) {
  const [activeDayNum, setActiveDayNum] = useState(1);

  const currentDay = tripData.days.find(d => d.dayNumber === activeDayNum) || tripData.days[0];

  const pendingActivities = currentDay.timeline.filter(t => {
    const st = getStatus(t);
    return st !== 'hecho' && st !== 'no_hecho';
  });

  const currentActivity = pendingActivities[0] || currentDay.timeline[0];
  const upNext = pendingActivities.slice(1, 4);

  const handleQuickStatus = (status) => {
    if (!currentActivity) return;
    onChangeActivityStatus(currentDay.dayNumber, currentActivity.id, status);
    if (status === 'hecho') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const currentStatus = currentActivity ? getStatus(currentActivity) : 'pendiente';
  const safeMapsUrl = sanitizeUrl(currentActivity?.mapsUrl);
  const currentCat = getCategory(currentActivity?.category);
  const CurrentCatIcon = currentCat.icon;

  const doneToday = currentDay.timeline.filter(t => getStatus(t) === 'hecho').length;

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ── Purpose of this screen ───────────────────────────────────── */}
      <header className="space-y-2">
        <span className="spa-eyebrow">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-[var(--accent-primary)] animate-soft-pulse" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
          </span>
          Asistente en vivo
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight">
          Qué sigue ahora mismo
        </h1>
        <p className="text-[13px] sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Tu pantalla de calle: la siguiente parada en grande, cómo llegar de un toque, qué lugares de
          tu lista tienes cerca y el día completo de un vistazo.
        </p>
      </header>

      {/* ── Day switcher ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="spa-eyebrow">Elige el día</span>
          <span className="text-xs font-bold text-[var(--text-muted)]">
            {doneToday}/{currentDay.timeline.length} hechas hoy
          </span>
        </div>

        <div className="spa-rail hide-scrollbar">
          {tripData.days.map((d) => {
            const isActive = activeDayNum === d.dayNumber;
            const [weekday, dayNum] = d.date.split(' ');
            return (
              <button
                key={d.dayNumber}
                onClick={() => setActiveDayNum(d.dayNumber)}
                aria-pressed={isActive}
                className={`flex flex-col items-center justify-center gap-1 w-[4.25rem] h-[4.5rem] rounded-2xl font-bold transition-colors spa-pressable ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-white shadow-[0_10px_24px_-14px_var(--accent-primary)]'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest leading-none ${isActive ? 'text-white/75' : 'text-[var(--text-muted)]'}`}>
                  {weekday?.slice(0, 3)}
                </span>
                <span className="font-display text-2xl leading-none">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Focus card ───────────────────────────────────────────────── */}
      {currentActivity ? (
        <div className="spa-banner p-6 sm:p-8 space-y-6 animate-rise">

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="spa-chip h-8 font-mono" style={{ backgroundColor: 'var(--accent-primary-soft)', color: 'var(--accent-primary-text)', borderColor: 'transparent' }}>
                <Clock className="w-3.5 h-3.5" />
                {currentActivity.time}
              </span>
              <span className="spa-chip h-8" style={{ backgroundColor: currentCat.soft, color: currentCat.color, borderColor: 'transparent' }}>
                <CurrentCatIcon className="w-3.5 h-3.5" />
                {currentCat.label}
              </span>
              <span className="text-xs font-bold text-[var(--text-muted)]">{currentDay.date}</span>
            </div>

            <div>
              <span className="spa-eyebrow mb-1.5">
                <Zap className="w-3 h-3 text-[var(--accent-primary-text)]" />
                Tu próxima parada
              </span>
              <h2 className="font-display text-3xl sm:text-5xl text-[var(--text-primary)] leading-[1.05]">
                {currentActivity.title}
              </h2>
            </div>

            {currentActivity.sub && (
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {currentActivity.sub}
              </p>
            )}

            {currentActivity.address && (
              <div className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                <MapPin className="w-4 h-4 text-[var(--accent-primary-text)] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{currentActivity.address}</span>
              </div>
            )}
          </div>

          {safeMapsUrl && (
            <a
              href={safeMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spa-btn spa-btn-primary w-full sm:w-auto min-h-[3.5rem] text-base px-8"
            >
              <Navigation className="w-4 h-4" />
              Cómo llegar
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            <span className="spa-eyebrow">Marcar esta parada</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {STATUS_ORDER.map((key) => {
                const cfg = STATUS_CONFIG[key];
                const Icon = cfg.icon;
                const isActive = currentStatus === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleQuickStatus(key)}
                    aria-pressed={isActive}
                    className="spa-action"
                    style={isActive ? { backgroundColor: cfg.solid, borderColor: cfg.solid, color: cfg.onSolid } : undefined}
                  >
                    <Icon className="w-[1.15rem] h-[1.15rem]" />
                    {cfg.short}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="spa-card p-10 text-center space-y-3">
          <span className="spa-tile-lg mx-auto bg-[color-mix(in_srgb,var(--accent-emerald)_16%,transparent)] text-[var(--accent-emerald-text)]">
            <Sparkles className="w-6 h-6" />
          </span>
          <p className="font-heading font-bold text-lg text-[var(--text-primary)]">
            ¡Día {activeDayNum} completado!
          </p>
          <p className="text-sm text-[var(--text-muted)]">Todas las paradas están marcadas.</p>
        </div>
      )}

      {/* ── What's around me right now ───────────────────────────────── */}
      <NearbyAlerts recommendations={tripData.recommendations} />

      {/* ── Up next ──────────────────────────────────────────────────── */}
      {upNext.length > 0 && (
        <div className="space-y-3">
          <span className="spa-eyebrow">Después de esto</span>
          <div className="space-y-2">
            {upNext.map((act) => {
              const cat = getCategory(act.category);
              const CatIcon = cat.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => onEditActivity(currentDay.dayNumber, act)}
                  className="spa-row"
                >
                  <span className="spa-tile" style={{ backgroundColor: cat.soft, color: cat.color }}>
                    <CatIcon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-heading font-bold text-[15px] text-[var(--text-primary)] truncate">
                      {act.title}
                    </span>
                    <span className="block text-xs text-[var(--text-muted)] font-mono mt-0.5">{act.time}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Whole day ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <span className="spa-eyebrow">Todo el día {activeDayNum}</span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {currentDay.timeline.map((act) => {
            const cfg = getStatusConfig(act);
            const StatusIcon = cfg.icon;
            const isCurrent = act.id === currentActivity?.id;
            const isSkipped = getStatus(act) === 'no_hecho';
            return (
              <button
                key={act.id}
                onClick={() => onEditActivity(currentDay.dayNumber, act)}
                className={`spa-row ${isCurrent ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)]' : ''} ${isSkipped ? 'opacity-55' : ''}`}
              >
                <span className="spa-tile-sm" style={{ backgroundColor: cfg.soft, color: cfg.color }}>
                  <StatusIcon className="w-3.5 h-3.5" />
                </span>
                <span className="font-mono text-xs font-bold text-[var(--text-muted)] flex-shrink-0 w-11">
                  {act.time}
                </span>
                <span className={`flex-1 min-w-0 text-sm font-bold truncate ${
                  isSkipped ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                }`}>
                  {act.title}
                </span>
                <ChevronRight className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
