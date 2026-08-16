import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Navigation,
  ShieldAlert,
  ExternalLink,
  Car,
  Volume,
  Stop
} from '../utils/icons';
import { speak, stopSpeaking, isSpeechSupported, warmUpVoices } from '../utils/speech';
import { useAuth } from '../context/AuthContext';

export default function EmergencyHotelCard({ isOpen, onClose, tripData }) {
  const { currentUser } = useAuth();
  const [copiedHotel, setCopiedHotel] = useState(false);
  const [copiedChris, setCopiedChris] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cardLang, setCardLang] = useState('en');

  // Never leave a voice talking into an empty room after the card closes.
  // Opening the card also warms the voice list, so the very first tap on
  // "Reproducir" already gets the good voice instead of the default.
  useEffect(() => {
    if (isOpen) {
      warmUpVoices();
    } else {
      stopSpeaking();
      setIsSpeaking(false);
    }
    return () => stopSpeaking();
  }, [isOpen]);

  if (!isOpen) return null;

  const travellerName = currentUser?.name || 'un viajero';

  /**
   * The card in both languages.
   *
   * English is the default because the audience is a New York driver, but the
   * Spanish version matters more often than you'd expect: a large share of
   * NYC taxi and rideshare drivers are Spanish speakers, and being able to
   * flip is the difference between being understood and being driven around.
   *
   * `spoken` is written the way it should be *heard* — "fifteen thirty-five"
   * rather than "1535", "forty-fifth" rather than "45th" — because speech
   * engines read digits and ordinals badly.
   */
  const CARD = {
    en: {
      label: 'Show to Taxi / Uber Driver',
      intro: `Hi, I'm ${travellerName}. I'm a tourist. Please take me to:`,
      venue: 'New York Marriott Marquis',
      detail: '1535 Broadway (between 45th & 46th St), Times Square',
      thanks: 'Thank you very much!',
      spoken:
        `Hello. My name is ${travellerName}. I am a tourist. `
        + 'Please take me to the New York Marriott Marquis hotel, '
        + 'fifteen thirty-five Broadway, between forty-fifth and forty-sixth street, '
        + 'in Times Square. Thank you very much.',
      speakLabel: 'Reproducir en inglés',
      lang: 'en-US'
    },
    es: {
      label: 'Muéstrale esto al chofer',
      intro: `Hola, soy ${travellerName}. Soy turista. Por favor lléveme a:`,
      venue: 'Hotel New York Marriott Marquis',
      detail: '1535 Broadway (entre las calles 45 y 46), Times Square',
      thanks: '¡Muchas gracias!',
      spoken:
        `Hola. Me llamo ${travellerName}. Soy turista. `
        + 'Por favor lléveme al hotel New York Marriott Marquis, '
        + 'en el mil quinientos treinta y cinco de Broadway, '
        + 'entre las calles cuarenta y cinco y cuarenta y seis, en Times Square. Muchas gracias.',
      speakLabel: 'Reproducir en español',
      lang: 'es-MX'
    }
  };

  const card = CARD[cardLang];
  const hotelAddressCopy = `${card.intro} ${card.venue}, ${card.detail}. ${card.thanks}`;

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    const started = speak(card.spoken, {
      lang: card.lang,
      onEnd: () => setIsSpeaking(false)
    });
    if (started) setIsSpeaking(true);
  };

  const handleCopyHotel = () => {
    navigator.clipboard.writeText(hotelAddressCopy);
    setCopiedHotel(true);
    setTimeout(() => setCopiedHotel(false), 2500);
  };

  const handleCopyChris = () => {
    navigator.clipboard.writeText("chris@sportstraveler.net · 773-881-0076 ext.105");
    setCopiedChris(true);
    setTimeout(() => setCopiedChris(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in-scale">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Car className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                Ficha Rápida: Taxi, Hotel & Contactos
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Muestra esta pantalla al taxista o conductor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Driver Card */}
          <div className="rounded-xl bg-[var(--bg-surface-elevated)] border-2 border-amber-500/40 p-4 space-y-2.5">
            {/* Language switch. English by default (New York driver), but a
                large share of NYC drivers are Spanish speakers, so flipping
                is often the difference between being understood or not. */}
            <div className="flex items-center justify-between gap-2">
              <div
                role="group"
                aria-label="Idioma de la tarjeta"
                className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--bg-surface)]"
              >
                {[
                  { id: 'en', label: 'English' },
                  { id: 'es', label: 'Español' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { stopSpeaking(); setIsSpeaking(false); setCardLang(opt.id); }}
                    aria-pressed={cardLang === opt.id}
                    className={`px-3 h-8 rounded-full text-[11px] font-bold transition-colors ${
                      cardLang === opt.id
                        ? 'bg-amber-500 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyHotel}
                className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 bg-[var(--bg-surface)] px-2.5 h-8 rounded-full"
              >
                {copiedHotel ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHotel ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <span className="block text-[10px] font-black uppercase tracking-wider text-amber-500">
              {card.label}
            </span>

            <div className="bg-[var(--bg-surface)] rounded-xl p-4 space-y-1.5">
              <p className="text-[13px] font-bold text-[var(--text-secondary)] leading-snug">
                {card.intro}
              </p>
              <p className="text-lg font-heading font-black text-[var(--text-primary)] leading-tight">
                {card.venue}
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-snug">
                {card.detail}
              </p>
              <p className="text-[13px] font-bold text-[var(--text-muted)] pt-1">
                {card.thanks}
              </p>
            </div>

            {/* Play it out loud: easier than handing over the phone in
                traffic, and it gets the address said in the driver's
                language instead of read aloud with a Spanish accent. */}
            {isSpeechSupported() && (
              <button
                onClick={handleSpeak}
                aria-pressed={isSpeaking}
                className={`spa-btn w-full min-h-[3.25rem] text-[15px] ${
                  isSpeaking
                    ? 'bg-[color-mix(in_srgb,var(--accent-rose)_16%,transparent)] text-[var(--accent-rose-text)]'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {isSpeaking
                  ? <><Stop className="w-4 h-4" /> Detener audio</>
                  : <><Volume className="w-4 h-4" /> {card.speakLabel}</>}
              </button>
            )}

            <div className="flex items-center justify-between pt-1">
              <a
                href="https://maps.google.com/?q=New+York+Marriott+Marquis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary-text)] font-bold hover:underline inline-flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navegar en Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-[var(--text-muted)] font-mono">+1 212-398-1900</span>
            </div>
          </div>

          {/* Contact Sports Traveler */}
          <div className="rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--text-primary)]">
                Coordinador Sports Traveler (Traslados & Pases)
              </span>
              <button
                onClick={handleCopyChris}
                className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-lg border border-[var(--border-subtle)]"
              >
                {copiedChris ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="space-y-1 text-[var(--text-secondary)]">
              <p>• <strong>Chris Wetzel:</strong> <a href="mailto:chris@sportstraveler.net" className="text-[var(--accent-primary-text)] font-mono">chris@sportstraveler.net</a></p>
              <p>• <strong>Teléfono:</strong> <a href="tel:7738810076" className="text-emerald-500 font-mono">773-881-0076 ext. 105</a></p>
            </div>
          </div>

          {/* Flights */}
          <div className="rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-3.5 space-y-2">
            <span className="font-bold text-xs text-[var(--text-primary)] block">
              Vuelos Directos United Airlines
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <span className="font-bold text-emerald-500 block">Ida · Vie 4 Sep</span>
                <span className="font-bold text-[var(--text-primary)]">MEX 07:10 → EWR 14:08</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <span className="font-bold text-rose-500 block">Regreso · Jue 10 Sep</span>
                <span className="font-bold text-[var(--text-primary)]">EWR 17:25 → MEX 20:45</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] flex items-start gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-rose-500" />
            <span><strong>Emergencias EE. UU.:</strong> 911 · Consulado México en NY: +1 212-217-6400</span>
          </div>

        </div>

        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-bold text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
