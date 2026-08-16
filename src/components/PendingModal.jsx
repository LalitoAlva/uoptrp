import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import {
  ListCheck,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  X
} from '../utils/icons';
import confetti from 'canvas-confetti';

/**
 * The full pendientes manager. Same list as the Pendientes screen, but with
 * the add form — reachable from anywhere via the hero card or that screen's
 * "Agregar pendiente" button.
 */
export default function PendingModal({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) {
  const [newText, setNewText] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = (task) => {
    onToggleTask(task.id);
    if (!task.completed) {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.75 } });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      text: newText.trim(),
      details: newDetails.trim() || 'Sin notas adicionales',
      deadline: newDeadline.trim() || 'Antes del viaje',
      priority: 'urgent',
      completed: false
    });

    setNewText('');
    setNewDetails('');
    setNewDeadline('');
    setShowAddForm(false);
  };

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Pendientes & reservas"
      subtitle={`${pendingCount} por cerrar · ${completedCount} listos`}
      icon={ListCheck}
      accent="var(--accent-rose-text)"
      accentBg="color-mix(in srgb, var(--accent-rose) 16%, transparent)"
      footer={
        !showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="spa-btn spa-btn-primary w-full min-h-[3.25rem]"
          >
            <Plus className="w-4 h-4" />
            Agregar pendiente
          </button>
        ) : null
      }
    >
      <div className="space-y-5">

        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="spa-eyebrow">Nuevo pendiente</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="spa-tile-sm bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Cancelar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="¿Qué hay que cerrar? (ej. Reservar Keens)"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="spa-input"
              required
            />
            <input
              type="text"
              placeholder="Detalles, teléfono o enlace…"
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              className="spa-input"
            />
            <input
              type="text"
              placeholder="Fecha límite (ej. 30 días antes)"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="spa-input"
            />

            <button type="submit" className="spa-btn spa-btn-primary w-full min-h-[3rem]">
              <Check className="w-4 h-4" />
              Guardar pendiente
            </button>
          </form>
        )}

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <div className={`spa-row items-start py-4 ${task.completed ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => handleToggle(task)}
                  aria-pressed={task.completed}
                  aria-label={task.completed ? `Reabrir "${task.text}"` : `Marcar "${task.text}" como listo`}
                  className="spa-tile-sm flex-shrink-0 transition-colors spa-pressable"
                  style={{
                    backgroundColor: task.completed ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
                    color: task.completed ? '#fff' : 'transparent',
                    border: task.completed ? 'none' : '1px solid var(--border-strong)'
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button onClick={() => handleToggle(task)} className="flex-1 min-w-0 text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`font-heading font-bold text-[14px] leading-snug ${
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
                    <span className="block text-[12px] text-[var(--text-muted)] leading-snug mt-1.5">
                      {task.details}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="spa-tile-sm flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-rose-text)] transition-colors"
                  aria-label={`Eliminar "${task.text}"`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </BottomSheet>
  );
}
