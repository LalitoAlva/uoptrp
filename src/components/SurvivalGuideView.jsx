import React, { useState } from 'react';
import {
  Compass,
  Train,
  Subway,
  Trophy,
  Coffee,
  CheckSquare,
  Plus,
  Trash2,
  CreditCard,
  Star,
  Suitcase,
  Utensils,
  Banknote,
  AlertTriangle,
  Lightbulb,
  Check,
  Calculator,
  Coins,
  MapPin,
  Trophy as TrophyIcon
} from '../utils/icons';
import PageHeader from './PageHeader';
import PhraseCard from './PhraseCard';
import TipCalculator from './TipCalculator';
import confetti from 'canvas-confetti';

/** A numbered step in one of the mini-guides. */
function Step({ n, title, children }) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="spa-tile-sm flex-shrink-0 bg-[var(--accent-primary-soft)] text-[var(--accent-primary-text)] font-display text-sm">
        {n}
      </span>
      <div className="flex-1 min-w-0 pt-1">
        <h4 className="font-heading font-bold text-[15px] text-[var(--text-primary)] leading-snug">{title}</h4>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-1">{children}</p>
      </div>
    </li>
  );
}

/** Coloured aside for the one thing per guide you must not get wrong. */
function Callout({ tone = 'amber', icon: Icon = Lightbulb, title, children }) {
  const tones = {
    amber: { color: 'var(--accent-amber-text)', soft: 'color-mix(in srgb, var(--accent-amber) 14%, transparent)' },
    rose: { color: 'var(--accent-rose-text)', soft: 'color-mix(in srgb, var(--accent-rose) 14%, transparent)' },
    emerald: { color: 'var(--accent-emerald-text)', soft: 'color-mix(in srgb, var(--accent-emerald) 14%, transparent)' }
  };
  const t = tones[tone];
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: t.soft }}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.color }} />
      <div className="flex-1 min-w-0">
        <span className="block text-[11px] font-black uppercase tracking-wider" style={{ color: t.color }}>
          {title}
        </span>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-1">{children}</p>
      </div>
    </div>
  );
}

function GuideCard({ icon: Icon, accent, accentBg, title, subtitle, children }) {
  return (
    <section className="spa-card p-5 sm:p-6 space-y-5">
      <div className="flex items-start gap-3.5">
        <span className="spa-tile flex-shrink-0" style={{ backgroundColor: accentBg, color: accent }}>
          <Icon className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-black text-lg text-[var(--text-primary)] leading-tight">{title}</h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-1 leading-snug">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SurvivalGuideView() {
  const [activeTab, setActiveTab] = useState('metro');
  const [isTipCalcOpen, setIsTipCalcOpen] = useState(false);

  const [packingList, setPackingList] = useState([
    { id: 'p1', text: 'Powerbank de 10,000–20,000 mAh (en equipaje de mano)', checked: true, tag: 'Esencial' },
    { id: 'p2', text: 'Tenis más cómodos probados (18,000+ pasos diarios)', checked: true, tag: 'Esencial' },
    { id: 'p3', text: 'Chamarra ligera / sudadera para noche de Arthur Ashe (~15°C)', checked: false, tag: 'Ropa' },
    { id: 'p4', text: 'Lentes de sol + protector solar SPF 50 para sesión diurna', checked: false, tag: 'US Open' },
    { id: 'p5', text: 'Mochila compacta (máx 35 x 30 x 15 cm para el estadio)', checked: false, tag: 'US Open' },
    { id: 'p6', text: 'Efectivo en billetes chicos (~$165 USD por persona)', checked: false, tag: 'Dinero' },
    { id: 'p7', text: 'eSIM Holafly descargada antes de salir de México', checked: false, tag: 'Tech' },
    { id: 'p8', text: 'Apps: US Open, MTA TrainTime, Go City, Google Maps', checked: false, tag: 'Apps' }
  ]);

  const [newItemText, setNewItemText] = useState('');

  const togglePacking = (id) => {
    setPackingList(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.checked;
        if (next) confetti({ particleCount: 15, spread: 35, origin: { y: 0.8 } });
        return { ...item, checked: next };
      }
      return item;
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setPackingList(prev => [...prev, {
      id: `p-${Date.now()}`,
      text: newItemText.trim(),
      checked: false,
      tag: 'Personal'
    }]);
    setNewItemText('');
  };

  const handleDeleteItem = (id) => {
    setPackingList(prev => prev.filter(i => i.id !== id));
  };

  const packedCount = packingList.filter(p => p.checked).length;

  const tabs = [
    { id: 'metro', label: 'Metro', icon: Subway },
    { id: 'tren', label: 'Tren', icon: Train },
    { id: 'direcciones', label: 'Direcciones', icon: MapPin },
    { id: 'usopen', label: 'US Open', icon: Trophy },
    { id: 'slang', label: 'Jerga', icon: Coffee },
    { id: 'packing', label: 'Maleta', icon: CheckSquare, badge: `${packedCount}/${packingList.length}` }
  ];

  return (
    <div className="w-full space-y-7">

      <PageHeader
        eyebrow="Manual de supervivencia"
        title="Guía Pro de Nueva York"
        description="Cómo moverte y cómo pedir sin parecer turista: una miniguía paso a paso del metro, otra del tren a Hudson Valley, la estrategia para Arthur Ashe, la jerga de las bodegas y tu checklist de maleta."
        icon={Compass}
        accent="#C4B5FD"
        accentBg="rgba(139, 92, 246, 0.16)"
      />


      {/* Tipping stays pinned above the tabs: it is the one thing you need
          several times a day, in a country where getting it wrong is a real
          social error, and burying it behind a tab meant never seeing it. */}
      <section className="spa-card p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          <span
            className="spa-tile flex-shrink-0"
            style={{ backgroundColor: 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)', color: 'var(--accent-emerald-text)' }}
          >
            <Coins className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-black text-lg text-[var(--text-primary)] leading-tight">
              Propinas en Estados Unidos
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1 leading-snug">
              No son opcionales: buena parte del sueldo del mesero sale de ahí.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Restaurante', value: '18–20%' },
            { label: 'Bar (por trago)', value: '$1–2' },
            { label: 'Taxi / Uber', value: '15–20%' },
            { label: 'Maletero', value: '$2 por maleta' },
            { label: 'Housekeeping', value: '$3–5 por noche' },
            { label: 'Barista', value: 'Opcional' },
            { label: 'Comida rápida', value: 'No se espera' },
            { label: 'Delivery', value: '15% o $5' }
          ].map(item => (
            <div key={item.label} className="rounded-2xl bg-[var(--bg-surface-elevated)] p-3.5">
              <span className="block font-heading font-black text-[15px] text-[var(--text-primary)]">
                {item.value}
              </span>
              <span className="block text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <Callout tone="amber" icon={Lightbulb} title="El truco local">
          El impuesto en Nueva York es 8.875%. Los locales <strong>duplican el impuesto</strong> del recibo
          y esa es la propina (~17.75%). Ojo: en grupos de 6 o más muchos restaurantes ya incluyen la
          propina como <em>“gratuity”</em> — revísalo antes de dejar otra.
        </Callout>

        <button onClick={() => setIsTipCalcOpen(true)} className="spa-btn spa-btn-primary w-full min-h-[3.25rem]">
          <Calculator className="w-4 h-4" />
          Calcular propina y dividir cuenta
        </button>
      </section>

      {/* Tab rail */}
      <div className="spa-rail hide-scrollbar">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`spa-chip ${isActive ? 'spa-chip-accent' : ''}`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge && <span className="font-mono text-[10px] opacity-70">{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* ── MINIGUÍA: METRO ──────────────────────────────────────────── */}
      {activeTab === 'metro' && (
        <div className="space-y-4">
          <GuideCard
            icon={Subway}
            accent="var(--accent-primary-text)"
            accentBg="var(--accent-primary-soft)"
            title="Miniguía del metro de NYC"
            subtitle="De cero a moverte solo · 24 horas, todos los días"
          >
            <ol className="space-y-5">
              <Step n="1" title="Paga con OMNY, no con MetroCard">
                Acerca tu iPhone, Apple Watch o tarjeta contactless al lector redondo del torniquete.
                Son <strong>$2.90 USD</strong> por viaje. Usa siempre el <em>mismo</em> método de pago: así el
                sistema te reconoce y te aplica el tope semanal.
              </Step>
              <Step n="2" title="Después de 12 viajes, la semana es gratis">
                El <em>fare cap</em> corre de lunes a domingo: a partir del viaje 13 ya no te cobra nada
                hasta que empieza la semana siguiente.
              </Step>
              <Step n="3" title="Lee la línea, no el color">
                Lo que importa es la <strong>letra o número</strong> (A, 1, 7…). El color solo indica por
                qué avenida corre en Manhattan, y varias líneas distintas comparten color.
              </Step>
              <Step n="4" title="Círculo = local · rombo = express">
                El local para en todas las estaciones; el express se salta la mayoría. Revisa el letrero
                del andén y el frente del tren antes de subirte.
              </Step>
              <Step n="5" title="Elige bien el andén: Uptown o Downtown">
                <strong>Uptown &amp; The Bronx</strong> es hacia el norte; <strong>Downtown &amp; Brooklyn</strong> hacia
                el sur. Muchas estaciones tienen los dos andenes separados y sin paso entre ellos.
              </Step>
              <Step n="6" title="Mira el letrero de la entrada de la calle">
                Si dice “Downtown only” o “Uptown only”, esa escalera solo lleva a ese sentido. Bajar por
                la equivocada significa salir y volver a pagar.
              </Step>
              <Step n="7" title="Transbordo gratis a autobús">
                Con el mismo método de pago tienes <strong>2 horas</strong> de transbordo gratuito entre metro y bus.
              </Step>
              <Step n="8" title="Para ir al US Open: línea 7">
                Desde <strong>Times Sq–42 St</strong> toma el 7 hasta <strong>Mets–Willets Point</strong>. El de rombo
                (express) ahorra unos 15 minutos. Al terminar la sesión de noche salen trenes cada pocos minutos.
              </Step>
            </ol>

            <Callout tone="amber" icon={Lightbulb} title="Tip de local">
              Google Maps y Citymapper traen el metro en vivo, incluyendo los desvíos de fin de semana
              (muy frecuentes). Revisa la ruta justo antes de bajar al andén, no la noche anterior.
            </Callout>

            <Callout tone="rose" icon={AlertTriangle} title="De noche">
              Espera en la zona marcada <em>“Off-Peak Waiting Area”</em>, donde se detiene el vagón del
              conductor, y súbete a un vagón con gente en lugar de a uno vacío.
            </Callout>
          </GuideCard>

          <div className="spa-card p-5 space-y-3">
            <span className="spa-eyebrow">
              <CreditCard className="w-3 h-3 text-[var(--accent-primary-text)]" />
              Costos de un vistazo
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Viaje sencillo', value: '$2.90' },
                { label: 'Tope semanal', value: '$34' },
                { label: 'Transbordo bus', value: 'Gratis' },
                { label: 'Menores de 5', value: 'Gratis' }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-[var(--bg-surface-elevated)] p-3.5 text-center">
                  <span className="block font-display text-xl text-[var(--text-primary)]">{item.value}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)] mt-1.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MINIGUÍA: TREN ───────────────────────────────────────────── */}
      {activeTab === 'tren' && (
        <div className="space-y-4">
          <GuideCard
            icon={Train}
            accent="var(--accent-amber-text)"
            accentBg="color-mix(in srgb, var(--accent-amber) 16%, transparent)"
            title="Miniguía del tren a Hudson Valley"
            subtitle="Metro-North · Hudson Line · Grand Central → Cold Spring"
          >
            <ol className="space-y-5">
              <Step n="1" title="Compra en la app MTA TrainTime">
                Es el boleto oficial y no necesitas imprimir nada. Selecciona
                <strong> Grand Central → Cold Spring</strong>, Hudson Line. También muestra en vivo el andén y
                qué tan lleno viene cada vagón.
              </Step>
              <Step n="2" title="Compra antes de subir">
                Si compras a bordo con el conductor te cobran un recargo. Ten el boleto listo desde la estación.
              </Step>
              <Step n="3" title="Peak vs off-peak">
                Entre semana en hora pico el boleto es más caro. Saliendo después de las <strong>09:30</strong>
                (o en fin de semana) pagas tarifa off-peak.
              </Step>
              <Step n="4" title="Activa el boleto solo al abordar">
                El boleto empieza a correr en cuanto lo activas. Hazlo ya en el andén o cuando el tren
                arranque, nunca al comprarlo.
              </Step>
              <Step n="5" title="En Grand Central, mira el tablero">
                El <em>track</em> (andén) se anuncia unos <strong>10 minutos antes</strong> de la salida. Ubica antes
                el pasillo correcto y camina hacia el frente del tren para bajar más rápido en Cold Spring.
              </Step>
              <Step n="6" title="Siéntate del lado izquierdo">
                Yendo al norte, la ventana izquierda te da el río Hudson y los acantilados de Palisades
                prácticamente todo el trayecto (~1 h 20 min).
              </Step>
              <Step n="7" title="El conductor pasa a revisar">
                Muestra la pantalla con el boleto ya activado. No hay torniquetes: el control es a bordo.
              </Step>
              <Step n="8" title="Llegando a Cold Spring">
                La estación es un andén al aire libre, sin taquilla. El centro del pueblo y el río quedan
                a unos <strong>3 minutos a pie</strong>.
              </Step>
            </ol>

            <Callout tone="rose" icon={AlertTriangle} title="Lo único que no puedes olvidar">
              Revisa el <strong>último tren de regreso</strong> antes de salir de la estación. Fuera de hora pico
              pasan aproximadamente cada hora, y perder el último significa taxi carísimo de vuelta a Manhattan.
            </Callout>

            <Callout tone="emerald" icon={Lightbulb} title="Otras líneas útiles">
              <strong>LIRR</strong> sale de Grand Central y Penn Station hacia Long Island.
              <strong> AirTrain + LIRR/subway</strong> conecta con JFK, y el <strong>NJ Transit</strong> desde Penn
              Station te lleva a Newark si el vuelo sale de EWR.
            </Callout>
          </GuideCard>
        </div>
      )}

      {/* ── US OPEN ──────────────────────────────────────────────────── */}
      {activeTab === 'usopen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GuideCard
            icon={Star}
            accent="var(--accent-amber-text)"
            accentBg="color-mix(in srgb, var(--accent-amber) 16%, transparent)"
            title="La ventana dorada"
            subtitle="Domingo 6 · entre la sesión de día y la de noche (14:30–17:30)"
          >
            <ol className="space-y-5">
              <Step n="1" title="Compra el Honey Deuce sin fila">
                Justo cuando termina la sesión 15 las barras se vacían por un rato.
              </Step>
              <Step n="2" title="Ve canchas exteriores">
                Grandstand y Court 17 tienen partidos con acceso incluido y a metros de la cancha.
              </Step>
              <Step n="3" title="O baja a Flushing por dumplings">
                Una estación de metro te deja en Chinatown Flushing; se come mejor y más barato que dentro.
              </Step>
            </ol>
          </GuideCard>

          <GuideCard
            icon={Suitcase}
            accent="var(--accent-primary-text)"
            accentBg="var(--accent-primary-soft)"
            title="Mochila y clima"
            subtitle="Lo que sí entra al estadio y cómo vestirte"
          >
            <ol className="space-y-5">
              <Step n="1" title="Tamaño máximo: 35 × 30 × 15 cm">
                No se permiten mochilas rígidas, maletas ni botellas de vidrio.
              </Step>
              <Step n="2" title="Tarde: 27 °C y sol directo">
                Protector solar SPF 50, lentes y gorra. Las gradas altas no tienen sombra.
              </Step>
              <Step n="3" title="Noche: ~15 °C con brisa">
                Bajo el techo de Arthur Ashe refresca rápido: lleva sudadera ligera.
              </Step>
            </ol>
          </GuideCard>
        </div>
      )}

      {/* ── DIRECCIONES ──────────────────────────────────────────────── */}
      {activeTab === 'direcciones' && (
        <div className="space-y-4">
          <GuideCard
            icon={MapPin}
            accent="var(--accent-primary-text)"
            accentBg="var(--accent-primary-soft)"
            title="Preguntar en la calle"
            subtitle="Cómo pedir indicaciones y, sobre todo, entender la respuesta"
          >
            <div className="space-y-3">
              <PhraseCard
                en="Excuse me, how do I get to Times Square?"
                es="Disculpe, ¿cómo llego a Times Square?"
              />
              <PhraseCard
                en="Is this the right way to the subway?"
                es="¿Voy bien para el metro?"
              />
              <PhraseCard
                en="Which way is uptown?"
                es="¿Para dónde queda el norte?"
                note="En Manhattan nadie dice norte o sur: es uptown (norte) y downtown (sur)."
              />
              <PhraseCard
                en="Sorry, could you repeat that more slowly?"
                es="Perdón, ¿me lo repite más despacio?"
                note="La frase más útil del viaje. Nadie se molesta."
              />
              <PhraseCard
                en="Can you show me on the map?"
                es="¿Me lo puede mostrar en el mapa?"
                note="Enséñale el teléfono: resuelve cualquier problema de acento."
              />
            </div>
          </GuideCard>

          <div className="spa-card p-5 sm:p-6 space-y-4">
            <span className="spa-eyebrow">
              <Compass className="w-3 h-3 text-[var(--accent-primary-text)]" />
              Entender la respuesta
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Go straight', 'Sigue derecho'],
                ['Make a left / right', 'Da vuelta a la izquierda / derecha'],
                ['Two blocks down', 'Dos cuadras más adelante'],
                ['It\'s on your left', 'Queda a tu izquierda'],
                ['Across the street', 'Cruzando la calle'],
                ['Around the corner', 'A la vuelta de la esquina'],
                ['Uptown / Downtown', 'Hacia el norte / sur'],
                ['Crosstown', 'De este a oeste (o al revés)'],
                ['Head east / west', 'Ve hacia el este / oeste'],
                ['You passed it', 'Ya te pasaste'],
                ['It\'s a ten-minute walk', 'Son diez minutos a pie'],
                ['Take the uptown 1 train', 'Toma el tren 1 en dirección norte']
              ].map(([en, es]) => (
                <div key={en} className="rounded-2xl bg-[var(--bg-surface-elevated)] p-3.5">
                  <span className="block text-[14px] font-bold text-[var(--text-primary)]">{en}</span>
                  <span className="block text-[12px] text-[var(--text-muted)] mt-0.5">{es}</span>
                </div>
              ))}
            </div>
            <Callout tone="amber" icon={Lightbulb} title="Cómo funcionan las direcciones">
              Manhattan es una cuadrícula: las <strong>calles (Streets)</strong> van de este a oeste y suben
              de número hacia el norte; las <strong>avenidas (Avenues)</strong> van de norte a sur. Una
              dirección como “45th &amp; 7th” es el cruce de la calle 45 con la Séptima Avenida —
              con eso solo ya llegas a cualquier lado. 20 calles ≈ 1 milla ≈ 15 min a pie.
            </Callout>
          </div>

          <GuideCard
            icon={TrophyIcon}
            accent="var(--accent-tennis-text)"
            accentBg="color-mix(in srgb, var(--accent-tennis) 16%, transparent)"
            title="Preguntar dentro del US Open"
            subtitle="Billie Jean King Center · encontrar tu asiento y todo lo demás"
          >
            <div className="space-y-3">
              <PhraseCard
                tone="emerald"
                en="Excuse me, where is Arthur Ashe Stadium?"
                es="Disculpe, ¿dónde está el estadio Arthur Ashe?"
              />
              <PhraseCard
                tone="emerald"
                en="I'm looking for section 300, row A. Where do I go?"
                es="Busco la sección 300, fila A. ¿Por dónde entro?"
                note="Tu boleto trae section, row y seat. Enséñaselo al acomodador y te lleva."
              />
              <PhraseCard
                tone="emerald"
                en="Which gate is closest to the Grandstand?"
                es="¿Cuál puerta queda más cerca del Grandstand?"
              />
              <PhraseCard
                tone="emerald"
                en="Where can I get a Honey Deuce?"
                es="¿Dónde consigo un Honey Deuce?"
              />
              <PhraseCard
                tone="emerald"
                en="Where are the restrooms?"
                es="¿Dónde están los baños?"
                note="En EE. UU. se dice “restroom” o “bathroom”, nunca “toilet”."
              />
              <PhraseCard
                tone="emerald"
                en="Can I come back in if I leave?"
                es="¿Puedo volver a entrar si salgo?"
                note="Importante entre la sesión de día y la de noche: son boletos distintos."
              />
              <PhraseCard
                tone="emerald"
                en="Where's the exit to the 7 train?"
                es="¿Por dónde salgo al tren 7?"
              />
            </div>
          </GuideCard>
        </div>
      )}

      {/* ── SLANG ────────────────────────────────────────────────────── */}
      {activeTab === 'slang' && (
        <div className="space-y-4">
          <Callout tone="emerald" icon={Coffee} title="Toca el altavoz">
            Cada frase se reproduce en inglés. Escúchala antes de decirla, o deja que el teléfono
            la diga por ti.
          </Callout>

          <GuideCard
            icon={Coffee}
            accent="var(--accent-amber-text)"
            accentBg="color-mix(in srgb, var(--accent-amber) 16%, transparent)"
            title="Pedir un café"
            subtitle="En bodega, deli o cafetería de barrio"
          >
            <div className="space-y-3">
              <PhraseCard
                tone="amber"
                en="Can I get a large coffee with milk, no sugar, please?"
                es="¿Me da un café grande con leche, sin azúcar, por favor?"
                note="Si pides un “regular coffee” te lo dan con leche y dos azúcares por defecto. Para café negro, pide “black coffee”."
              />
              <PhraseCard
                tone="amber"
                en="An iced latte, please. Oat milk if you have it."
                es="Un latte frío, por favor. Con leche de avena si tienen."
              />
              <PhraseCard
                tone="amber"
                en="For here, please."
                es="Para tomar aquí, por favor."
                note="Te van a preguntar “for here or to go?”. “To go” es para llevar."
              />
              <PhraseCard
                tone="amber"
                en="Can I get a bacon, egg and cheese on a roll, with salt, pepper and ketchup?"
                es="¿Me da un bacon, egg and cheese en pan, con sal, pimienta y catsup?"
                note="El desayuno oficial de Nueva York. Se pide de corrido y en una sola frase."
              />
            </div>
          </GuideCard>

          <GuideCard
            icon={Coffee}
            accent="var(--accent-emerald-text)"
            accentBg="color-mix(in srgb, var(--accent-emerald) 16%, transparent)"
            title="Pedir en Starbucks"
            subtitle="Los tamaños tienen nombre propio: tall, grande, venti"
          >
            <div className="space-y-3">
              <PhraseCard
                tone="emerald"
                en="A tall Americano, please."
                es="Un americano chico, por favor."
                note="Tall = 12 oz (el chico), Grande = 16 oz (mediano), Venti = 20 oz (grande). No existe el “pequeño”."
              />
              <PhraseCard
                tone="emerald"
                en="A grande Americano with an extra shot, please."
                es="Un americano mediano con un shot extra, por favor."
              />
              <PhraseCard
                tone="emerald"
                en="A double espresso, please."
                es="Un espresso doble, por favor."
                note="Si lo quieres sencillo: “a single espresso”."
              />
              <PhraseCard
                tone="emerald"
                en="Can I get room for milk?"
                es="¿Me deja espacio para la leche?"
                note="Para que no te lo llenen hasta el borde y puedas servirte en la barra de leches."
              />
              <PhraseCard
                tone="emerald"
                en="It's for Lalo. L-A-L-O."
                es="Es para Lalo. L-A-L-O."
                note="Siempre piden tu nombre para el vaso. Deletréalo o acabarás siendo “Lolo”."
              />
            </div>
          </GuideCard>

          <GuideCard
            icon={Banknote}
            accent="var(--accent-primary-text)"
            accentBg="var(--accent-primary-soft)"
            title="Pedir en un bar"
            subtitle="Cerveza, whisky y cómo cerrar la cuenta"
          >
            <div className="space-y-3">
              <PhraseCard
                en="Can I get a Heineken, please?"
                es="¿Me da una Heineken, por favor?"
                note="Para de barril: “a draft beer”. En botella: “a bottle”."
              />
              <PhraseCard
                en="What do you have on tap?"
                es="¿Qué tienen de barril?"
                note="La pregunta correcta en un bar de cerveza artesanal."
              />
              <PhraseCard
                en="A whiskey on the rocks, please."
                es="Un whisky en las rocas, por favor."
                note="“On the rocks” es con hielo; “neat” es solo, sin hielo ni agua."
              />
              <PhraseCard
                en="A bourbon, neat. And a glass of water, please."
                es="Un bourbon solo. Y un vaso de agua, por favor."
                note="El agua de la llave es gratis y siempre te la dan si la pides."
              />
              <PhraseCard
                en="Can I open a tab?"
                es="¿Puedo abrir una cuenta?"
                note="Dejas la tarjeta y pagas todo al final. Al cerrar: “Can I close out?”."
              />
              <PhraseCard
                en="Can we get the check, please?"
                es="¿Nos trae la cuenta, por favor?"
                note="En EE. UU. la cuenta no llega sola: hay que pedirla."
              />
            </div>
          </GuideCard>

          <GuideCard
            icon={Utensils}
            accent="var(--accent-rose-text)"
            accentBg="color-mix(in srgb, var(--accent-rose) 16%, transparent)"
            title="El ritual de Katz's"
            subtitle="Delicatessen · Lower East Side"
          >
            <div className="space-y-3">
              <PhraseCard
                tone="rose"
                en="One pastrami on rye, juicy, with mustard, please."
                es="Un pastrami en pan de centeno, jugoso, con mostaza, por favor."
              />
            </div>
            <Callout tone="rose" icon={AlertTriangle} title="El ticket de papel">
              Al entrar te dan un ticket. <strong>No lo pierdas</strong>: se entrega a la salida aunque no
              consumas nada, y perderlo cuesta caro.
            </Callout>
            <Callout tone="emerald" icon={Banknote} title="Propina al cortador">
              Deja $2 en el vaso del cortador al inicio y te dará muestras calientes mientras prepara el sándwich.
            </Callout>
          </GuideCard>
        </div>
      )}

      {/* ── PACKING ──────────────────────────────────────────────────── */}
      {activeTab === 'packing' && (
        <div className="space-y-4">
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Agregar artículo a la maleta…"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="spa-input flex-1 min-h-[3rem]"
            />
            <button type="submit" className="spa-btn spa-btn-primary min-h-[3rem] px-5 flex-shrink-0">
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Agregar</span>
            </button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {packingList.map((item) => (
              <div key={item.id} className={`spa-row py-4 ${item.checked ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => togglePacking(item.id)}
                  aria-pressed={item.checked}
                  aria-label={item.text}
                  className="spa-tile-sm flex-shrink-0 transition-colors spa-pressable"
                  style={{
                    backgroundColor: item.checked ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
                    color: item.checked ? '#fff' : 'transparent',
                    border: item.checked ? 'none' : '1px solid var(--border-strong)'
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <button onClick={() => togglePacking(item.id)} className="flex-1 min-w-0 text-left">
                  <span className={`block text-[14px] font-bold leading-snug ${
                    item.checked ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {item.text}
                  </span>
                  <span className="block text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] mt-1">
                    {item.tag}
                  </span>
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="spa-tile-sm flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-rose-text)] transition-colors"
                  aria-label={`Eliminar ${item.text}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      <TipCalculator isOpen={isTipCalcOpen} onClose={() => setIsTipCalcOpen(false)} />

    </div>
  );
}
