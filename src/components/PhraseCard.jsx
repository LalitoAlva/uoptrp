import React, { useState, useEffect } from 'react';
import { Volume, Stop } from '../utils/icons';
import { speak, stopSpeaking, isSpeechSupported, warmUpVoices } from '../utils/speech';

/**
 * One English phrase you can tap to hear.
 *
 * Always speaks English regardless of the UI language: the point is to hear
 * how the sentence sounds before saying it to a New Yorker, or to hand the
 * phone over and let it say it for you.
 *
 * `es` carries the Spanish meaning and `note` the bit of context that keeps
 * you from using the phrase wrong.
 */
export default function PhraseCard({ en, es, note, tone = 'primary' }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  const tones = {
    primary: { color: 'var(--accent-primary-text)', soft: 'var(--accent-primary-soft)' },
    emerald: { color: 'var(--accent-emerald-text)', soft: 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)' },
    amber: { color: 'var(--accent-amber-text)', soft: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)' },
    rose: { color: 'var(--accent-rose-text)', soft: 'color-mix(in srgb, var(--accent-rose) 16%, transparent)' }
  };
  const t = tones[tone] || tones.primary;

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    warmUpVoices();
    const started = speak(en, { lang: 'en-US', onEnd: () => setIsSpeaking(false) });
    if (started) setIsSpeaking(true);
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4 space-y-2.5">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[var(--text-primary)] leading-snug">
            “{en}”
          </p>
          <p className="text-[13px] text-[var(--text-muted)] leading-snug mt-1">{es}</p>
        </div>

        {isSpeechSupported() && (
          <button
            onClick={handleSpeak}
            aria-pressed={isSpeaking}
            aria-label={isSpeaking ? 'Detener audio' : `Escuchar en inglés: ${en}`}
            className="spa-tile flex-shrink-0 transition-colors spa-pressable"
            style={{
              backgroundColor: isSpeaking ? 'color-mix(in srgb, var(--accent-rose) 16%, transparent)' : t.soft,
              color: isSpeaking ? 'var(--accent-rose-text)' : t.color
            }}
          >
            {isSpeaking ? <Stop className="w-4 h-4" /> : <Volume className="w-4 h-4" />}
          </button>
        )}
      </div>

      {note && (
        <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
          {note}
        </p>
      )}
    </div>
  );
}
