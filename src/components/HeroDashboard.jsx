import React, { useState, useEffect } from 'react';
import {
  Hotel,
  Trophy,
  Ticket,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Lock,
  Lightbulb,
  CheckCircle2,
  CircleXmark,
  Wine,
  Landmark,
  TennisBall
} from '../utils/icons';

export default function HeroDashboard({ 
  tripData, 
  onOpenTasks, 
  onNavigateTab 
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(tripData.metadata.targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [tripData.metadata.targetDate]);

  let totalActivities = 0;
  let fijoCount = 0;
  let opcionalCount = 0;
  let hechoCount = 0;
  let noHechoCount = 0;

  tripData.days.forEach(day => {
    day.timeline.forEach(item => {
      totalActivities++;
      const st = item.status || (item.completed ? 'hecho' : 'pendiente');
      if (st === 'fijo') fijoCount++;
      else if (st === 'opcional') opcionalCount++;
      else if (st === 'hecho') hechoCount++;
      else if (st === 'no_hecho') noHechoCount++;
    });
  });

  const urgentCount = tripData.urgentTasks.filter(t => !t.completed).length;

  return (
    <div className="w-full space-y-8">
      
      {/* Top Banner Card */}
      <div className="spa-card p-8 sm:p-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Main Title & Details */}
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)] border border-[var(--accent-primary)]/20">
                Viaje Oficial · {tripData.metadata.travelers}
              </span>
              <span className="text-xs font-mono font-medium text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded border border-[var(--border-subtle)]">
                {tripData.metadata.dates}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black text-[var(--text-primary)] tracking-tight">
              Nueva York <span className="text-[var(--accent-primary-text)]">·</span> US Open 2026
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              7 días · 4 sesiones estelares en Arthur Ashe · Hudson Valley · Go City Pass y la mejor ruta gastronómica, cervecera y cultural de Manhattan y Queens.
            </p>

            {/* Status Breakdown Bar */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Lock className="w-3.5 h-3.5" />
                <span>Inamovibles:</span>
                <span className="font-mono">{fijoCount}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Opcionales:</span>
                <span className="font-mono">{opcionalCount}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Realizados:</span>
                <span className="font-mono">{hechoCount}</span>
              </div>

              {noHechoCount > 0 && (
                <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <CircleXmark className="w-3.5 h-3.5" />
                  <span>Omitidos:</span>
                  <span className="font-mono">{noHechoCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div className="w-full lg:w-auto bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded p-5 sm:p-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
              <Calendar className="w-4 h-4 text-[var(--accent-primary-text)]" />
              <span>Tiempo para el Despegue</span>
            </div>

            {timeLeft.isPast ? (
              <div className="text-center py-2 flex items-center justify-center gap-2">
                <span className="text-xl font-black text-emerald-500">¡EL VIAJE ESTÁ EN MARCHA!</span>
                <Landmark className="w-5 h-5 text-emerald-500" />
                <TennisBall className="w-5 h-5 text-emerald-500" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-2.5 min-w-[60px]">
                  <span className="block font-mono font-bold text-xl sm:text-3xl text-[var(--text-primary)]">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Días</span>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-2.5 min-w-[60px]">
                  <span className="block font-mono font-bold text-xl sm:text-3xl text-[var(--accent-primary-text)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Horas</span>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-2.5 min-w-[60px]">
                  <span className="block font-mono font-bold text-xl sm:text-3xl text-[var(--text-primary)]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Min</span>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-2.5 min-w-[60px]">
                  <span className="block font-mono font-bold text-xl sm:text-3xl text-[var(--text-secondary)]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Seg</span>
                </div>
              </div>
            )}

            <div className="mt-3 text-xs text-[var(--text-muted)] text-center font-mono">
              Vuelo UA Directo · Vie 4 Sep 07:10 MEX
            </div>
          </div>

        </div>
      </div>

      {/* 4 Core Logistic Cards — tighter gap, content centered in each card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Hotel */}
        <div
          onClick={() => onNavigateTab('itinerary')}
          className="spa-card spa-card-hover p-5 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="p-2.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2.5">
            <Hotel className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] px-2 py-0.5 rounded mb-2">
            6 Noches
          </span>
          <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
            Marriott Marquis
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Times Square, 1535 Broadway</p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] w-full flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span>Check-in 16:00 (Vie 4)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-primary-text)]" />
          </div>
        </div>

        {/* Card 2: Arthur Ashe */}
        <div
          onClick={() => onNavigateTab('usopen')}
          className="spa-card spa-card-hover p-5 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="p-2.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)] mb-2.5">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase bg-[var(--accent-primary)]/15 text-[var(--accent-primary-text)] px-2 py-0.5 rounded mb-2">
            4 Sesiones
          </span>
          <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
            Arthur Ashe Stadium
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Dom 6 (S15, S16) & Lun 7 (S17, S18)</p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] w-full flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Wine className="w-3.5 h-3.5 text-rose-400" />
            <span>Honey Deuce: {tripData.honeyDeuceTracker?.currentCount || 0}/4</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-primary-text)]" />
          </div>
        </div>

        {/* Card 3: Go City Pass */}
        <div
          onClick={() => onNavigateTab('usopen')}
          className="spa-card spa-card-hover p-5 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="p-2.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2.5">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded mb-2">
            3 Atracciones
          </span>
          <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
            Go City Explorer Pass
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Intrepid, Top of Rock, MoMA</p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] w-full flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span>En App Móvil</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
          </div>
        </div>

        {/* Card 4: Pendientes */}
        <div
          onClick={onOpenTasks}
          className="spa-card spa-card-hover p-5 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="p-2.5 rounded bg-rose-500/10 text-rose-500 mb-2.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 ${
            urgentCount > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {urgentCount} Requisitos
          </span>
          <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
            Pendientes Clave
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Keens, Jazz, eSIM, Metro North</p>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] w-full flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span>Revisar lista</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
          </div>
        </div>

      </div>

    </div>
  );
}
