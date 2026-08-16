import React, { useState, useEffect } from 'react';
import {
  Hotel,
  Trophy,
  Ticket,
  AlertTriangle,
  ChevronRight,
  Wine,
  Plane,
  CheckCircle2
} from '../utils/icons';
import { getStatus } from '../utils/activityMeta';

export default function HeroDashboard({ tripData, onOpenTasks, onNavigateTab }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(tripData.metadata.targetDate).getTime();
      const diff = target - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isPast: false
      });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [tripData.metadata.targetDate]);

  let totalActivities = 0;
  let hechoCount = 0;
  tripData.days.forEach(day => {
    day.timeline.forEach(item => {
      totalActivities++;
      if (getStatus(item) === 'hecho') hechoCount++;
    });
  });
  const tripProgress = totalActivities > 0 ? Math.round((hechoCount / totalActivities) * 100) : 0;

  const urgentCount = tripData.urgentTasks.filter(t => !t.completed).length;
  const honeyCount = tripData.honeyDeuceTracker?.currentCount || 0;

  const countdownUnits = [
    { value: timeLeft.days, label: 'Días' },
    { value: String(timeLeft.hours).padStart(2, '0'), label: 'Horas' },
    { value: String(timeLeft.minutes).padStart(2, '0'), label: 'Min' },
    { value: String(timeLeft.seconds).padStart(2, '0'), label: 'Seg' }
  ];

  const quickCards = [
    {
      id: 'hotel',
      eyebrow: '6 noches',
      title: 'Marriott Marquis',
      detail: 'Times Square · 1535 Broadway',
      foot: 'Check-in 16:00 · Vie 4',
      icon: Hotel,
      color: 'var(--accent-amber-text)',
      soft: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)',
      onClick: () => onNavigateTab('itinerary')
    },
    {
      id: 'ashe',
      eyebrow: '4 sesiones',
      title: 'Arthur Ashe Stadium',
      detail: 'Dom 6 (S15, S16) · Lun 7 (S17, S18)',
      foot: `Honey Deuce ${honeyCount}/4`,
      footIcon: Wine,
      icon: Trophy,
      color: 'var(--accent-primary-text)',
      soft: 'var(--accent-primary-soft)',
      onClick: () => onNavigateTab('usopen')
    },
    {
      id: 'gocity',
      eyebrow: '3 atracciones',
      title: 'Go City Explorer Pass',
      detail: 'Intrepid · Top of the Rock · MoMA',
      foot: 'Pase en la app móvil',
      icon: Ticket,
      color: 'var(--accent-tennis-text)',
      soft: 'color-mix(in srgb, var(--accent-tennis) 16%, transparent)',
      onClick: () => onNavigateTab('usopen')
    },
    {
      id: 'pendientes',
      eyebrow: `${urgentCount} por cerrar`,
      title: 'Pendientes clave',
      detail: 'Keens · Jazz · eSIM · Metro North',
      foot: 'Revisar la lista',
      icon: AlertTriangle,
      color: urgentCount > 0 ? 'var(--accent-rose-text)' : 'var(--accent-emerald-text)',
      soft: urgentCount > 0
        ? 'color-mix(in srgb, var(--accent-rose) 16%, transparent)'
        : 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)',
      onClick: onOpenTasks
    }
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="spa-banner p-6 sm:p-10 animate-rise">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

          <div className="space-y-4 lg:max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="spa-chip h-8 text-[11px]" style={{ backgroundColor: 'var(--accent-primary-soft)', color: 'var(--accent-primary-text)', borderColor: 'transparent' }}>
                Viaje oficial · {tripData.metadata.travelers}
              </span>
              <span className="spa-chip h-8 text-[11px] font-mono">
                {tripData.metadata.dates}
              </span>
            </div>

            <h1 className="font-display text-[2.5rem] leading-[1.02] sm:text-6xl text-[var(--text-primary)]">
              Nueva York
              <span className="block text-[var(--accent-primary-text)]">US Open 2026</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              7 días · 4 sesiones estelares en Arthur Ashe · Hudson Valley · Go City Pass y la mejor
              ruta gastronómica, cervecera y cultural de Manhattan y Queens.
            </p>

            {/* Trip progress replaces the old row of four counter badges */}
            <div className="space-y-2 pt-1 max-w-sm">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-emerald-text)]" />
                  {hechoCount} de {totalActivities} paradas vividas
                </span>
                <span className="font-mono text-[var(--text-muted)]">{tripProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-sunken)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--accent-emerald)] transition-[width] duration-700"
                  style={{ width: `${tripProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <span className="spa-eyebrow mb-3">
              <Plane className="w-3.5 h-3.5 text-[var(--accent-primary-text)]" />
              Tiempo para el despegue
            </span>

            {timeLeft.isPast ? (
              <div className="spa-surface-elevated px-6 py-5 text-center">
                <span className="font-heading font-black text-xl text-[var(--accent-emerald-text)]">
                  ¡El viaje está en marcha!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 lg:gap-2.5">
                {countdownUnits.map((unit) => (
                  <div
                    key={unit.label}
                    className="spa-surface-elevated py-3.5 lg:px-5 text-center"
                  >
                    <span className="block font-display text-2xl sm:text-4xl text-[var(--text-primary)] tabular-nums">
                      {unit.value}
                    </span>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mt-1.5">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-[var(--text-muted)] font-mono text-center mt-3">
              Vuelo UA directo · Vie 4 Sep 07:10 MEX
            </p>
          </div>

        </div>
      </div>

      {/* ── Quick cards ──────────────────────────────────────────────────
          A swipeable rail on phones, a grid from `sm` up. Keeping them off
          the vertical stack is what saves ~600px of scroll on mobile. */}
      <div>
        <span className="spa-eyebrow mb-3">Lo esencial del viaje</span>
        <div className="spa-rail hide-scrollbar sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:gap-4 sm:overflow-visible">
          {quickCards.map((card) => {
            const Icon = card.icon;
            const FootIcon = card.footIcon;
            return (
              <button
                key={card.id}
                onClick={card.onClick}
                className="spa-card spa-card-hover p-5 w-[16.5rem] sm:w-auto text-left flex flex-col spa-pressable"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="spa-tile" style={{ backgroundColor: card.soft, color: card.color }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: card.soft, color: card.color }}
                  >
                    {card.eyebrow}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[var(--text-primary)] mt-4 leading-snug">
                  {card.title}
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] mt-1 leading-snug flex-1">
                  {card.detail}
                </p>

                <span className="flex items-center gap-1.5 mt-4 pt-3.5 border-t border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                  {FootIcon && <FootIcon className="w-3.5 h-3.5" style={{ color: card.color }} />}
                  <span className="flex-1">{card.foot}</span>
                  <ChevronRight className="w-3 h-3" style={{ color: card.color }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
