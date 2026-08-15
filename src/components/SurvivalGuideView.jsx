import React, { useState } from 'react';
import {
  Compass,
  Train,
  Trophy,
  Coffee,
  CheckSquare,
  ShieldCheck,
  Plus,
  Trash2,
  CreditCard,
  Star,
  Suitcase,
  Utensils,
  Banknote,
  Check 
} from '../utils/icons';
import confetti from 'canvas-confetti';

export default function SurvivalGuideView() {
  const [activeTab, setActiveTab] = useState('subway');

  const [packingList, setPackingList] = useState([
    { id: 'p1', text: 'Powerbank de 10,000–20,000 mAh (en equipaje de mano)', checked: true, tag: 'Esencial' },
    { id: 'p2', text: 'Tenis más cómodos probados (18,000+ pasos diarios)', checked: true, tag: 'Esencial' },
    { id: 'p3', text: 'Chamarra ligera / sudadera para noche de Arthur Ashe (~15°C)', checked: false, tag: 'Ropa' },
    { id: 'p4', text: 'Lentes de sol + Protector solar SPF 50 para sesión diurna', checked: false, tag: 'US Open' },
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

  return (
    <div className="w-full space-y-4">
      
      {/* Header Banner */}
      <div className="spa-card p-6 border border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Compass className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
              Guía de Tránsito & Secretos de Viaje
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl text-[var(--text-primary)] tracking-tight">
            Manual del Neoyorquino & US Open Master
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Tránsito MTA OMNY, trenes a Hudson Valley, cambio de sesión en Arthur Ashe y checklist interactivo.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-[var(--border-subtle)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('subway')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'subway'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Metro OMNY & Trenes</span>
          </button>

          <button
            onClick={() => setActiveTab('usopen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'usopen'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Estrategia US Open</span>
          </button>

          <button
            onClick={() => setActiveTab('slang')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'slang'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Jerga & Cómo Pedir</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'packing'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist Maleta ({packingList.filter(p => p.checked).length}/{packingList.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUBWAY */}
      {activeTab === 'subway' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="spa-card p-4 space-y-2">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> OMNY Contactless ($2.90 USD / viaje)
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              No compres MetroCard. Solo acerca tu iPhone (Apple Pay) o tarjeta de crédito en el torniquete.
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1 text-[var(--text-secondary)]">
              <p>• <strong>Transbordo gratis:</strong> 2 horas entre metro y autobús usando la misma tarjeta.</p>
              <p>• <strong>Fare Cap semanal:</strong> Del viaje 13 en adelante en 7 días, todos los viajes son gratis.</p>
            </div>
          </div>

          <div className="spa-card p-4 space-y-2">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" aria-hidden="true" /> Metro Línea 7 Express a Arthur Ashe
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Toma el <strong>tren con rombo &lt;7&gt;</strong> en Times Sq-42nd St directo a <strong>Mets-Willets Point</strong> (35 min).
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1 text-[var(--text-secondary)]">
              <p>• El express se salta paradas intermedias en Queens y ahorra 15 min.</p>
              <p>• Al terminar los partidos de noche, hay trenes saliendo cada 3 minutos a Manhattan.</p>
            </div>
          </div>

          <div className="spa-card p-4 space-y-2 md:col-span-2">
            <span className="font-bold text-sm text-amber-500 flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5" /> Metro North Hudson Line (Día 6) — Tip de la Ventanilla
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Compra los boletos en la app <em>MTA TrainTime</em>. Al salir de Grand Central con rumbo norte hacia Cold Spring, siéntate del <strong>LADO IZQUIERDO del tren</strong> para tener vista ininterrumpida de todo el río Hudson y los acantilados de Palisades.
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: US OPEN */}
      {activeTab === 'usopen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="spa-card p-4 space-y-2">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" /> La "Ventana Dorada" (14:30 a 17:30)
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              El domingo 6, la Sesión 15 (Día) termina ~14:30 y las puertas de la Sesión 16 abren a las 17:00.
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1 text-[var(--text-secondary)]">
              <p>1. Aprovecha para comprar el <strong>Honey Deuce</strong> sin filas masivas.</p>
              <p>2. Ve canchas exteriores (Grandstand o Court 17).</p>
              <p>3. O toma el metro 1 estación a <strong>Chinatown Flushing</strong> para comer dumplings calientes.</p>
            </div>
          </div>

          <div className="spa-card p-4 space-y-2">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Suitcase className="w-3.5 h-3.5" /> Reglas de Mochila y Clima
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Tamaño máximo permitido en Arthur Ashe: <strong>35 x 30 x 15 cm</strong>. No se permiten mochilas rígidas ni botellas de vidrio.
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1 text-[var(--text-secondary)]">
              <p>• La tarde puede estar a 27°C y con sol intenso (lleva bloqueador SPF 50 y lentes).</p>
              <p>• La noche bajo el techo de Arthur Ashe baja a ~15°C con brisa (lleva sudadera ligera).</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SLANG */}
      {activeTab === 'slang' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="spa-card p-4 space-y-2">
            <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" /> Cómo pedir en una Bodega de NYC
            </span>
            <p className="text-[var(--text-secondary)]">
              El desayuno oficial se pide en una sola frase rápida en el mostrador:
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] font-mono text-[var(--text-primary)] border border-[var(--border-subtle)]">
              "Can I get a <strong>Bacon, Egg and Cheese on a roll</strong>, with salt, pepper, ketchup?"
            </div>
            <p className="text-[11px] text-[var(--text-muted)] flex items-start gap-1.5">
              <Coffee className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span><strong>Regular Coffee:</strong> Si pides café "regular", te darán café de filtro con leche y 2 azúcares por defecto.</span>
            </p>
          </div>

          <div className="spa-card p-4 space-y-2">
            <span className="font-bold text-sm text-rose-500 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" /> El Ritual de Katz's Delicatessen
            </span>
            <p className="text-[var(--text-secondary)]">
              Al entrar te dan un ticket de papel. <strong>¡No lo pierdas!</strong> Aunque no compres nada, se entrega a la salida.
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] font-mono text-[var(--text-primary)] border border-[var(--border-subtle)]">
              "One <strong>Pastrami on rye, juicy</strong>, with mustard, please."
            </div>
            <p className="text-[11px] text-[var(--text-muted)] flex items-start gap-1.5">
              <Banknote className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Deja $2 de propina en el vaso del cortador al inicio; te dará muestras calientes mientras prepara tu sándwich.</span>
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: PACKING */}
      {activeTab === 'packing' && (
        <div className="space-y-3 text-xs">
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Agregar artículo..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[var(--accent-primary)] text-white font-bold rounded-lg text-xs"
            >
              Agregar
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {packingList.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePacking(item.id)}
                className={`spa-card p-3 flex items-center justify-between gap-3 cursor-pointer ${
                  item.checked ? 'bg-[var(--bg-surface-elevated)] opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                    item.checked ? 'bg-emerald-500 text-white font-bold' : 'border border-[var(--border-strong)]'
                  }`}>
                    {item.checked && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span className={`text-[var(--text-primary)] truncate ${item.checked ? 'line-through text-[var(--text-muted)]' : ''}`}>
                    {item.text}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {item.tag}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
