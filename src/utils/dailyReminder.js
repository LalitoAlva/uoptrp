// Daily reminder to call home. Client-side only (no push server), so this is
// best-effort: it fires while the app/tab is open (checked every minute) and
// backstops with a persistent on-screen banner in case the exact minute is
// missed — but it can't wake a fully closed app, that would need a backend
// push subscription.
//
// The message, the hour and whether it runs at all are all user-editable from
// Menú → Recordatorio de llamada.
const DISMISSED_KEY = 'nyc_app_mom_call_dismissed_date';
const SETTINGS_KEY = 'nyc_app_call_reminder_settings_v1';

export const DEFAULT_REMINDER = {
  enabled: true,
  hour: 20,                    // 8:00 PM CDMX
  message: 'Llamar a casa'
};

/** Titles/messages are rendered as plain text, but keep them bounded anyway. */
const MAX_MESSAGE_LENGTH = 120;

function todayCdmxDateString() {
  // en-CA formats as YYYY-MM-DD — a stable, comparable date key per day in CDMX time.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(new Date());
}

function cdmxHour() {
  return parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', hour: 'numeric', hour12: false }).format(new Date()),
    10
  );
}

/**
 * Reads the saved settings, coercing every field. Anything stored in
 * localStorage is untrusted input (another script on the origin, a synced
 * profile, a hand-edited value), so an out-of-range hour or a non-string
 * message falls back to the default instead of reaching the UI.
 */
export function getReminderSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_REMINDER };
    const parsed = JSON.parse(raw);

    const hour = Number(parsed?.hour);
    const message = typeof parsed?.message === 'string' ? parsed.message.trim() : '';

    return {
      enabled: parsed?.enabled !== false,
      hour: Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : DEFAULT_REMINDER.hour,
      message: message ? message.slice(0, MAX_MESSAGE_LENGTH) : DEFAULT_REMINDER.message
    };
  } catch {
    return { ...DEFAULT_REMINDER };
  }
}

export function saveReminderSettings(settings) {
  const hour = Number(settings?.hour);
  const message = typeof settings?.message === 'string' ? settings.message.trim() : '';

  const safe = {
    enabled: settings?.enabled !== false,
    hour: Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : DEFAULT_REMINDER.hour,
    message: (message || DEFAULT_REMINDER.message).slice(0, MAX_MESSAGE_LENGTH)
  };

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(safe));
  } catch {
    // localStorage unavailable (private mode, quota) — settings just won't persist.
  }
  return safe;
}

/** "20:00" for the settings UI. */
export function formatReminderHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function getTodayKey() {
  return todayCdmxDateString();
}

export function isReminderDueToday(settings = getReminderSettings()) {
  if (!settings.enabled) return false;
  try {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    return cdmxHour() >= settings.hour && dismissed !== todayCdmxDateString();
  } catch {
    return false;
  }
}

export function dismissReminderForToday() {
  try {
    localStorage.setItem(DISMISSED_KEY, todayCdmxDateString());
  } catch {
    // localStorage unavailable (private mode, quota) — reminder just won't persist across reloads today.
  }
}

/** Clears today's dismissal so a changed setting can fire again the same day. */
export function clearDismissal() {
  try {
    localStorage.removeItem(DISMISSED_KEY);
  } catch {
    // Nothing to do — worst case the reminder stays dismissed until tomorrow.
  }
}
