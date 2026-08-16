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
  Check
} from '../utils/icons';
import PageHeader from './PageHeader';
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

      {/* ── SLANG ────────────────────────────────────────────────────── */}
      {activeTab === 'slang' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GuideCard
            icon={Utensils}
            accent="var(--accent-emerald-text)"
            accentBg="color-mix(in srgb, var(--accent-emerald) 16%, transparent)"
            title="Pedir en una bodega"
            subtitle="El desayuno oficial de Nueva York, en una sola frase"
          >
            <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4 font-mono text-[13px] text-[var(--text-primary)] leading-relaxed">
              “Can I get a <strong>bacon, egg and cheese on a roll</strong>, with salt, pepper, ketchup?”
            </div>
            <Callout tone="amber" icon={Coffee} title="Regular coffee">
              Si pides un café “regular” te lo dan de filtro <em>con leche y dos azúcares</em>. Si lo quieres
              negro, pide “black coffee”.
            </Callout>
          </GuideCard>

          <GuideCard
            icon={Utensils}
            accent="var(--accent-rose-text)"
            accentBg="color-mix(in srgb, var(--accent-rose) 16%, transparent)"
            title="El ritual de Katz's"
            subtitle="Delicatessen · Lower East Side"
          >
            <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4 font-mono text-[13px] text-[var(--text-primary)] leading-relaxed">
              “One <strong>pastrami on rye, juicy</strong>, with mustard, please.”
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

    </div>
  );
}
