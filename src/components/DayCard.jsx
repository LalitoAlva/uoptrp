import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Banknote,
  CheckCircle2,
  iconForEmoji
} from '../utils/icons';
import { sanitizeRichText } from '../utils/sanitize';
import { getCategory, getStatus, getStatusConfig, STATUS_CONFIG } from '../utils/activityMeta';
import ActivityDetailSheet from './ActivityDetailSheet';
import BottomSheet from './BottomSheet';
import confetti from 'canvas-confetti';

/**
 * One day of the trip as a scannable timeline.
 *
 * The previous version rendered every stop as a full card carrying its
 * address, a maps link, reorder/edit/delete buttons and a five-state status
 * switcher — plus the day's tips box and an accordion of guide cards, all
 * inline. On a phone that was a single unbroken wall. Now:
 *   · each stop is one tall, tappable row (time · title · category · status)
 *   · everything you *do* to a stop lives in ActivityDetailSheet
 *   · tips and guides live behind two chips in the day header
 */
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
  const [detailIndex, setDetailIndex] = useState(null);
  const [infoTab, setInfoTab] = useState(null); // 'tips' | 'guides' | null

  const filteredTimeline = day.timeline.filter(item => {
    if (filterCategory && filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus && filterStatus !== 'all' && getStatus(item) !== filterStatus) return false;
    return true;
  });

  const total = day.timeline.length;
  const doneCount = day.timeline.filter(t => getStatus(t) === 'hecho').length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const tipsCount = day.tips?.length || 0;
  const guidesCount = day.extraCards?.length || 0;

  const handleSetStatus = (activityId, newStatus) => {
    onChangeActivityStatus(day.dayNumber, activityId, newStatus);
    if (newStatus === 'hecho') {
      confetti({ particleCount: 30, spread: 55, origin: { y: 0.75 } });
    }
  };

  const detailActivity = detailIndex !== null ? filteredTimeline[detailIndex] : null;

  return (
    <section className="spa-card overflow-hidden">

      {/* ── Day header ───────────────────────────────────────────────── */}
      <header className="relative px-5 sm:px-7 pt-6 pb-5 bg-gradient-to-br from-[var(--accent-primary-soft)] to-transparent border-b border-[var(--border-subtle)]">
        <div className="flex items-start gap-4">
          <div className="spa-tile-lg bg-[var(--accent-primary)] text-white font-display text-2xl flex-shrink-0 shadow-[0_10px_24px_-12px_var(--accent-primary)]">
            {day.dayNumber}
          </div>

          <div className="flex-1 min-w-0">
            <span className="spa-eyebrow">{day.badge}</span>
            <h2 className="font-heading font-black text-xl sm:text-3xl text-[var(--text-primary)] leading-tight mt-1">
              {day.date}
            </h2>
            <p className="text-[13px] sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-snug">
              {day.title}
            </p>
          </div>
        </div>

        {/* Progress — one honest number instead of three counter badges */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-emerald-text)]" />
              {doneCount} de {total} paradas
            </span>
            <span className="font-mono text-[var(--text-muted)]">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-sunken)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent-emerald)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tips & guides now live behind chips — this is the content that used
            to pad out the bottom of every single day on mobile. */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {tipsCount > 0 && (
            <button
              onClick={() => setInfoTab('tips')}
              className="spa-chip"
              style={{ backgroundColor: STATUS_CONFIG.opcional.soft, color: 'var(--accent-amber-text)', borderColor: 'transparent' }}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Tips del día
              <span className="font-mono opacity-70">{tipsCount}</span>
            </button>
          )}
          {guidesCount > 0 && (
            <button
              onClick={() => setInfoTab('guides')}
              className="spa-chip"
              style={{ backgroundColor: 'var(--accent-primary-soft)', color: 'var(--accent-primary-text)', borderColor: 'transparent' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Guías
              <span className="font-mono opacity-70">{guidesCount}</span>
            </button>
          )}
          <button onClick={() => onAddActivityToDay(day.dayNumber)} className="spa-chip">
            <Plus className="w-3.5 h-3.5 text-[var(--accent-primary-text)]" />
            Agregar parada
          </button>
        </div>
      </header>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-5 py-4">
        {filteredTimeline.length === 0 ? (
          <p className="text-center py-12 text-sm text-[var(--text-muted)]">
            No hay paradas con los filtros seleccionados en este día.
          </p>
        ) : (
          <ol className="relative">
            {/* The rail that ties the stops together visually. 46px = the
                list's 12px padding + the row's 8px padding + half of the 52px
                time column, so it threads exactly through every status dot. */}
            <span
              className="absolute left-[2.875rem] top-6 bottom-6 w-px bg-[var(--border-subtle)]"
              aria-hidden="true"
            />

            {filteredTimeline.map((item, index) => {
              const cat = getCategory(item.category);
              const CatIcon = cat.icon;
              const status = getStatus(item);
              const statusCfg = getStatusConfig(item);
              const StatusIcon = statusCfg.icon;
              const isSkipped = status === 'no_hecho';

              const TravelIcon = item.travelFromPrev ? iconForEmoji(item.travelFromPrev.icon) : null;

              return (
                <li key={item.id} className="relative">
                  {item.travelFromPrev && (
                    <div className="flex items-center gap-2 pl-[3.25rem] pb-1.5 pr-2 text-[11px] text-[var(--text-muted)]">
                      <span
                        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-[var(--bg-surface)] bg-[var(--bg-sunken)]"
                        title="Cómo llegar desde la parada anterior"
                      >
                        <TravelIcon className="w-2.5 h-2.5" />
                      </span>
                      <span className="leading-snug line-clamp-1">{item.travelFromPrev.text}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setDetailIndex(index)}
                    className={`w-full flex items-start gap-3 sm:gap-4 py-3.5 px-2 rounded-2xl text-left transition-colors spa-pressable hover:bg-[var(--bg-surface-elevated)] ${
                      isSkipped ? 'opacity-55' : ''
                    }`}
                  >
                    {/* Time + status marker */}
                    <span className="flex flex-col items-center gap-1.5 w-[3.25rem] flex-shrink-0 pt-0.5">
                      <span className="font-mono font-bold text-[11px] text-[var(--text-muted)] leading-none">
                        {item.time}
                      </span>
                      <span
                        className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-[var(--bg-surface)]"
                        style={{ backgroundColor: statusCfg.soft, color: statusCfg.color }}
                        title={statusCfg.label}
                      >
                        <StatusIcon className="w-3 h-3" />
                      </span>
                    </span>

                    {/* Content */}
                    <span className="flex-1 min-w-0">
                      <span className="flex items-start gap-2">
                        <span
                          className="spa-tile-sm flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: cat.soft, color: cat.color }}
                        >
                          <CatIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`block font-heading font-bold text-[15px] leading-snug text-[var(--text-primary)] ${
                            isSkipped ? 'line-through' : ''
                          }`}>
                            {item.title}
                          </span>
                          {item.sub && (
                            <span className="block text-[13px] text-[var(--text-muted)] leading-snug mt-1 line-clamp-2">
                              {item.sub}
                            </span>
                          )}
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-bold">
                            <span style={{ color: statusCfg.color }}>{statusCfg.label}</span>
                            {item.address && (
                              <span className="flex items-center gap-1 text-[var(--text-muted)] min-w-0">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate max-w-[10rem]">{item.address}</span>
                              </span>
                            )}
                            {item.paymentMethod === 'cash_only' && (
                              <span className="flex items-center gap-1 text-[var(--accent-amber-text)]">
                                <Banknote className="w-3 h-3" />
                                Efectivo
                              </span>
                            )}
                            {item.insiderTip && (
                              <span
                                className="flex items-center gap-1 text-[var(--accent-amber-text)]"
                                title={item.insiderTip.text}
                              >
                                <Lightbulb className="w-3 h-3" />
                                Tip
                              </span>
                            )}
                          </span>
                        </span>
                      </span>
                    </span>

                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0 mt-4" />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* ── Sheets ───────────────────────────────────────────────────── */}
      <ActivityDetailSheet
        isOpen={detailActivity !== null && detailActivity !== undefined}
        onClose={() => setDetailIndex(null)}
        activity={detailActivity}
        dayNumber={day.dayNumber}
        dayDate={day.date}
        index={detailIndex}
        total={filteredTimeline.length}
        onChangeStatus={handleSetStatus}
        onEdit={onEditActivity}
        onDelete={onDeleteActivity}
        onMove={onMoveActivity}
      />

      <BottomSheet
        isOpen={infoTab === 'tips'}
        onClose={() => setInfoTab(null)}
        title={`Tips del Día ${day.dayNumber}`}
        subtitle={day.date}
        icon={Lightbulb}
        accent="var(--accent-amber-text)"
        accentBg={STATUS_CONFIG.opcional.soft}
      >
        <ul className="space-y-3">
          {(day.tips || []).map((tip, i) => (
            <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)]">
              <span className="spa-tile-sm flex-shrink-0" style={{ backgroundColor: STATUS_CONFIG.opcional.soft, color: 'var(--accent-amber-text)' }}>
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm text-[var(--text-secondary)] leading-relaxed pt-1.5">{tip}</span>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        isOpen={infoTab === 'guides'}
        onClose={() => setInfoTab(null)}
        title={`Guías del Día ${day.dayNumber}`}
        subtitle="Puntos clave, tiendas y datos útiles"
        icon={Sparkles}
      >
        <div className="space-y-4">
          {(day.extraCards || []).map((card, idx) => {
            const CardIcon = iconForEmoji(card.icon);
            return (
              <article key={idx} className="rounded-2xl bg-[var(--bg-surface-elevated)] overflow-hidden">
                <h3 className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] font-heading font-bold text-[15px] text-[var(--text-primary)]">
                  <span className="spa-tile-sm bg-[var(--accent-primary-soft)] text-[var(--accent-primary-text)] flex-shrink-0">
                    <CardIcon className="w-3.5 h-3.5" />
                  </span>
                  {card.title}
                </h3>
                <ul className="px-4 py-3 space-y-2.5">
                  {card.items.map((it, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      <ChevronRight className="w-2.5 h-2.5 mt-1.5 flex-shrink-0 text-[var(--accent-primary-text)]" />
                      <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(it) }} />
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </BottomSheet>

    </section>
  );
}
