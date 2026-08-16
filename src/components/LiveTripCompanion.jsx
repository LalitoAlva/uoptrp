import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  MapPin,
  ArrowRight,
  Edit3,
  ExternalLink,
  Lock,
  Lightbulb,
  CheckCircle2,
  CircleXmark,
  Sparkles
} from '../utils/icons';
import { sanitizeUrl } from '../utils/sanitize';
import confetti from 'canvas-confetti';

const STATUS_CONFIG = {
  hecho: { label: 'Hice esto', icon: CheckCircle2, activeClass: 'bg-emerald-600 text-white font-black border-emerald-600 shadow-sm' },
  fijo: { label: 'Inamovible', icon: Lock, activeClass: 'bg-indigo-600 text-white font-black border-indigo-600 shadow-sm' },
  opcional: { label: 'Opcional', icon: Lightbulb, activeClass: 'bg-amber-600 text-white font-black border-amber-600 shadow-sm' },
  no_hecho: { label: 'No lo hice', icon: CircleXmark, activeClass: 'bg-rose-600 text-white font-black border-rose-600 shadow-sm' },
  pendiente: { label: 'Por hacer', icon: Clock, activeClass: 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-black border-[var(--text-primary)] shadow-sm' }
};

export default function LiveTripCompanion({ 
  tripData, 
  onChangeActivityStatus, 
  onEditActivity
}) {
  const [activeDayNum, setActiveDayNum] = useState(1);

  const currentDay = tripData.days.find(d => d.dayNumber === activeDayNum) || tripData.days[0];
  
  const pendingActivities = currentDay.timeline.filter(
    t => (t.status !== 'hecho' && !t.completed && t.status !== 'no_hecho')
  );

  const currentActivity = pendingActivities.length > 0 ? pendingActivities[0] : currentDay.timeline[0];
  const nextActivities = pendingActivities.slice(1, 3);

  const handleQuickStatus = (status) => {
    if (!currentActivity) return;
    onChangeActivityStatus(currentDay.dayNumber, currentActivity.id, status);
    if (status === 'hecho') {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
  };

  const currentStatus = currentActivity?.status || (currentActivity?.completed ? 'hecho' : 'pendiente');
  const safeMapsUrl = sanitizeUrl(currentActivity?.mapsUrl);

  return (
    <div className="spa-card p-6 sm:p-8 border-l-4 border-l-[var(--accent-primary)] space-y-6">
      
      {/* Header with Day Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-ping"></span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--accent-primary-text)]">
            Asistente en Vivo · Próxima Parada
          </span>
        </div>

        {/* Day buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {tripData.days.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setActiveDayNum(d.dayNumber)}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                activeDayNum === d.dayNumber
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              D{d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Card */}
      {currentActivity ? (
        <div className="space-y-5">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono font-bold text-xs sm:text-sm text-[var(--accent-primary-text)] bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded border border-[var(--accent-primary)]/20 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentActivity.time}
                </span>

                <span className="text-xs text-[var(--text-muted)] font-bold">
                  {currentDay.date}
                </span>

                {currentStatus === 'fijo' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Inamovible
                  </span>
                )}
                {currentStatus === 'opcional' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Opcional
                  </span>
                )}
                {currentStatus === 'hecho' && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completada
                  </span>
                )}
              </div>

              <h3 className="font-heading font-black text-xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                {currentActivity.title}
              </h3>

              {currentActivity.sub && (
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl font-medium">
                  {currentActivity.sub}
                </p>
              )}

              {currentActivity.address && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary-text)] flex-shrink-0" />
                  <span className="truncate">{currentActivity.address}</span>
                </div>
              )}
            </div>

            {/* Google Maps Action */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {safeMapsUrl && (
                <a
                  href={safeMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-6 py-3 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Navigation className="w-4 h-4 fill-white" />
                  <span>Ruta en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

          </div>

          {/* Compact icon-only status switcher, same pattern as the itinerary cards */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Marcar estado de esta parada:
            </span>

            <div
              role="group"
              aria-label="Cambiar estado de esta parada"
              className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]"
            >
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleQuickStatus(key)}
                  title={cfg.label}
                  aria-label={cfg.label}
                  aria-pressed={currentStatus === key}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all active:scale-90 ${
                    currentStatus === key
                      ? cfg.activeClass
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <cfg.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-8 text-[var(--text-muted)] text-sm font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          ¡Todas las paradas del Día {activeDayNum} están completadas!
        </div>
      )}

      {/* Next Stops Preview */}
      {nextActivities.length > 0 && (
        <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Siguientes paradas de hoy:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {nextActivities.map((nextAct) => (
              <div
                key={nextAct.id}
                className="p-3 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs font-bold text-[var(--accent-primary-text)]">{nextAct.time}</span>
                  <span className="font-semibold text-[var(--text-primary)] truncate text-xs">{nextAct.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
