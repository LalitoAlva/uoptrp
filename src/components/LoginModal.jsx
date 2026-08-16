import React, { useEffect, useRef } from 'react';
import {
  LogOut,
  Crown,
  Edit3,
  Eye
} from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';
import confetti from 'canvas-confetti';

export default function LoginModal({ isOpen, onClose, mandatory = false }) {
  const { currentUser, loginWithGoogleCredential, logout } = useAuth();
  const buttonRef = useRef(null);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Render Google's real Sign-In button once the GIS script (loaded from
  // index.html) is available. Polls briefly since the script tag is async.
  useEffect(() => {
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
  }, [currentUser, loginWithGoogleCredential, onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in-scale ${mandatory ? 'bg-[var(--bg-app)]' : ''}`}>
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-md shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6">

        {/* Header */}
        <div className="border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white p-1.5 flex items-center justify-center shadow-sm border border-slate-200 flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                {currentUser ? 'Tu Sesión' : 'Inicia Sesión con Google'}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {currentUser
                  ? 'Sesión activa con tu cuenta de Google'
                  : 'Solo correos autorizados por el administrador pueden entrar'}
              </p>
            </div>
          </div>
        </div>

        {/* Current Active User Status */}
        {currentUser && (
          <div className="p-4 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full border border-[var(--border-medium)] flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-sm text-[var(--text-primary)] block truncate">{currentUser.name}</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono truncate block">{currentUser.email}</span>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded flex-shrink-0 ${
                currentUser.role === 'admin'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : currentUser.role === 'editor'
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)] border border-[var(--accent-primary)]/20'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
              }`}>
                <span className="inline-flex items-center gap-1">
                  {currentUser.role === 'admin' ? <Crown className="w-3 h-3" /> : currentUser.role === 'editor' ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'editor' ? 'Editor' : 'Lector'}
                </span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 rounded bg-[var(--bg-surface)] hover:bg-rose-500/10 border border-[var(--border-subtle)] hover:border-rose-500/30 text-[var(--text-secondary)] hover:text-rose-500 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
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
