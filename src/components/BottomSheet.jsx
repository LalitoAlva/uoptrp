import React, { useEffect, useRef } from 'react';
import { X } from '../utils/icons';

/**
 * The app's one overlay pattern: a bottom sheet on phones, a centered dialog
 * from `md` up (handled entirely by the `.spa-sheet` CSS). Everything that
 * used to be stacked inline on the mobile screens — per-stop actions, tips,
 * day guides, filters — lives in one of these instead, which is what keeps
 * the timeline readable on a 375px viewport.
 *
 * Props:
 *  - title / subtitle / icon / accent: header content
 *  - footer: sticky action area pinned above the safe-area inset
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  accent = 'var(--accent-primary-text)',
  accentBg = 'var(--accent-primary-soft)',
  children,
  footer,
  labelledBy
}) {
  const panelRef = useRef(null);

  // Lock the page behind the sheet and wire up Escape.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Move focus into the sheet so keyboard and screen-reader users land here.
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={title}>
      <div className="spa-sheet-backdrop" onClick={onClose} />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="spa-sheet focus:outline-none"
        aria-labelledby={labelledBy}
      >
        <div className="spa-sheet-handle" aria-hidden="true" />

        {(title || Icon) && (
          <div className="flex items-start gap-3.5 px-5 pt-3 pb-4 md:pt-6 border-b border-[var(--border-subtle)]">
            {Icon && (
              <span className="spa-tile" style={{ backgroundColor: accentBg, color: accent }}>
                <Icon className="w-5 h-5" />
              </span>
            )}
            <div className="flex-1 min-w-0 pt-0.5">
              <h2 className="font-heading font-black text-lg sm:text-xl text-[var(--text-primary)] leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[13px] text-[var(--text-muted)] mt-1 leading-snug">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="spa-tile-sm flex-shrink-0 bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors spa-pressable"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="spa-sheet-body px-5 py-5">
          {children}
        </div>

        {footer && (
          <div className="px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:pb-5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-b-[var(--radius-sheet)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
