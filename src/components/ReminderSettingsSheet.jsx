import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { Phone, Check, Clock } from '../utils/icons';
import { DEFAULT_REMINDER, formatReminderHour } from '../utils/dailyReminder';

/** Hours worth offering — nobody sets a "call home" reminder for 4am. */
const HOUR_OPTIONS = [7, 8, 9, 12, 15, 18, 19, 20, 21, 22];

/**
 * Menú → Recordatorio de llamada. Lets the message, the hour and the on/off
 * switch be edited instead of the text being hard-coded in App.jsx.
 */
export default function ReminderSettingsSheet({ isOpen, onClose, settings, onSave }) {
  const [draft, setDraft] = useState(settings);

  // Re-seed the form each time the sheet opens so a cancelled edit doesn't
  // linger into the next visit.
  useEffect(() => {
    if (isOpen) setDraft(settings);
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Recordatorio de llamada"
      subtitle="Un aviso diario mientras la app esté abierta"
      icon={Phone}
      accent="var(--accent-rose-text)"
      accentBg="color-mix(in srgb, var(--accent-rose) 16%, transparent)"
      footer={
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDraft({ ...DEFAULT_REMINDER })}
            className="spa-btn spa-btn-ghost w-full min-h-[3rem]"
          >
            Restaurar
          </button>
          <button onClick={handleSave} className="spa-btn spa-btn-primary w-full min-h-[3rem]">
            <Check className="w-4 h-4" />
            Guardar
          </button>
        </div>
      }
    >
      <div className="space-y-7">

        <label className="spa-row py-4 cursor-pointer">
          <span className="spa-tile flex-shrink-0" style={{
            backgroundColor: draft.enabled
              ? 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)'
              : 'var(--bg-surface-elevated)',
            color: draft.enabled ? 'var(--accent-emerald-text)' : 'var(--text-muted)'
          }}>
            <Phone className="w-4 h-4" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-heading font-bold text-[15px] text-[var(--text-primary)]">
              Activar recordatorio
            </span>
            <span className="block text-[13px] text-[var(--text-muted)] mt-0.5">
              {draft.enabled ? `Todos los días a las ${formatReminderHour(draft.hour)} de CDMX` : 'Desactivado'}
            </span>
          </span>
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
            className="w-6 h-6 flex-shrink-0 accent-[var(--accent-primary)]"
          />
        </label>

        <div className="space-y-2.5">
          <label htmlFor="reminder-message" className="spa-eyebrow">Mensaje</label>
          <input
            id="reminder-message"
            type="text"
            value={draft.message}
            maxLength={120}
            onChange={(e) => setDraft({ ...draft, message: e.target.value })}
            placeholder={DEFAULT_REMINDER.message}
            className="spa-input min-h-[3.25rem]"
          />
          <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
            Es el texto que verás en el banner y en la notificación. Ejemplos: “Llamar a casa”,
            “Hablarle a la mamita”, “Mandar foto del día”.
          </p>
        </div>

        <div className="space-y-2.5">
          <span className="spa-eyebrow">
            <Clock className="w-3 h-3" />
            Hora (CDMX)
          </span>
          <div className="grid grid-cols-5 gap-2">
            {HOUR_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => setDraft({ ...draft, hour: h })}
                aria-pressed={draft.hour === h}
                className={`min-h-[3rem] rounded-2xl font-mono font-bold text-[13px] transition-colors spa-pressable ${
                  draft.hour === h
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {formatReminderHour(h)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4">
          <span className="spa-eyebrow">Vista previa</span>
          <div className="flex items-center gap-3 mt-3">
            <span className="spa-tile-sm flex-shrink-0" style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-rose) 16%, transparent)',
              color: 'var(--accent-rose-text)'
            }}>
              <Phone className="w-3.5 h-3.5" />
            </span>
            <p className="text-[13px] font-bold text-[var(--text-primary)] leading-snug">
              {draft.message?.trim() || DEFAULT_REMINDER.message}
            </p>
          </div>
        </div>

      </div>
    </BottomSheet>
  );
}
