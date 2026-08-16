import React, { useState } from 'react';
import {
  Trophy,
  Ticket,
  Clock,
  MapPin,
  Check,
  Plus,
  Minus,
  Wine
} from '../utils/icons';
import PageHeader from './PageHeader';
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

  const attractionsDone = tripData.goCityPass.attractions.filter(a => a.completed).length;

  return (
    <div className="w-full space-y-7">

      <PageHeader
        eyebrow="Acceso oficial & entradas"
        title="US Open y pases de ciudad"
        description="Aquí vive toda la logística de tus 4 sesiones en Arthur Ashe, el paquete Sports Traveler, el Go City Explorer Pass y la cuenta de Honey Deuces."
        icon={Trophy}
        stats={[
          { label: 'Sesiones', value: tripData.sportsTravelerPackage.sessions.length, icon: Trophy },
          {
            label: 'Atracciones',
            value: `${attractionsDone}/${tripData.goCityPass.attractions.length}`,
            icon: Ticket,
            color: 'var(--accent-tennis-text)',
            soft: 'color-mix(in srgb, var(--accent-tennis) 16%, transparent)'
          },
          {
            label: 'Honey Deuce',
            value: `${honeyCount}/${honeyTarget}`,
            icon: Wine,
            color: '#F9A8D4',
            soft: 'rgba(236, 72, 153, 0.16)'
          }
        ]}
      />

      {/* ── Honey Deuce tracker — the one thing you tap during a match, so it
           leads on mobile and moves aside on desktop. ─────────────────── */}
      <section className="spa-card p-6 space-y-5">
        <div className="flex items-center gap-3.5">
          <span className="spa-tile" style={{ backgroundColor: 'rgba(236, 72, 153, 0.16)', color: '#F9A8D4' }}>
            <Wine className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-black text-lg text-[var(--text-primary)] leading-tight">
              Honey Deuce Tracker
            </h2>
            <p className="text-[13px] text-[var(--text-muted)] mt-0.5">El cóctel oficial del US Open · $25 USD</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-6 text-center space-y-1">
          <span className="font-display text-6xl text-[var(--text-primary)] block">
            {honeyCount}<span className="text-2xl text-[var(--text-muted)]"> / {honeyTarget}</span>
          </span>
          <p className="text-[13px] text-[var(--text-secondary)] pb-2">Vasos conmemorativos coleccionados</p>

          <div className="flex items-center justify-center gap-2.5">
            <button
              onClick={handleDecrementHoney}
              disabled={honeyCount === 0}
              className="spa-tile bg-[var(--bg-surface)] text-[var(--text-secondary)] disabled:opacity-30 spa-pressable"
              aria-label="Quitar un Honey Deuce"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleDrinkHoneyDeuce} className="spa-btn spa-btn-primary min-h-[3rem] px-6">
              <Plus className="w-4 h-4" />
              +1 Honey Deuce
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4 space-y-1.5">
          <span className="spa-eyebrow">Receta oficial</span>
          <ul className="text-[13px] text-[var(--text-secondary)] space-y-1 pt-1">
            <li>Vodka Grey Goose (1.5 oz)</li>
            <li>Limonada fresca recién exprimida (3.0 oz)</li>
            <li>Licor de frambuesa Chambord (0.5 oz)</li>
            <li>3 esferas de melón verde (las "pelotas de tenis")</li>
          </ul>
        </div>
      </section>

      {/* ── Sessions ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="spa-eyebrow">
            <Trophy className="w-3 h-3 text-[var(--accent-primary-text)]" />
            Arthur Ashe Stadium
          </span>
          <span className="text-[11px] font-mono font-bold text-[var(--text-muted)]">Promenade / Loge</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tripData.sportsTravelerPackage.sessions.map((sess, idx) => (
            <article key={idx} className="spa-card p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="spa-chip h-8 font-mono text-[11px]" style={{ backgroundColor: 'var(--accent-primary-soft)', color: 'var(--accent-primary-text)', borderColor: 'transparent' }}>
                  {sess.session}
                </span>
                <span className="text-[11px] font-bold text-[var(--text-muted)]">{sess.date}</span>
              </div>

              <h3 className="font-heading font-bold text-base text-[var(--text-primary)] leading-snug">
                {sess.name}
              </h3>

              <div className="space-y-1.5 text-[13px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-2 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-primary-text)] flex-shrink-0" />
                  {sess.time}
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{sess.stadium}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Go City ───────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="spa-eyebrow">
            <Ticket className="w-3 h-3 text-[var(--accent-tennis-text)]" />
            Go City Explorer Pass
          </span>
          <span className="text-[11px] font-bold text-[var(--text-muted)]">Pase digital en la app</span>
        </div>

        <div className="space-y-2">
          {tripData.goCityPass.attractions.map((att) => (
            <button
              key={att.id}
              onClick={() => onToggleGoCityAttraction(att.id)}
              aria-pressed={att.completed}
              className={`spa-row py-4 ${att.completed ? 'border-[color-mix(in_srgb,var(--accent-emerald)_40%,transparent)]' : ''}`}
            >
              <span
                className="spa-tile-sm flex-shrink-0"
                style={{
                  backgroundColor: att.completed
                    ? 'var(--accent-emerald)'
                    : 'var(--bg-surface-elevated)',
                  color: att.completed ? '#fff' : 'transparent',
                  border: att.completed ? 'none' : '1px solid var(--border-strong)'
                }}
              >
                <Check className="w-3.5 h-3.5" />
              </span>

              <span className="flex-1 min-w-0">
                <span className={`block font-heading font-bold text-[15px] leading-snug ${
                  att.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'
                }`}>
                  {att.name}
                </span>
                <span className="block text-[13px] text-[var(--text-muted)] mt-0.5 leading-snug">
                  {att.window} · {att.status}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
