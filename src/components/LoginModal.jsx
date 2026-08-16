import React, { useEffect, useRef } from 'react';
import {
  LogOut,
  Crown,
  Edit3,
  Eye,
  X
} from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';
import confetti from 'canvas-confetti';

export default function LoginModal({ isOpen, onClose, mandatory = false }) {
  const { currentUser, loginWithGoogleCredential, logout } = useAuth();
  const buttonRef = useRef(null);

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Render Google's real Sign-In button once the GIS script (loaded from
  // index.html) is available. Polls briefly since the script tag is async.
  //
  // NOTE: every hook in this component must run before the `!isOpen` early
  // return below. This effect used to sit *after* it, so opening the modal
  // went from 2 hooks to 3 and React threw "Rendered more hooks than during
  // the previous render", dropping the whole app into the error boundary.
  useEffect(() => {
    if (!isOpen) return;
    if (currentUser) return; // already signed in — nothing to render

    let cancelled = false;
    let attempts = 0;

    const tryInit = () => {
      if (cancelled) return;
      if (!window.google?.accounts?.id) {
        attempts += 1;
        if (attempts < 50) setTimeout(tryInit, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          const user = loginWithGoogleCredential(response.credential);
          if (user) {
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
            onClose();
          }
        }
      });

      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 320
        });
      }
    };

    tryInit();
    return () => { cancelled = true; };
  }, [isOpen, currentUser, loginWithGoogleCredential, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[96] flex items-center justify-center p-4 backdrop-blur-sm animate-in-scale ${mandatory ? 'bg-[var(--bg-app)]' : 'bg-black/70'}`}>
      <div className="relative w-full max-w-md spa-card p-6 sm:p-8 space-y-6">

        {/* Close — the mandatory first-run gate has no way out but signing in */}
        {!mandatory && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 spa-tile-sm bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] spa-pressable"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-3">
            <div className="spa-tile bg-white shadow-sm border border-slate-200 flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div className="min-w-0 pr-8">
              <h3 className="font-heading font-black text-lg text-[var(--text-primary)] leading-tight">
                {currentUser ? 'Tu sesión' : 'Inicia sesión con Google'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-snug">
                {currentUser
                  ? 'Sesión activa con tu cuenta de Google'
                  : 'Solo correos autorizados por el administrador pueden entrar'}
              </p>
            </div>
          </div>
        </div>

        {/* Current Active User Status */}
        {currentUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[var(--bg-surface-elevated)]">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="font-heading font-black text-base text-[var(--text-primary)] block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono truncate block mt-0.5">
                  {currentUser.email}
                </span>
              </div>
              <span
                className="spa-chip h-8 text-[11px] flex-shrink-0"
                style={{
                  backgroundColor: currentUser.role === 'admin'
                    ? 'color-mix(in srgb, var(--accent-amber) 16%, transparent)'
                    : 'var(--accent-primary-soft)',
                  color: currentUser.role === 'admin' ? 'var(--accent-amber-text)' : 'var(--accent-primary-text)',
                  borderColor: 'transparent'
                }}
              >
                {currentUser.role === 'admin' ? <Crown className="w-3 h-3" /> : currentUser.role === 'editor' ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'editor' ? 'Editor' : 'Lector'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="spa-btn w-full min-h-[3.25rem] bg-[color-mix(in_srgb,var(--accent-rose)_14%,transparent)] text-[var(--accent-rose-text)] hover:bg-[color-mix(in_srgb,var(--accent-rose)_22%,transparent)]"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}

        {/* Real Google Sign-In button — Google renders its own UI here */}
        {!currentUser && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div ref={buttonRef} className="min-h-[44px] flex items-center justify-center" />
            <p className="text-[11px] text-[var(--text-muted)] text-center leading-relaxed max-w-xs">
              Si tu correo no está en la lista autorizada, verás un aviso — pídele a un administrador que te agregue desde "Usuarios".
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
