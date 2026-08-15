import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  AlertTriangle,
  Info
} from '../utils/icons';
import {
  exportTripDataToJSON,
  resetTripDataToDefault
} from '../utils/storage';
import {
  exportRecommendationsToCSV,
  parseCSVRecommendations,
  sampleCSVTemplate,
  sampleJSONRecommendationsTemplate
} from '../utils/parsers';
import { confirmAction, notify } from '../utils/alerts';

export default function ImportExportModal({
  isOpen,
  onClose,
  tripData,
  onRestoreTripData,
  onAddBatchRecommendations
}) {
  const [statusMsg, setStatusMsg] = useState(null);

  const fileInputRefJSON = useRef(null);
  const fileInputRefCSV = useRef(null);

  if (!isOpen) return null;

  // Handle JSON Full Backup Restore
  const handleJSONFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.days && parsed.metadata) {
          onRestoreTripData(parsed);
          setStatusMsg({ type: 'success', text: '¡Respaldo completo del viaje restaurado con éxito!' });
        } else {
          setStatusMsg({ type: 'error', text: 'El archivo JSON no tiene la estructura esperada del viaje.' });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Error al leer el archivo JSON: formato inválido.' });
      }
    };
    reader.readAsText(file);
  };

  // Handle CSV Recommendations Import
  const handleCSVFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedRecs = parseCSVRecommendations(event.target.result);
        if (parsedRecs.length > 0) {
          onAddBatchRecommendations(parsedRecs);
          setStatusMsg({ type: 'success', text: `¡Se importaron ${parsedRecs.length} recomendaciones desde el archivo CSV!` });
        } else {
          setStatusMsg({ type: 'error', text: 'No se pudieron extraer filas válidas del archivo CSV.' });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Error al procesar el archivo CSV.' });
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCSV = () => {
    const blob = new Blob([sampleCSVTemplate], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_recomendaciones_nyc.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleJSON = () => {
    const blob = new Blob([JSON.stringify(sampleJSONRecommendationsTemplate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_recomendaciones_nyc.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    const confirmed = await confirmAction({
      title: 'Restablecer todo el viaje',
      text: 'Se perderán todas las modificaciones no respaldadas y volverás al plan original de inicio. Esta acción no se puede deshacer.',
      confirmText: 'Restablecer',
      danger: true
    });
    if (!confirmed) return;
    const initial = resetTripDataToDefault();
    onRestoreTripData(initial);
    setStatusMsg({ type: 'success', text: 'Datos restablecidos a la versión oficial de inicio.' });
    notify('Viaje restablecido al plan original', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in-scale">
      <div className="relative w-full max-w-3xl spa-card overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                Respaldo, Importación y Exportación
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Sincroniza tus datos entre dispositivos (Móvil & PC) o sube listas en bloque
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

        {/* Notification message */}
        {statusMsg && (
          <div className={`mx-6 mt-4 p-3 rounded-2xl text-xs font-bold flex items-center justify-between flex-shrink-0 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}>
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="text-xs underline ml-2">Cerrar</button>
          </div>
        )}

        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">

          {/* Section 1: Full Trip Backup */}
          <div className="rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-[var(--accent-primary-text)]" />
              <div>
                <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">
                  1. Respaldo Total del Viaje (Formato JSON)
                </h4>
                <p className="text-[var(--text-muted)] text-[11px]">
                  Guarda todo: tus 7 días de itinerario, pendientes tachados, sesiones de Arthur Ashe y recomendaciones.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => exportTripDataToJSON(tripData)}
                className="p-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-[var(--accent-primary-text)]" />
                <span>Descargar Copia de Respaldo (.json)</span>
              </button>

              <label className="p-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95">
                <Upload className="w-4 h-4 text-cyan-500" />
                <span>Restaurar Archivo (.json)</span>
                <input
                  type="file"
                  ref={fileInputRefJSON}
                  onChange={handleJSONFileSelect}
                  accept=".json"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section 2: CSV Bulk Recommendations */}
          <div className="rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-500" />
              <div>
                <h4 className="font-heading font-bold text-sm text-[var(--text-primary)]">
                  2. Carga Masiva de Recomendaciones (CSV / Excel)
                </h4>
                <p className="text-[var(--text-muted)] text-[11px]">
                  Edita tus recomendaciones en Excel o Google Sheets y súbelas en segundos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => exportRecommendationsToCSV(tripData.recommendations)}
                className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-cyan-500" />
                <span>Exportar a CSV</span>
              </button>

              <label className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95">
                <Upload className="w-3.5 h-3.5 text-[var(--accent-primary-text)]" />
                <span>Subir CSV</span>
                <input
                  type="file"
                  ref={fileInputRefCSV}
                  onChange={handleCSVFileSelect}
                  accept=".csv"
                  className="hidden"
                />
              </label>

              <button
                onClick={handleDownloadSampleCSV}
                className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Descargar Plantilla CSV</span>
              </button>
            </div>
          </div>

          {/* Section 3: Format Documentation & Guide */}
          <div className="rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] font-bold">
              <Info className="w-4 h-4 text-indigo-500" />
              <span>Estructura de Columnas para el CSV:</span>
            </div>

            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              El archivo CSV debe tener estos encabezados en la primera fila:
            </p>
            <div className="p-3 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--accent-primary-text)] overflow-x-auto">
              nombre,categoria,subcategoria,zona,direccion,precio,metodoPago,imperdibles,tips,diaSugerido,mapsUrl
            </div>
            <p className="text-[var(--text-muted)] text-[11px]">
              Valores válidos para <code className="text-cyan-500">categoria</code>: <code>food</code> (comida), <code>beer</code> (cervezas), <code>music</code> (jazz/rock), <code>sights</code> (paseos), <code>shopping</code> (tiendas), <code>books</code> (libros).
            </p>
          </div>

          {/* Section 4: Reset Button */}
          <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)] flex-wrap gap-3">
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              ¿Quieres volver al itinerario original de inicio?
            </div>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Todo</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold transition-colors"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
}
