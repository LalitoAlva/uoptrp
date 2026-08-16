/**
 * Text-to-speech via the browser's built-in Web Speech API.
 *
 * Used so the taxi instruction can be *played out loud* to a driver instead
 * of handing over the phone — noisy street, driver who doesn't look away
 * from the road, or simply an accent barrier. No network, no API key, no
 * audio file: the voice is whatever the device already has installed.
 *
 * Support is uneven (Safari/iOS is the fussiest), so every entry point here
 * degrades quietly and `isSpeechSupported()` lets the UI hide the button
 * rather than offering something that silently does nothing.
 */

export function isSpeechSupported() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof window.SpeechSynthesisUtterance === 'function';
}

/**
 * Voices that actually sound like a person, by platform.
 *
 * The default `en-US` voice is frequently one of the old compact formant
 * synths — macOS still ships "Alex" and "Fred", Windows has "David" — which
 * is where the robotic, elderly-sounding read comes from. These are the
 * modern sampled/neural voices, ordered best-first.
 */
const PREFERRED_VOICES = [
  // Chrome / Android — network voices, consistently the most natural.
  'google us english', 'google uk english female', 'google español',
  // Windows neural.
  'microsoft aria', 'microsoft jenny', 'microsoft guy', 'microsoft michelle',
  // macOS / iOS modern sampled voices.
  'samantha', 'ava', 'allison', 'susan', 'zoe', 'evan', 'nicky', 'tom',
  'paulina', 'mónica', 'monica', 'juan'
];

/** Old formant synths — never pick these when anything else exists. */
const AVOID_VOICES = ['alex', 'fred', 'albert', 'bad news', 'bahh', 'bells', 'boing',
  'bubbles', 'cellos', 'deranged', 'hysterical', 'junior', 'kathy', 'pipe organ',
  'princess', 'ralph', 'trinoids', 'whisper', 'zarvox', 'wobble', 'superstar',
  'jester', 'organ', 'eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko',
  'sandy', 'shelley', 'david', 'mark', 'zira'];

/**
 * Picks the most natural-sounding installed voice for a language tag.
 *
 * Scored rather than first-match: exact-locale voices beat same-language
 * ones, explicitly "natural"/"neural"/"premium"/"enhanced" variants win
 * outright, the known-good names above rank next, and the legacy robotic
 * synths are pushed to the bottom so they're only used when they are
 * genuinely the only option.
 *
 * Returns undefined when the list hasn't loaded yet — the utterance then
 * uses the system default, which still speaks.
 */
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return undefined;

  const base = lang.split('-')[0].toLowerCase();

  const candidates = voices.filter(v => v.lang?.replace('_', '-').toLowerCase().startsWith(base));
  if (candidates.length === 0) return undefined;

  const score = (voice) => {
    const name = (voice.name || '').toLowerCase();
    const vLang = (voice.lang || '').replace('_', '-').toLowerCase();
    let points = 0;

    if (vLang === lang.toLowerCase()) points += 40;

    if (/natural|neural|premium|enhanced|siri/.test(name)) points += 60;

    const preferredIndex = PREFERRED_VOICES.findIndex(p => name.includes(p));
    if (preferredIndex !== -1) points += 50 - preferredIndex;

    // Network voices are generally the higher-quality ones.
    if (voice.localService === false) points += 15;

    if (AVOID_VOICES.some(bad => name === bad || name.startsWith(`${bad} `))) points -= 100;

    if (voice.default) points += 5;

    return points;
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}

/**
 * Nudges the browser to load its voice list.
 *
 * `getVoices()` is empty until the engine populates it, and on Chrome that
 * only happens after a `voiceschanged` event. Calling this early means the
 * first tap on "Reproducir" already has the good voice available instead of
 * falling back to the default for one press.
 */
export function warmUpVoices() {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      window.speechSynthesis.getVoices();
    }, { once: true });
  } catch {
    // Nothing to do — we'd just use the default voice.
  }
}

/**
 * Speaks `text`, cancelling anything already in progress.
 *
 * @param {string} text
 * @param {object} [options]
 * @param {string} [options.lang='en-US']  BCP-47 tag. The taxi card uses
 *   en-US on purpose: the address has to come out in the driver's language,
 *   not in Spanish phonetics.
 * @param {number} [options.rate=0.95]  A touch under normal — clear in
 *   traffic without the dragging, robotic cadence that slower rates give.
 * @param {() => void} [options.onEnd]  Fires on completion, error, or cancel,
 *   so callers can always reset their "speaking" state.
 * @returns {boolean} whether speech was actually started.
 */
export function speak(text, { lang = 'en-US', rate = 0.95, onEnd } = {}) {
  if (!isSpeechSupported() || typeof text !== 'string' || !text.trim()) return false;

  try {
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;

    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;

    // `onend` doesn't fire on a cancel in every engine, and `onerror` is the
    // only signal in some, so both are wired to the same callback.
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    onEnd?.();
    return false;
  }
}

export function stopSpeaking() {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Nothing useful to do — the utterance will finish on its own.
  }
}
