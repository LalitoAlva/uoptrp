import React, { useState } from 'react';
import {
  MapPin,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  ExternalLink,
  Sparkles,
  Plus,
  Lock,
  CheckCircle2,
  CircleXmark,
  Lightbulb,
  TennisBall,
  Beer,
  Utensils,
  Music,
  Landmark,
  ShoppingBag,
  Plane,
  Banknote,
  iconForEmoji
} from '../utils/icons';
import { sanitizeRichText } from '../utils/sanitize';
import confetti from 'canvas-confetti';

export default function DayCard({ 
  day, 
  filterCategory, 
  filterStatus,
  onChangeActivityStatus, 
  onEditActivity, 
  onDeleteActivity, 
  onMoveActivity, 
  onAddActivityToDay 
}) {
  const [expandedExtras, setExpandedExtras] = useState(false);

  // 5 Clear, Practical States
  const STATUS_CONFIG = {
    hecho: {
      label: 'Hice esto',
      icon: CheckCircle2,
      shortLabel: 'Hecho',
      activeClass: 'bg-emerald-600 text-white font-black border-emerald-600 shadow-sm',
      inactiveClass: 'bg-[var(--bg-surface-elevated)] hover:bg-emerald-500/15 text-[var(--text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-400 border-[var(--border-subtle)]'
    },
    fijo: {
      label: 'Inamovible',
      icon: Lock,
      shortLabel: 'Inamovible',
      activeClass: 'bg-indigo-600 text-white font-black border-indigo-600 shadow-sm',
      inactiveClass: 'bg-[var(--bg-surface-elevated)] hover:bg-indigo-500/15 text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 border-[var(--border-subtle)]'
    },
    opcional: {
      label: 'Se puede quitar',
      icon: Lightbulb,
      shortLabel: 'Opcional',
      activeClass: 'bg-amber-600 text-white font-black border-amber-600 shadow-sm',
      inactiveClass: 'bg-[var(--bg-surface-elevated)] hover:bg-amber-500/15 text-[var(--text-secondary)] hover:text-amber-600 dark:hover:text-amber-400 border-[var(--border-subtle)]'
    },
    no_hecho: {
      label: 'No lo hice',
      icon: CircleXmark,
      shortLabel: 'Omitido',
      activeClass: 'bg-rose-600 text-white font-black border-rose-600 shadow-sm',
      inactiveClass: 'bg-[var(--bg-surface-elevated)] hover:bg-rose-500/15 text-[var(--text-secondary)] hover:text-rose-600 dark:hover:text-rose-400 border-[var(--border-subtle)]'
    },
    pendiente: {
      label: 'Por hacer',
      icon: Clock,
      shortLabel: 'Por hacer',
      activeClass: 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-black border-[var(--text-primary)] shadow-sm',
      inactiveClass: 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] border-[var(--border-subtle)]'
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'tennis':
        return { icon: TennisBall, label: 'US Open', color: 'text-lime-600 dark:text-lime-400 bg-lime-500/10 border-lime-500/20' };
      case 'beer':
        return { icon: Beer, label: 'Bares & Cerveza', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'food':
        return { icon: Utensils, label: 'Comida & Delis', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'music':
        return { icon: Music, label: 'Jazz & Música', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'culture':
      case 'sights':
        return { icon: Landmark, label: 'Paseos & Vistas', color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'books':
      case 'shopping':
        return { icon: ShoppingBag, label: 'Compras & Tech', color: 'text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/20' };
      case 'logistics':
      default:
        return { icon: Plane, label: 'Logística & Tren', color: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const handleSetStatus = (activityId, newStatus) => {
    onChangeActivityStatus(day.dayNumber, activityId, newStatus);
    if (newStatus === 'hecho') {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
  };

  const filteredTimeline = day.timeline.filter(item => {
    if (filterCategory && filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus && filterStatus !== 'all') {
      const currentStatus = item.status || (item.completed ? 'hecho' : 'pendiente');
      if (currentStatus !== filterStatus) return false;
    }
    return true;
  });

  const hechoCount = day.timeline.filter(t => t.status === 'hecho' || t.completed).length;
  const fijoCount = day.timeline.filter(t => t.status === 'fijo').length;
  const opcionalCount = day.timeline.filter(t => t.status === 'opcional').length;

  return (
    <div className="spa-card overflow-hidden">
      
      {/* Day Header */}
      <div className="bg-[var(--bg-surface-elevated)] px-6 sm:px-8 py-6 sm:py-8 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[var(--accent-primary)] text-white font-heading font-black text-2xl flex items-center justify-center shadow-sm flex-shrink-0">
            {day.dayNumber}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-heading font-black text-xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                {day.date}
              </h2>
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                {day.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
              {day.title}
            </p>
          </div>
        </div>

        {/* Status Counters & Add button */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20" title="Inamovibles">
              <Lock className="w-3 h-3" /> {fijoCount}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" title="Opcionales">
              <Lightbulb className="w-3 h-3" /> {opcionalCount}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" title="Realizados">
              <CheckCircle2 className="w-3 h-3" /> {hechoCount}
            </span>
          </div>

          <button
            onClick={() => onAddActivityToDay(day.dayNumber)}
            className="px-3.5 py-2 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[var(--accent-primary-text)] stroke-[3]" />
            <span>Agregar Parada</span>
          </button>
        </div>

      </div>

      {/* Activities Timeline Content */}
      <div className="p-6 sm:p-8 space-y-8 sm:space-y-10">
        
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-muted)] text-sm">
            No hay paradas con los filtros seleccionados en este día.
          </div>
        ) : (
          filteredTimeline.map((item, index) => {
            const catBadge = getCategoryBadge(item.category);
            const currentStatus = item.status || (item.completed ? 'hecho' : 'pendiente');

            return (
              <div
                key={item.id}
                className={`spa-card p-6 sm:p-7 border transition-all space-y-4 ${
                  currentStatus === 'hecho'
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : currentStatus === 'fijo'
                    ? 'border-indigo-500/40 bg-indigo-500/5'
                    : currentStatus === 'opcional'
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : currentStatus === 'no_hecho'
                    ? 'border-rose-500/30 opacity-60 bg-[var(--bg-surface-elevated)]/40'
                    : 'bg-[var(--bg-surface)] hover:border-[var(--border-medium)]'
                }`}
              >
                {/* Row 1: Time, Title, Category Badge, and Quick Edit Actions */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Time Badge */}
                    <span className="flex-shrink-0 font-mono font-bold text-xs sm:text-sm text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] px-2.5 py-1 rounded flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-4 h-4 text-[var(--accent-primary-text)]" />
                      {item.time}
                    </span>

                    {/* Title & Category */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-heading font-black text-base sm:text-lg text-[var(--text-primary)] ${
                          currentStatus === 'no_hecho' ? 'line-through text-[var(--text-muted)]' : ''
                        }`}>
                          {item.title}
                        </h3>
                        
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded border ${catBadge.color}`}>
                          <catBadge.icon className="w-3 h-3" />
                          {catBadge.label}
                        </span>

                        {item.paymentMethod === 'cash_only' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Banknote className="w-3 h-3" />
                            Solo Efectivo
                          </span>
                        )}
                      </div>

                      {item.sub && (
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                          {item.sub}
                        </p>
                      )}

                      {item.address && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary-text)] flex-shrink-0" />
                          <span className="truncate">{item.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Map & Edit Tools */}
                  <div className="flex items-center gap-2 self-end md:self-start">
                    {item.mapsUrl && (
                      <a
                        href={item.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary-text)] text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <div className="flex items-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => onMoveActivity(day.dayNumber, index, 'up')}
                          className="p-1.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          title="Subir"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index < filteredTimeline.length - 1 && (
                        <button
                          onClick={() => onMoveActivity(day.dayNumber, index, 'down')}
                          className="p-1.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          title="Bajar"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onEditActivity(day.dayNumber, item)}
                        className="p-1.5 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        title="Editar parada"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteActivity(day.dayNumber, item.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                        title="Eliminar parada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Row 2: Compact icon-only status switcher — grouped as one
                    unit instead of stretched edge-to-edge, so it doesn't read
                    as an empty spreadsheet row on wide screens. */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 flex-wrap">
                  <div
                    role="group"
                    aria-label="Cambiar estado de esta parada"
                    className="flex items-center gap-2 pl-1"
                  >
                    <span className={`flex items-center gap-1.5 text-xs font-bold font-mono ${
                      currentStatus === 'hecho' ? 'text-emerald-500' :
                      currentStatus === 'fijo' ? 'text-indigo-500' :
                      currentStatus === 'opcional' ? 'text-amber-500' :
                      currentStatus === 'no_hecho' ? 'text-rose-500' : 'text-[var(--text-muted)]'
                    }`}>
                      {(() => {
                        const CurrentIcon = STATUS_CONFIG[currentStatus].icon;
                        return <CurrentIcon className="w-3.5 h-3.5" />;
                      })()}
                      {STATUS_CONFIG[currentStatus].label}
                    </span>

                    <div className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSetStatus(item.id, key)}
                          title={cfg.label}
                          aria-label={cfg.label}
                          aria-pressed={currentStatus === key}
                          className={`w-9 h-9 rounded-md flex items-center justify-center transition-all active:scale-90 ${
                            currentStatus === key
                              ? cfg.activeClass
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <cfg.icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}

        {/* Day Tips Box */}
        {day.tips && day.tips.length > 0 && (
          <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-5 text-xs sm:text-sm space-y-2 mt-4">
            <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 uppercase text-xs tracking-wider">
              <Lightbulb className="w-3.5 h-3.5" />
              Tips del Día {day.dayNumber}:
            </span>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)] pl-1 font-medium">
              {day.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Extra Knowledge Cards Accordion */}
        {day.extraCards && day.extraCards.length > 0 && (
          <div className="pt-2">
            <button 
              onClick={() => setExpandedExtras(!expandedExtras)}
              className="text-xs sm:text-sm font-bold text-[var(--accent-primary-text)] flex items-center gap-1.5 hover:underline"
            >
              <Sparkles className="w-4 h-4" />
              <span>Guías y Puntos Clave de este Día ({day.extraCards.length})</span>
              {expandedExtras ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedExtras && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                {day.extraCards.map((card, idx) => {
                  const CardIcon = iconForEmoji(card.icon);
                  return (
                    <div
                      key={idx}
                      className="rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-4 text-xs sm:text-sm space-y-2"
                    >
                      <div className="font-bold text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
                        <CardIcon className="w-4 h-4 text-[var(--accent-primary-text)]" />
                        <span>{card.title}</span>
                      </div>
                      <ul className="space-y-1.5 text-[var(--text-secondary)]">
                        {card.items.map((it, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-1.5">
                            <ChevronUp className="w-3 h-3 rotate-90 mt-0.5 flex-shrink-0 text-[var(--text-muted)]" />
                            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(it) }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
