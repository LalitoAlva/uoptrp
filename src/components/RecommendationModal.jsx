import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Plus,
  Save,
  MapPin,
  Tag,
  Compass,
  CheckCircle2
} from '../utils/icons';
import { parseSmartText } from '../utils/parsers';

export default function RecommendationModal({
  isOpen,
  onClose,
  onSaveRecommendation,
  onSaveBatchRecommendations
}) {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'smart_paste'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    subcategory: 'Restaurante / Deli',
    zone: 'Manhattan',
    address: '',
    mapsUrl: '',
    price: '$$',
    paymentMethod: 'both',
    mustOrder: '',
    tips: '',
    daySuggested: ''
  });

  // Smart Paste State
  const [pasteText, setPasteText] = useState('');
  const [previewParsed, setPreviewParsed] = useState([]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let mapsUrl = formData.mapsUrl;
    if (!mapsUrl) {
      mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(formData.address || formData.name + ' NYC')}`;
    }

    onSaveRecommendation({
      ...formData,
      id: `rec-${Date.now()}`,
      daySuggested: formData.daySuggested ? parseInt(formData.daySuggested) : null,
      mapsUrl,
      visited: false
    });

    onClose();
  };

  const handlePasteChange = (text) => {
    setPasteText(text);
    const parsed = parseSmartText(text);
    setPreviewParsed(parsed);
  };

  const handleApplyBatch = () => {
    if (previewParsed.length === 0) return;
    onSaveBatchRecommendations(previewParsed);
    setPasteText('');
    setPreviewParsed([]);
    onClose();
  };

  const inputClass = "w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]";
  const labelClass = "block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in-scale">
      <div className="relative w-full max-w-2xl spa-card overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                Agregar Nueva Recomendación
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Formulario individual o pegado libre inteligente (WhatsApp / Notas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-6 pt-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary-text)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Formulario Detallado</span>
          </button>

          <button
            onClick={() => setActiveTab('smart_paste')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'smart_paste'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pegado Libre / Smart Paste</span>
          </button>
        </div>

        {/* TAB 1: FORM */}
        {activeTab === 'form' && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">

            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre del Lugar</label>
                <input
                  type="text"
                  placeholder="Ej: Lucali Pizza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Tag className="w-3.5 h-3.5 text-cyan-500" />
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClass}
                >
                  <option value="food">Comida & Delis</option>
                  <option value="beer">Cervezas & Bares</option>
                  <option value="music">Jazz & Música</option>
                  <option value="sights">Paseos & Miradores</option>
                  <option value="shopping">Tech & Tiendas</option>
                  <option value="books">Libros Strand</option>
                </select>
              </div>
            </div>

            {/* Zone & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Compass className="w-3.5 h-3.5 text-indigo-500" />
                  Barrio / Zona
                </label>
                <input
                  type="text"
                  placeholder="Ej: Brooklyn (Carroll Gardens), West Village, etc."
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Subcategoría / Tipo</label>
                <input
                  type="text"
                  placeholder="Ej: Pizza a la leña, Speakeasy, IPAs"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Price & Payment & Suggested Day */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Precio Estimado</label>
                <select
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={inputClass}
                >
                  <option value="$">$ (Económico / Slice / Street)</option>
                  <option value="$$">$$ (Casual / Craft beer)</option>
                  <option value="$$$">$$$ (Restaurante / Club de jazz)</option>
                  <option value="$$$$">$$$$ (Gala / Keens Steakhouse)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Método de Pago</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={inputClass}
                >
                  <option value="both">Tarjeta y Efectivo</option>
                  <option value="cash_only">Solo Efectivo</option>
                  <option value="card_only">Solo Tarjeta</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Día Sugerido</label>
                <select
                  value={formData.daySuggested}
                  onChange={(e) => setFormData({ ...formData, daySuggested: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Cualquiera / Libre</option>
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <option key={d} value={d}>Día {d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Must Order */}
            <div>
              <label className={labelClass}>Platillo / Bebida Imperdible</label>
              <input
                type="text"
                placeholder="Ej: Calzone de 4 quesos, Banana pudding, Penicillin cocktail"
                value={formData.mustOrder}
                onChange={(e) => setFormData({ ...formData, mustOrder: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Tips & Notes */}
            <div>
              <label className={labelClass}>Consejos, Secretos o Instrucciones para entrar</label>
              <textarea
                rows={2}
                placeholder="Ej: Llegar a formarse a las 4:00pm para mesa, tocar puerta trasera, propina al cortador..."
                value={formData.tips}
                onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Address */}
            <div>
              <label className={`${labelClass} flex items-center gap-1`}>
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                Dirección
              </label>
              <input
                type="text"
                placeholder="Ej: 575 Henry St, Brooklyn, NY"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-extrabold text-sm flex items-center gap-1.5 shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Recomendación</span>
              </button>
            </div>

          </form>
        )}

        {/* TAB 2: SMART PASTE */}
        {activeTab === 'smart_paste' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/25 p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Smart Paste — Pega notas de WhatsApp, blogs o Instagram</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Pega varias líneas con recomendaciones. El sistema extraerá automáticamente el nombre, categoría (comida, cerveza, jazz, paseos) y consejos:
              </p>
              <p className="font-mono text-[11px] bg-[var(--bg-app)] p-2 rounded-lg text-[var(--text-muted)]">
                Lucali · Pizza · Brooklyn · Llegar a formarse a las 4pm. Solo efectivo.<br/>
                Attaboy · Bares · Lower East Side · Cócteles speakeasy sin menú.<br/>
                Smalls Live · Jazz · West Village · Bajar al sótano para el set de medianoche.
              </p>
            </div>

            <div>
              <label className={labelClass}>Pega tu texto aquí:</label>
              <textarea
                rows={6}
                value={pasteText}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder="Pega aquí tu lista de lugares..."
                className={`${inputClass} font-mono rounded-2xl`}
              />
            </div>

            {/* Preview of Parsed Items */}
            {previewParsed.length > 0 && (
              <div className="space-y-2">
                <span className={labelClass}>Lugares detectados ({previewParsed.length}):</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {previewParsed.map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-[var(--text-primary)]">{p.name}</span>
                        <span className="text-[var(--text-muted)] ml-2">({p.zone} · {p.category})</span>
                        <p className="text-[var(--text-muted)] text-[11px] truncate max-w-sm">{p.tips}</p>
                      </div>
                      <span className="text-emerald-500 font-bold text-xs flex items-center gap-1 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Detectado
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={previewParsed.length === 0}
                onClick={handleApplyBatch}
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 text-white font-extrabold text-sm flex items-center gap-1.5 shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Agregar {previewParsed.length} Recomendaciones</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
