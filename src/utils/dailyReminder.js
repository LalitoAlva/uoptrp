// Daily 8pm CDMX reminder to call home. Client-side only (no push server),
// so this is best-effort: it fires while the app/tab is open (checked every
// minute) and backstops with a persistent on-screen banner in case the exact
// minute is missed — but it can't wake a fully closed app, that would need a
// backend push subscription.
const REMINDER_HOUR = 20; // 8:00 PM
const DISMISSED_KEY = 'nyc_app_mom_call_dismissed_date';

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

export function getTodayKey() {
  return todayCdmxDateString();
}

export function isReminderDueToday() {
  try {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    return cdmxHour() >= REMINDER_HOUR && dismissed !== todayCdmxDateString();
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
