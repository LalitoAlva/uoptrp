import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  MapPin,
  Calendar,
  Tag,
  DollarSign,
  Save,
  Sparkles,
  Lock,
  Lightbulb,
  CheckCircle2,
  CircleXmark
} from '../utils/icons';

const STATUS_OPTIONS = [
  { id: 'fijo', label: 'Inamovible', icon: Lock },
  { id: 'opcional', label: 'Opcional', icon: Lightbulb },
  { id: 'hecho', label: 'Hecho', icon: CheckCircle2 },
  { id: 'no_hecho', label: 'No hecho', icon: CircleXmark },
  { id: 'pendiente', label: 'Por hacer', icon: Clock }
];

export default function ActivityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  defaultDay = 1 
}) {
  const [formData, setFormData] = useState({
    dayNumber: defaultDay,
    time: '12:00',
    title: '',
    sub: '',
    category: 'food',
    status: 'pendiente',
    address: '',
    mapsUrl: '',
    paymentMethod: 'both',
    completed: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        dayNumber: initialData.dayNumber || defaultDay,
        time: initialData.time || '12:00',
        title: initialData.title || '',
        sub: initialData.sub || '',
        category: initialData.category || 'food',
        status: initialData.status || (initialData.completed ? 'hecho' : 'pendiente'),
        address: initialData.address || '',
        mapsUrl: initialData.mapsUrl || '',
        paymentMethod: initialData.paymentMethod || 'both',
        completed: initialData.status === 'hecho' || !!initialData.completed
      });
    } else {
      setFormData({
        dayNumber: defaultDay,
        time: '12:00',
        title: '',
        sub: '',
        category: 'food',
        status: 'pendiente',
        address: '',
        mapsUrl: '',
        paymentMethod: 'both',
        completed: false
      });
    }
  }, [initialData, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    let mapsUrl = formData.mapsUrl;
    if (!mapsUrl && (formData.address || formData.title)) {
      mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(formData.address || formData.title + ' NYC')}`;
    }

    onSave({
      ...formData,
      id: formData.id || `act-${Date.now()}`,
      completed: formData.status === 'hecho',
      mapsUrl
    });
    onClose();
  };

  const categories = [
    { id: 'tennis', label: '🎾 Tenis US Open' },
    { id: 'food', label: '🍕 Comida & Delis' },
    { id: 'beer', label: '🍺 Bares & Cervezas' },
    { id: 'music', label: '🎷 Jazz & Música' },
    { id: 'sights', label: '🗽 Paseos & Vistas' },
    { id: 'books', label: '📚 Libros & Tech' },
    { id: 'logistics', label: '✈️ Vuelo & Logística' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in-scale">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
          <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
            {initialData ? 'Editar Parada / Actividad' : 'Nueva Parada en el Itinerario'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          {/* Day & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Día del Viaje
              </label>
              <select
                value={formData.dayNumber}
                onChange={(e) => setFormData({ ...formData, dayNumber: parseInt(e.target.value) })}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent-primary)]"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>
                    Día {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Hora (24h)
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="14:30"
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                required
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Nombre de la Parada / Lugar
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej. 🍺 Other Half Brewing Taproom"
              className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              required
            />
          </div>

          {/* Status Selection */}
          <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5">
            <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Estado de la Parada
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {STATUS_OPTIONS.map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: st.id })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    formData.status === st.id
                      ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <st.icon className="w-3.5 h-3.5" />
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Método de Pago
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
              >
                <option value="both">Tarjeta y Efectivo</option>
                <option value="cash_only">💵 Solo Efectivo</option>
                <option value="card_only">💳 Solo Tarjeta</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Notas, Platillos recomendados & Tips
            </label>
            <textarea
              value={formData.sub}
              onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
              rows={2}
              placeholder="Consejos, qué pedir, reservación..."
              className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="7 Carmine St, Greenwich Village"
              className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
            >
              Guardar Parada
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
