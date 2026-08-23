import React from 'react';
import BottomSheet from './BottomSheet';
import {
  MapPin,
  Navigation,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Banknote,
  ExternalLink,
  iconForEmoji
} from '../utils/icons';
import { sanitizeUrl } from '../utils/sanitize';
import { STATUS_ORDER, STATUS_CONFIG, getCategory, getStatus } from '../utils/activityMeta';

/**
 * Everything about a single stop, on demand. The itinerary rows used to carry
 * the address, the maps link, four reorder/edit/delete buttons and a
 * five-button status switcher inline — roughly 12 targets per stop, which is
 * what made the mobile screen unreadable. Now the row shows the three things
 * you scan for and this sheet holds the twelve things you occasionally do.
 */
export default function ActivityDetailSheet({
  isOpen,
  onClose,
  activity,
  dayNumber,
  dayDate,
  index,
  total,
  onChangeStatus,
  onEdit,
  onDelete,
  onMove
}) {
  if (!activity) return null;

  const status = getStatus(activity);
  const cat = getCategory(activity.category);
  const CatIcon = cat.icon;
  const safeMapsUrl = sanitizeUrl(activity.mapsUrl);

  const canMoveUp = typeof index === 'number' && index > 0;
  const canMoveDown = typeof index === 'number' && typeof total === 'number' && index < total - 1;

  const TravelIcon = activity.travelFromPrev ? iconForEmoji(activity.travelFromPrev.icon) : null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={activity.title}
      subtitle={`${dayDate} · Día ${dayNumber}`}
      icon={CatIcon}
      accent={cat.color}
      accentBg={cat.soft}
      footer={
        safeMapsUrl ? (
          <a
            href={safeMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="spa-btn spa-btn-primary w-full min-h-[3.25rem] text-[15px]"
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar en Google Maps
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        ) : null
      }
    >
      <div className="space-y-6">

        {/* Facts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="spa-chip h-9 font-mono">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-primary-text)]" />
            {activity.time}
          </span>
          <span className="spa-chip h-9" style={{ backgroundColor: cat.soft, color: cat.color, borderColor: 'transparent' }}>
            <CatIcon className="w-3.5 h-3.5" />
            {cat.label}
          </span>
          {activity.paymentMethod === 'cash_only' && (
            <span className="spa-chip h-9" style={{ backgroundColor: STATUS_CONFIG.opcional.soft, color: 'var(--accent-amber-text)', borderColor: 'transparent' }}>
              <Banknote className="w-3.5 h-3.5" />
              Solo efectivo
            </span>
          )}
        </div>

        {activity.sub && (
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {activity.sub}
          </p>
        )}

        {activity.travelFromPrev && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)]">
            <span className="spa-tile-sm flex-shrink-0 bg-[var(--accent-primary-soft)] text-[var(--accent-primary-text)]">
              <TravelIcon className="w-3.5 h-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block spa-eyebrow mb-1">Cómo llegar desde la parada anterior</span>
              <span className="text-sm text-[var(--text-secondary)] leading-snug">{activity.travelFromPrev.text}</span>
            </span>
          </div>
        )}

        {activity.address && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)]">
            <MapPin className="w-4 h-4 text-[var(--accent-primary-text)] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-[var(--text-secondary)] leading-snug">{activity.address}</span>
          </div>
        )}

        {/* Status picker — five generous targets instead of a row of 36px icons */}
        <div className="space-y-3">
          <span className="spa-eyebrow">¿Cómo va esta parada?</span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {STATUS_ORDER.map((key) => {
              const cfg = STATUS_CONFIG[key];
              const Icon = cfg.icon;
              const isActive = status === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChangeStatus(activity.id, key)}
                  aria-pressed={isActive}
                  className="spa-action"
                  style={isActive ? {
                    backgroundColor: cfg.solid,
                    borderColor: cfg.solid,
                    color: cfg.onSolid
                  } : undefined}
                >
                  <Icon className="w-[1.15rem] h-[1.15rem]" />
                  {cfg.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Management actions */}
        <div className="space-y-3 pt-1">
          <span className="spa-eyebrow">Editar</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onEdit(dayNumber, activity); onClose(); }}
              className="spa-btn spa-btn-ghost w-full min-h-[3rem]"
            >
              <Edit3 className="w-4 h-4 text-[var(--accent-primary-text)]" />
              Editar parada
            </button>
            <button
              onClick={() => { onDelete(dayNumber, activity.id); onClose(); }}
              className="spa-btn w-full min-h-[3rem] bg-[color-mix(in_srgb,var(--accent-rose)_14%,transparent)] text-[var(--accent-rose-text)] hover:bg-[color-mix(in_srgb,var(--accent-rose)_22%,transparent)]"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>

          {(canMoveUp || canMoveDown) && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onMove(dayNumber, index, 'up')}
                disabled={!canMoveUp}
                className="spa-btn spa-btn-ghost w-full min-h-[3rem] disabled:opacity-35"
              >
                <ChevronUp className="w-4 h-4" />
                Subir
              </button>
              <button
                onClick={() => onMove(dayNumber, index, 'down')}
                disabled={!canMoveDown}
                className="spa-btn spa-btn-ghost w-full min-h-[3rem] disabled:opacity-35"
              >
                <ChevronDown className="w-4 h-4" />
                Bajar
              </button>
            </div>
          )}
        </div>

      </div>
    </BottomSheet>
  );
}
