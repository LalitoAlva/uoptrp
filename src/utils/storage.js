import { initialTripData } from '../data/initialData';

const STORAGE_KEY = 'viaje_nyc_usopen_2026_data_v1';

/** Plain object, and not one carrying a tampered prototype. */
function safeObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const { __proto__: _ignored, constructor: _ctor, prototype: _proto, ...rest } = value;
  return rest;
}

/** Arrays only — a scalar here would crash every `.map()` downstream. */
function safeArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

/**
 * Reads the saved trip.
 *
 * Everything in localStorage is untrusted input: it can come from a JSON
 * backup the user restored from another device or was sent by someone else.
 * Each section is therefore shape-checked rather than spread in blindly —
 * both so a malformed backup can't hard-crash the app into the error boundary
 * (a scalar where an array is expected), and so keys like `__proto__` in a
 * hand-crafted file can't ride along into the merged object.
 */
export function normalizeTripData(parsed) {
  if (!parsed || typeof parsed !== 'object') return initialTripData;

  return {
      metadata: { ...initialTripData.metadata, ...safeObject(parsed.metadata) },
      urgentTasks: safeArray(parsed.urgentTasks, initialTripData.urgentTasks),
      goCityPass: {
        ...initialTripData.goCityPass,
        ...safeObject(parsed.goCityPass),
        attractions: safeArray(parsed.goCityPass?.attractions, initialTripData.goCityPass.attractions)
      },
      sportsTravelerPackage: {
        ...initialTripData.sportsTravelerPackage,
        ...safeObject(parsed.sportsTravelerPackage),
        sessions: safeArray(parsed.sportsTravelerPackage?.sessions, initialTripData.sportsTravelerPackage.sessions)
      },
      days: safeArray(parsed.days, initialTripData.days),
      recommendations: safeArray(parsed.recommendations, initialTripData.recommendations),
      strandBooksList: safeArray(parsed.strandBooksList, initialTripData.strandBooksList),
    honeyDeuceTracker: { ...initialTripData.honeyDeuceTracker, ...safeObject(parsed.honeyDeuceTracker) },
    budgetExpenses: safeArray(parsed.budgetExpenses, initialTripData.budgetExpenses)
  };
}

export function loadTripData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialTripData;
    return normalizeTripData(JSON.parse(saved));
  } catch (err) {
    console.error('Error al cargar datos de localStorage:', err);
    return initialTripData;
  }
}

export function saveTripData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error al guardar datos en localStorage:', err);
  }
}

export function exportTripDataToJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  link.download = `ViajeNYC_USOpen2026_Backup_${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function resetTripDataToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  return initialTripData;
}
