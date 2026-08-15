import React, { useState } from 'react';
import { 
  Trophy, 
  Ticket, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  Plus, 
  Minus, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Wine
} from '../utils/icons';
import confetti from 'canvas-confetti';

export default function USOpenPassView({ 
  tripData, 
  onUpdateHoneyDeuce, 
  onToggleGoCityAttraction 
}) {
  const honeyCount = tripData.honeyDeuceTracker?.currentCount || 0;
  const honeyTarget = tripData.honeyDeuceTracker?.targetTotal || 4;

  const handleDrinkHoneyDeuce = () => {
    onUpdateHoneyDeuce(honeyCount + 1);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 }
    });
  };

  const handleDecrementHoney = () => {
    if (honeyCount > 0) {
      onUpdateHoneyDeuce(honeyCount - 1);
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Header Banner */}
      <div className="spa-card p-6 border border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]">
              <Trophy className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary-text)]">
              Acceso Oficial & Entradas
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl text-[var(--text-primary)] tracking-tight">
            US Open Arthur Ashe & Go City Explorer Pass
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Toda la logística de tus 4 sesiones de tenis, paquete Sports Traveler y atracciones de Nueva York.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: 4 Arthur Ashe Sessions */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="spa-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]"><Trophy className="w-4 h-4" /></span>
                <div>
                  <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                    4 Sesiones en Arthur Ashe Stadium
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">Paquete oficial Sports Traveler</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-[var(--accent-primary)]/15 text-[var(--accent-primary-text)] px-2.5 py-1 rounded">
                Promenade / Loge
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tripData.sportsTravelerPackage.sessions.map((sess, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-[var(--accent-primary-text)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                      {sess.session}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">{sess.date}</span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">
                    {sess.name}
                  </h4>

                  <div className="text-xs text-[var(--text-secondary)] space-y-1">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{sess.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{sess.stadium}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Go City Pass Box */}
          <div className="spa-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500"><Ticket className="w-4 h-4" /></span>
                <div>
                  <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                    Go City Explorer Pass (3 Atracciones)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">Pase digital en la App móvil de Go City</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-cyan-500/10 text-cyan-500 px-2.5 py-1 rounded">
                Activo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {tripData.goCityPass.attractions.map((att) => (
                <div
                  key={att.id}
                  onClick={() => onToggleGoCityAttraction(att.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    att.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)]">{att.name}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      att.completed ? 'bg-emerald-500 text-white font-bold' : 'border border-[var(--border-strong)]'
                    }`}>
                      {att.completed && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                  <span className="text-[11px] text-cyan-500 font-bold block">{att.window}</span>
                  <p className="text-[11px] text-[var(--text-muted)]">{att.status}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Honey Deuce Cocktail Tracker */}
        <div className="space-y-4">
          
          <div className="spa-card p-5 space-y-4 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-surface-elevated)]">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Wine className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                  Honey Deuce Tracker
                </h3>
                <p className="text-xs text-[var(--text-muted)]">El cóctel oficial del US Open ($25 USD)</p>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)] text-center space-y-2">
              <span className="text-4xl font-heading font-black text-[var(--text-primary)] block">
                {honeyCount} <span className="text-lg text-[var(--text-muted)]">/ {honeyTarget}</span>
              </span>
              <p className="text-xs text-[var(--text-secondary)]">
                Vasos conmemorativos coleccionados
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleDecrementHoney}
                  disabled={honeyCount === 0}
                  className="w-9 h-9 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-bold flex items-center justify-center disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDrinkHoneyDeuce}
                  className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+1 Honey Deuce</span>
                </button>
              </div>
            </div>

            {/* Honey Deuce Recipe */}
            <div className="text-xs text-[var(--text-secondary)] space-y-1.5 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="font-bold text-[var(--text-primary)] block text-[11px] uppercase tracking-wider">
                Receta Oficial:
              </span>
              <p>• Vodka Grey Goose (1.5 oz)</p>
              <p>• Limonada fresca recién exprimida (3.0 oz)</p>
              <p>• Licor de frambuesa Chambord (0.5 oz)</p>
              <p>• 3 esferas de melón verde ("pelotas de tenis") 🍈</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
