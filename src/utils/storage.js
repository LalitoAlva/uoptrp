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

/** Editable flags a visitor can flip on a shipped item, without touching its content. */
const EDITABLE_ITEM_KEYS = ['completed', 'status', 'visited', 'acquired'];

/**
 * Merges a list the app ships (fresh content: times, text, prices) with the
 * copy saved in localStorage (the visitor's own progress on it).
 *
 * A previous version stored these lists verbatim, so once someone opened the
 * app once, every future edit to the trip content (a corrected flight time, a
 * newly added restaurant) was invisible to them forever — their browser kept
 * replaying the list from their first visit. This instead always starts from
 * the shipped list (so updates always show) and only carries over the few
 * fields the visitor actually controls, matched by `id`. Items the visitor
 * added themselves (an `id` not in the shipped list) ride along unchanged.
 */
function mergeById(freshList, savedList) {
  if (!Array.isArray(savedList) || savedList.length === 0) return freshList;

  const freshIds = new Set(freshList.map((item) => item?.id));
  const savedById = new Map(
    savedList.filter((item) => item && typeof item === 'object' && item.id != null).map((item) => [item.id, item])
  );

  const refreshed = freshList.map((item) => {
    const saved = savedById.get(item.id);
    if (!saved) return item;
    const overlay = {};
    for (const key of EDITABLE_ITEM_KEYS) {
      if (key in saved) overlay[key] = saved[key];
    }
    return { ...item, ...overlay };
  });

  const custom = savedList.filter((item) => item && typeof item === 'object' && item.id != null && !freshIds.has(item.id));
  return [...custom, ...refreshed];
}

/** Same idea as `mergeById`, one level deeper: each day's own `timeline`. */
function mergeDays(freshDays, savedDays) {
  if (!Array.isArray(savedDays)) return freshDays;
  const savedByDayNumber = new Map(savedDays.filter((d) => d && typeof d === 'object').map((d) => [d.dayNumber, d]));

  return freshDays.map((day) => {
    const saved = savedByDayNumber.get(day.dayNumber);
    const timeline = mergeById(day.timeline, saved?.timeline);
    // Custom stops are appended by `mergeById`, out of chronological order;
    // put the day back in time order the way adding a stop in the app does.
    timeline.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    return { ...day, timeline };
  });
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
    // Nothing in the app ever edits metadata or the sports package — they're
    // pure shipped content, so always use this build's copy rather than
    // whatever got frozen into localStorage on an earlier visit.
    metadata: initialTripData.metadata,
    sportsTravelerPackage: initialTripData.sportsTravelerPackage,

    urgentTasks: mergeById(initialTripData.urgentTasks, safeArray(parsed.urgentTasks, [])),
    goCityPass: {
      ...initialTripData.goCityPass,
      attractions: mergeById(initialTripData.goCityPass.attractions, safeArray(parsed.goCityPass?.attractions, []))
    },
    days: mergeDays(initialTripData.days, safeArray(parsed.days, [])),
    recommendations: mergeById(initialTripData.recommendations, safeArray(parsed.recommendations, [])),
    strandBooksList: mergeById(initialTripData.strandBooksList, safeArray(parsed.strandBooksList, [])),
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
