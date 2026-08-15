import { initialTripData } from '../data/initialData';

const STORAGE_KEY = 'viaje_nyc_usopen_2026_data_v1';

export function loadTripData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialTripData;
    const parsed = JSON.parse(saved);
    // Ensure all critical sections exist in case of future schema expansions.
    // Nested objects are shallow-merged (not blindly overridden) so a backup
    // saved before a field existed (e.g. sportsTravelerPackage.sessions)
    // can't wipe it out and blank-screen the app on read.
    return {
      metadata: { ...initialTripData.metadata, ...(parsed.metadata || {}) },
      urgentTasks: parsed.urgentTasks || initialTripData.urgentTasks,
      goCityPass: { ...initialTripData.goCityPass, ...(parsed.goCityPass || {}) },
      sportsTravelerPackage: { ...initialTripData.sportsTravelerPackage, ...(parsed.sportsTravelerPackage || {}) },
      days: parsed.days || initialTripData.days,
      recommendations: parsed.recommendations || initialTripData.recommendations,
      strandBooksList: parsed.strandBooksList || initialTripData.strandBooksList,
      honeyDeuceTracker: { ...initialTripData.honeyDeuceTracker, ...(parsed.honeyDeuceTracker || {}) },
      budgetExpenses: parsed.budgetExpenses || initialTripData.budgetExpenses
    };
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
