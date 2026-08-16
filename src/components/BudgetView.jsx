import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Calculator, 
  ArrowRightLeft,
  Sparkles,
  PieChart
} from '../utils/icons';
import confetti from 'canvas-confetti';

export default function BudgetView({ expenses, onAddExpense, onDeleteExpense }) {
  const [concept, setConcept] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [payer, setPayer] = useState('Lalo');
  const [category, setCategory] = useState('Comida & Bares');
  const [exchangeRate, setExchangeRate] = useState(19.80); // USD to MXN

  // Currency Converter Quick tool
  const [converterUSD, setConverterUSD] = useState('25');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!concept.trim() || !amountUSD || isNaN(amountUSD)) return;

    onAddExpense({
      id: `exp-${Date.now()}`,
      concept: concept.trim(),
      amountUSD: parseFloat(amountUSD),
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
      payer,
      category
    });

    setConcept('');
    setAmountUSD('');
    confetti({ particleCount: 15, spread: 35, origin: { y: 0.8 } });
  };

  const totalUSD = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amountUSD) || 0), 0);
  const totalMXN = totalUSD * exchangeRate;
  const laloTotal = expenses.filter(e => e.payer === 'Lalo').reduce((acc, curr) => acc + (parseFloat(curr.amountUSD) || 0), 0);
  const fefeTotal = expenses.filter(e => e.payer === 'Fefe').reduce((acc, curr) => acc + (parseFloat(curr.amountUSD) || 0), 0);

  // Cash Target Breakdown
  const cashOnlySpots = [
    { place: 'Joe\'s Pizza (Greenwich & Times Sq)', approx: '$20 USD', desc: 'Rebanadas clásicas al paso' },
    { place: 'Corner Bistro (West Village)', approx: '$35 USD', desc: 'Hamburguesas clásicas tardías' },
    { place: 'Chinatown Flushing (Golden Mall)', approx: '$30 USD', desc: 'Dumplings y noodles al vapor' },
    { place: 'Bodegas (B.E.C. & Café)', approx: '$25 USD', desc: 'Desayunos neoyorquinos rápidos' },
    { place: 'Propinas en efectivo (Katz\'s, maleteros)', approx: '$30 USD', desc: 'Propinas rápidas en mano' },
    { place: 'Feria Vintage Brooklyn Flea', approx: '$25 USD', desc: 'Souvenirs y tokens antiguos' },
  ];

  return (
    <div className="w-full space-y-4">
      
      {/* Header Banner */}
      <div className="spa-banner p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Control de Gastos & Presupuesto
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl text-[var(--text-primary)] tracking-tight">
            Presupuesto de Viaje & Calculadora de Efectivo
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Registro de gastos compartidos entre Lalo y Fefe, conversor USD/MXN y guía de efectivo.
          </p>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="spa-card p-4">
          <span className="text-xs text-[var(--text-muted)] font-medium">Gasto Total Registrado</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-black text-[var(--text-primary)]">
              ${totalUSD.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">USD</span>
          </div>
          <span className="text-xs text-[var(--accent-primary-text)] font-mono font-medium">
            ≈ ${(totalMXN).toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
          </span>
        </div>

        <div className="spa-card p-4">
          <span className="text-xs text-[var(--text-muted)] font-medium">Pagado por Lalo</span>
          <div className="mt-1">
            <span className="text-2xl font-heading font-black text-[var(--text-primary)]">
              ${laloTotal.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] ml-1">USD</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            {expenses.length > 0 ? Math.round((laloTotal / (totalUSD || 1)) * 100) : 0}% del total
          </span>
        </div>

        <div className="spa-card p-4">
          <span className="text-xs text-[var(--text-muted)] font-medium">Pagado por Fefe</span>
          <div className="mt-1">
            <span className="text-2xl font-heading font-black text-[var(--text-primary)]">
              ${fefeTotal.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] ml-1">USD</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            {expenses.length > 0 ? Math.round((fefeTotal / (totalUSD || 1)) * 100) : 0}% del total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: Add Expense Form & Log */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Add Expense Form */}
          <form onSubmit={handleAdd} className="spa-card p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] block">
              + Registrar Nuevo Gasto
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Concepto (ej. Cena Keens)..."
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="col-span-1 sm:col-span-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                required
              />

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="USD..."
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  className="w-full pl-6 pr-3 py-1.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                />
              </div>

              <select
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
              >
                <option value="Lalo">Pagó: Lalo</option>
                <option value="Fefe">Pagó: Fefe</option>
                <option value="Ambos 50/50">50 / 50</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-xs text-[var(--text-secondary)] focus:outline-none"
              >
                <option value="Comida & Bares">🍕 Comida & Bares</option>
                <option value="US Open">🎾 US Open</option>
                <option value="Transporte & Metro">🚇 Transporte & Metro</option>
                <option value="Compras & Souvenirs">🛍️ Compras & Souvenirs</option>
                <option value="Cultura & Entradas">🏛️ Entradas & Tours</option>
              </select>

              <button
                type="submit"
                className="px-4 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-xs rounded-lg active:scale-95 transition-all shadow-sm"
              >
                Guardar Gasto
              </button>
            </div>
          </form>

          {/* Expenses List */}
          <div className="spa-card p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] block mb-2">
              Historial de Gastos ({expenses.length})
            </span>

            {expenses.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-6">
                No hay gastos registrados aún. Agrega el primero arriba.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)] text-xs">
                {expenses.map((exp) => (
                  <div key={exp.id} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">{exp.concept}</div>
                      <span className="text-[11px] text-[var(--text-muted)]">{exp.date} · Pagó: {exp.payer} · {exp.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
                        ${parseFloat(exp.amountUSD).toFixed(2)} USD
                      </span>
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Converter & Cash Strategy */}
        <div className="space-y-4 text-xs">
          
          {/* Quick Currency Converter */}
          <div className="spa-card p-4 space-y-3">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[var(--accent-primary-text)]" />
              Conversor Rápido USD ↔ MXN
            </span>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={converterUSD}
                  onChange={(e) => setConverterUSD(e.target.value)}
                  className="flex-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 font-mono font-bold text-[var(--text-primary)] text-sm focus:outline-none"
                />
                <span className="font-bold text-[var(--text-muted)]">USD</span>
                <span className="text-[var(--text-muted)]">=</span>
                <span className="font-mono font-black text-[var(--accent-primary-text)] text-sm">
                  ${((parseFloat(converterUSD) || 0) * exchangeRate).toFixed(0)} MXN
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                <span>Tipo de cambio:</span>
                <span className="font-mono font-bold text-[var(--text-secondary)]">1 USD = ${exchangeRate} MXN</span>
              </div>
            </div>
          </div>

          {/* Cash Only Spots Checklist */}
          <div className="spa-card p-4 space-y-2.5">
            <span className="font-bold text-sm text-amber-500 flex items-center gap-1.5">
              <Banknote className="w-4 h-4" />
              Lugares "Solo Efectivo" en el Viaje
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              En estos lugares NO aceptan tarjeta. Lleva billetes de $5, $10 y $20 (~$165 USD total):
            </p>

            <div className="space-y-1.5 pt-1">
              {cashOnlySpots.map((spot, i) => (
                <div key={i} className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">{spot.place}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{spot.desc}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-500">{spot.approx}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
