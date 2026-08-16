import React, { useState } from 'react';
import { Calculator, Users, Minus, Plus } from '../utils/icons';
import BottomSheet from './BottomSheet';

const TIP_PRESETS = [15, 18, 20, 25];

const money = (n) => `$${n.toFixed(2)}`;

/**
 * Tip and bill split.
 *
 * The two things you actually need at a US table: how much to add, and what
 * each person owes. Both are shown broken out rather than as one total,
 * because when you're splitting in cash the useful number is "cada quien
 * pone X", and the tip has to be visible separately to check the receipt.
 *
 * The percentage applies to the pre-tax subtotal you type in. In NYC the
 * bar-napkin rule is "double the tax" (tax is 8.875%), which lands at ~17.75%
 * — that's why 18 and 20 are the presets people actually use.
 */
export default function TipCalculator({ isOpen, onClose }) {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState(20);
  const [people, setPeople] = useState(2);

  const billNum = Math.max(0, parseFloat(bill) || 0);
  const tipTotal = billNum * (tipPct / 100);
  const grandTotal = billNum + tipTotal;
  const perPerson = grandTotal / Math.max(1, people);
  const tipPerPerson = tipTotal / Math.max(1, people);
  const billPerPerson = billNum / Math.max(1, people);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Calculadora de propina"
      subtitle="Cuánto dejar y cuánto pone cada quien"
      icon={Calculator}
      accent="var(--accent-emerald-text)"
      accentBg="color-mix(in srgb, var(--accent-emerald) 16%, transparent)"
      footer={
        <button onClick={onClose} className="spa-btn spa-btn-primary w-full min-h-[3.25rem]">
          Listo
        </button>
      }
    >
      <div className="space-y-7">

        <div className="space-y-2.5">
          <label htmlFor="tip-bill" className="spa-eyebrow">Cuenta antes de propina (USD)</label>
          <input
            id="tip-bill"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="0.00"
            className="spa-input min-h-[3.75rem] font-display text-2xl"
          />
        </div>

        <div className="space-y-2.5">
          <span className="spa-eyebrow">Propina</span>
          <div className="grid grid-cols-4 gap-2">
            {TIP_PRESETS.map(pct => (
              <button
                key={pct}
                onClick={() => setTipPct(pct)}
                aria-pressed={tipPct === pct}
                className={`min-h-[3.25rem] rounded-2xl font-heading font-black text-[15px] transition-colors spa-pressable ${
                  tipPct === pct
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={tipPct}
            onChange={(e) => setTipPct(Number(e.target.value))}
            aria-label="Porcentaje de propina"
            className="w-full accent-[var(--accent-primary)]"
          />
          <p className="text-[12px] text-[var(--text-muted)] text-center">
            {tipPct}% · en Nueva York lo normal en restaurante es 18–20%
          </p>
        </div>

        <div className="space-y-2.5">
          <span className="spa-eyebrow">
            <Users className="w-3 h-3" />
            ¿Entre cuántos se divide?
          </span>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPeople(p => Math.max(1, p - 1))}
              disabled={people <= 1}
              className="spa-tile bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] disabled:opacity-30 spa-pressable"
              aria-label="Una persona menos"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-display text-4xl text-[var(--text-primary)] tabular-nums w-16 text-center">
              {people}
            </span>
            <button
              onClick={() => setPeople(p => Math.min(20, p + 1))}
              disabled={people >= 20}
              className="spa-tile bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] disabled:opacity-30 spa-pressable"
              aria-label="Una persona más"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl bg-[var(--bg-surface-elevated)] overflow-hidden">
          <div className="p-5 text-center border-b border-[var(--border-subtle)]">
            <span className="spa-eyebrow">
              {people > 1 ? 'Cada quien paga' : 'Total a pagar'}
            </span>
            <span className="block font-display text-5xl text-[var(--text-primary)] mt-2">
              {money(people > 1 ? perPerson : grandTotal)}
            </span>
            {people > 1 && (
              <span className="block text-[13px] text-[var(--text-muted)] mt-2">
                Total de la mesa: <strong className="text-[var(--text-secondary)]">{money(grandTotal)}</strong>
              </span>
            )}
          </div>

          <dl className="divide-y divide-[var(--border-subtle)]">
            {[
              { label: 'Cuenta', value: money(billNum) },
              { label: `Propina (${tipPct}%)`, value: money(tipTotal), accent: true },
              ...(people > 1 ? [
                { label: 'Cuenta por persona', value: money(billPerPerson) },
                { label: 'Propina por persona', value: money(tipPerPerson), accent: true }
              ] : [])
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-[13px] text-[var(--text-secondary)]">{row.label}</dt>
                <dd
                  className="font-mono font-bold text-[15px]"
                  style={{ color: row.accent ? 'var(--accent-emerald-text)' : 'var(--text-primary)' }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
          El porcentaje se calcula sobre la cuenta que escribiste. Si el recibo ya trae impuesto
          incluido, la propina se saca sobre el subtotal <em>antes</em> de impuestos, no sobre el total.
        </p>

      </div>
    </BottomSheet>
  );
}
