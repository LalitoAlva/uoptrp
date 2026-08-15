import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  AlertTriangle,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check
} from '../utils/icons';
import confetti from 'canvas-confetti';

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
  const [newPriority, setNewPriority] = useState('urgent');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (taskId) => {
    onToggleTask(taskId);
    const t = tasks.find(item => item.id === taskId);
    if (t && !t.completed) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 }
      });
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
      priority: newPriority,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in-scale">
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                Checklist de Pendientes & Reservas Clave
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {pendingCount} pendientes por cerrar · {completedCount} listos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task list and Add Form */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Add Form Toggle */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold flex items-center justify-center gap-1.5 hover:bg-[var(--bg-surface-elevated)] transition-all"
            >
              <Plus className="w-4 h-4 text-[var(--accent-primary-text)]" />
              <span>+ Agregar nuevo pendiente o reservación</span>
            </button>
          ) : (
            <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Nuevo Requisito</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancelar
                </button>
              </div>

              <input
                type="text"
                placeholder="Título del pendiente (ej. Reservar Keens Steakhouse)..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Detalles / Enlaces..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Fecha límite (ej. 30 días antes)..."
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--accent-primary)] text-white font-bold rounded-lg text-xs"
                >
                  Guardar Pendiente
                </button>
              </div>
            </form>
          )}

          {/* Task Items */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggle(task.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  task.completed
                    ? 'bg-[var(--bg-surface-elevated)]/50 border-[var(--border-subtle)] opacity-60'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-emerald-500 text-white font-bold text-[10px]' 
                      : 'border border-[var(--border-strong)]'
                  }`}>
                    {task.completed && <Check className="w-2.5 h-2.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-xs text-[var(--text-primary)] ${task.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                        {task.text}
                      </span>
                      {task.priority === 'urgent' && !task.completed && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 inline-flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Urgente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {task.details}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                  className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors flex-shrink-0"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
