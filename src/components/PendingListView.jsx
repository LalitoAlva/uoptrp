import React from 'react';
import { Check, Plus, Trash2, AlertCircle, CheckCircle2, ListCheck } from '../utils/icons';
import confetti from 'canvas-confetti';

/**
 * The Pendientes screen. Same data as the manager modal, but laid out as a
 * proper screen: progress up top, open items first, completed collapsed to
 * the bottom so the list shortens as the trip gets closer.
 */
export default function PendingListView({ tasks, onToggleTask, onDeleteTask, onOpenManager }) {
  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);
  const progress = tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;

  const handleToggle = (task) => {
    onToggleTask(task.id);
    if (!task.completed) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.75 } });
    }
  };

  const TaskRow = ({ task }) => (
    <li>
      <div className={`spa-row items-start py-4 ${task.completed ? 'opacity-60' : ''}`}>
        <button
          onClick={() => handleToggle(task)}
          aria-pressed={task.completed}
          aria-label={task.completed ? `Marcar "${task.text}" como pendiente` : `Marcar "${task.text}" como listo`}
          className={`spa-tile-sm flex-shrink-0 transition-colors spa-pressable ${
            task.completed
              ? 'bg-[var(--accent-emerald)] text-white'
              : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] text-transparent hover:border-[var(--accent-emerald)]'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleToggle(task)}
          className="flex-1 min-w-0 text-left"
        >
          <span className="flex flex-wrap items-center gap-2">
            <span className={`font-heading font-bold text-[15px] leading-snug ${
              task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
            }`}>
              {task.text}
            </span>
            {task.priority === 'urgent' && !task.completed && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--accent-rose)_16%,transparent)] text-[var(--accent-rose-text)]">
                <AlertCircle className="w-2.5 h-2.5" />
                Urgente
              </span>
            )}
          </span>
          {task.details && (
            <span className="block text-[13px] text-[var(--text-muted)] leading-snug mt-1.5">
              {task.details}
            </span>
          )}
        </button>

        <button
          onClick={() => onDeleteTask(task.id)}
          className="spa-tile-sm flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-rose-text)] hover:bg-[color-mix(in_srgb,var(--accent-rose)_12%,transparent)] transition-colors"
          aria-label={`Eliminar "${task.text}"`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  );

  return (
    <div className="w-full space-y-7">

      {/* Header */}
      <div className="spa-banner p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-4">
          <span className="spa-tile-lg flex-shrink-0 bg-[color-mix(in_srgb,var(--accent-rose)_16%,transparent)] text-[var(--accent-rose-text)]">
            <ListCheck className="w-6 h-6" />
          </span>
          <div className="flex-1 min-w-0">
            <span className="spa-eyebrow">Antes de abordar</span>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-1">
              Pendientes &amp; reservas
            </h1>
          </div>
        </div>

        <p className="text-[13px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
          Todo lo que hay que reservar, comprar o activar <strong>antes</strong> de subir al avión:
          restaurantes, boletos de tren, eSIM y seguro. Marca cada uno cuando quede cerrado.
        </p>

        <p className="text-[13px] font-bold text-[var(--text-muted)]">
          {pending.length} por cerrar · {done.length} listos
        </p>

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-[var(--bg-sunken)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent-emerald)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="block text-right text-xs font-mono font-bold text-[var(--text-muted)]">{progress}%</span>
        </div>

        <button onClick={onOpenManager} className="spa-btn spa-btn-primary w-full sm:w-auto min-h-[3rem]">
          <Plus className="w-4 h-4" />
          Agregar pendiente
        </button>
      </div>

      {/* Open items */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <span className="spa-eyebrow">Por cerrar · {pending.length}</span>
          <ul className="space-y-2">
            {pending.map(task => <TaskRow key={task.id} task={task} />)}
          </ul>
        </section>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <section className="space-y-3">
          <span className="spa-eyebrow">
            <CheckCircle2 className="w-3 h-3 text-[var(--accent-emerald-text)]" />
            Listos · {done.length}
          </span>
          <ul className="space-y-2">
            {done.map(task => <TaskRow key={task.id} task={task} />)}
          </ul>
        </section>
      )}

      {tasks.length === 0 && (
        <div className="spa-card p-12 text-center space-y-3">
          <span className="spa-tile-lg mx-auto bg-[color-mix(in_srgb,var(--accent-emerald)_16%,transparent)] text-[var(--accent-emerald-text)]">
            <CheckCircle2 className="w-6 h-6" />
          </span>
          <p className="font-heading font-bold text-lg text-[var(--text-primary)]">Todo en orden</p>
          <p className="text-sm text-[var(--text-muted)]">No hay pendientes registrados.</p>
        </div>
      )}

    </div>
  );
}
