import React from 'react';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  WifiOff,
  Apple
} from '../utils/icons';

export default function PWAInstallPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in-scale">
      <div className="relative w-full max-w-lg spa-card overflow-hidden p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                Instalar App en tu Celular (PWA)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Funciona sin internet en el metro de NY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Box */}
        <div className="rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <WifiOff className="w-4 h-4" />
            <span>100% Funcional Offline & Sin Datos</span>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Al instalarla como Web App en tu iPhone o Android, tendrás acceso inmediato a todo tu itinerario, horarios de Arthur Ashe, pases y notas, incluso en los túneles del metro o en el avión sin señal.
          </p>
        </div>

        {/* Instructions Steps */}
        <div className="space-y-4 text-xs">

          {/* iOS Safari */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5" />
              <span>En iPhone / iPad (Safari):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[var(--text-secondary)] pl-1">
              <li>Abre el enlace de la app en <strong>Safari</strong>.</li>
              <li className="flex items-center gap-1.5">
                Toca el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 text-cyan-500 inline" /> en la barra inferior.
              </li>
              <li className="flex items-center gap-1.5">
                Selecciona <strong>"Añadir a pantalla de inicio"</strong> <PlusSquare className="w-3.5 h-3.5 text-[var(--accent-primary-text)] inline" />.
              </li>
              <li>¡Listo! Aparecerá con el icono de la app en tu pantalla de inicio como una app nativa.</li>
            </ol>
          </div>

          {/* Android Chrome */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>En Android (Chrome):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[var(--text-secondary)] pl-1">
              <li>Abre el enlace en <strong>Google Chrome</strong>.</li>
              <li>Toca el menú de 3 puntos (⋮) arriba a la derecha.</li>
              <li>Elige <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-xs transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
