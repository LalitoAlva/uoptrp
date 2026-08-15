import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Lock,
  ShieldCheck,
  UserCheck,
  Sparkles,
  LogOut,
  Crown,
  Edit3,
  Eye
} from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function LoginModal({ isOpen, onClose }) {
  const { currentUser, loginWithGoogle, switchUser, users, logout } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (email, name) => {
    loginWithGoogle(email, name);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    loginWithGoogle(customEmail.trim(), customName.trim());
    setCustomEmail('');
    setCustomName('');
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in-scale">
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-md shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white p-1.5 flex items-center justify-center shadow-sm border border-slate-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                Acceso con Google
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Selecciona tu perfil de viajero o ingresa tu cuenta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Status */}
        <div className="p-4 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full border border-[var(--border-medium)] flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="font-bold text-sm text-[var(--text-primary)] block truncate">{currentUser?.name}</span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono truncate block">{currentUser?.email}</span>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded flex-shrink-0 ${
              currentUser?.role === 'admin'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : currentUser?.role === 'editor'
                ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)] border border-[var(--accent-primary)]/20'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
            }`}>
              <span className="inline-flex items-center gap-1">
                {currentUser?.role === 'admin' ? <Crown className="w-3 h-3" /> : currentUser?.role === 'editor' ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {currentUser?.role === 'admin' ? 'Admin' : currentUser?.role === 'editor' ? 'Editor' : 'Lector'}
              </span>
            </span>
          </div>

          {currentUser?.id !== 'guest' && (
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded bg-[var(--bg-surface)] hover:bg-rose-500/10 border border-[var(--border-subtle)] hover:border-rose-500/30 text-[var(--text-secondary)] hover:text-rose-500 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión (pasar a Modo Lector)</span>
            </button>
          )}
        </div>

        {/* Quick Profiles Selection */}
        <div className="space-y-2.5 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Acceso Rápido por Perfil:
          </span>

          <button
            onClick={() => handleQuickLogin('lalo@travelnyc.com', 'Lalo')}
            className="w-full p-3.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center justify-between transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0"><Crown className="w-4 h-4" /></span>
              <div className="text-left">
                <span className="font-bold text-sm text-[var(--text-primary)] block">Lalo (Administrador)</span>
                <span className="text-[11px] text-[var(--text-muted)]">lalo@travelnyc.com · Permisos totales & CMS</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickLogin('fefe@travelnyc.com', 'Fefe')}
            className="w-full p-3.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center justify-between transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)] flex items-center justify-center flex-shrink-0"><Edit3 className="w-4 h-4" /></span>
              <div className="text-left">
                <span className="font-bold text-sm text-[var(--text-primary)] block">Fefe (Editor)</span>
                <span className="text-[11px] text-[var(--text-muted)]">fefe@travelnyc.com · Editar paradas & gastos</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickLogin('invitado@travelnyc.com', 'Invitado')}
            className="w-full p-3.5 rounded-md bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center justify-between transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] flex items-center justify-center flex-shrink-0"><Eye className="w-4 h-4" /></span>
              <div className="text-left">
                <span className="font-bold text-sm text-[var(--text-primary)] block">Invitado (Solo Lectura)</span>
                <span className="text-[11px] text-[var(--text-muted)]">invitado@travelnyc.com · Consulta de itinerario</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Custom Google Account Login */}
        <div className="pt-3 border-t border-[var(--border-subtle)] text-xs">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full py-2.5 rounded-md border border-dashed border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition-colors"
            >
              + Iniciar con otra cuenta de Google (Gmail)
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-2.5">
              <input
                type="text"
                placeholder="Tu Nombre..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tucorreo@gmail.com..."
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="flex-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[var(--accent-primary)] text-white font-bold text-xs"
                >
                  Entrar
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
