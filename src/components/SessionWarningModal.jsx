import React from 'react';
import { Clock, LogOut, Check } from '../utils/icons';
import { useAuth } from '../context/AuthContext';

function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Last-two-minutes warning before the session expires.
 *
 * Deliberately not a BottomSheet and deliberately not dismissible: there is
 * no backdrop click, no close button and no Escape handler, because the two
 * ways out of this dialog are the two real choices — stay or leave. Letting
 * it be dismissed would leave the countdown running invisibly and log the
 * user out mid-sentence with no explanation.
 */
export default function SessionWarningModal() {
  const { isSessionExpiring, sessionMsLeft, extendSession, logout } = useAuth();

  if (!isSessionExpiring) return null;

  return (
    <div
      className="fixed inset-0 z-[97] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in-scale"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
    >
      <div className="relative w-full max-w-sm spa-card p-6 sm:p-8 space-y-6 text-center">

        <div className="space-y-4">
          <span
            className="spa-tile-lg mx-auto"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-amber) 16%, transparent)',
              color: 'var(--accent-amber-text)'
            }}
          >
            <Clock className="w-6 h-6" />
          </span>

          <div>
            <h2 id="session-warning-title" className="font-heading font-black text-xl text-[var(--text-primary)] leading-tight">
              ¿Sigues ahí?
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-2">
              Tu sesión está por cerrarse por inactividad. Si no haces nada, tendrás que volver a
              iniciar sesión con Google.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--bg-surface-elevated)] py-5">
            <span className="font-display text-5xl text-[var(--text-primary)] tabular-nums block">
              {formatCountdown(sessionMsLeft)}
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] mt-2 block">
              para cerrar sesión
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={extendSession} className="spa-btn spa-btn-primary w-full min-h-[3.25rem] text-[15px]">
            <Check className="w-4 h-4" />
            Seguir aquí
          </button>
          <button
            onClick={logout}
            className="spa-btn w-full min-h-[3rem] bg-transparent text-[var(--text-muted)] hover:text-[var(--accent-rose-text)]"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión ahora
          </button>
        </div>

      </div>
    </div>
  );
}
