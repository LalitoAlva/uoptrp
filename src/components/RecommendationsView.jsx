import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Tag, 
  DollarSign, 
  Check, 
  Search, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Compass, 
  Download,
  Filter,
  CheckCircle2,
  Beer,
  Pizza,
  Music,
  Coffee,
  ShoppingBag,
  Landmark,
  Star,
  Flame,
  Award
} from '../utils/icons';
import { sanitizeUrl } from '../utils/sanitize';
import PageHeader from './PageHeader';
import BottomSheet from './BottomSheet';
import confetti from 'canvas-confetti';

export default function RecommendationsView({ 
  recommendations, 
  onToggleVisited, 
  onDeleteRecommendation, 
  onOpenNewRec, 
  onOpenImportExport 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [filterVisited, setFilterVisited] = useState('all'); // 'all', 'visited', 'pending'
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Todo', icon: Sparkles, color: 'text-[var(--accent-primary-text)]' },
    { id: 'Cerveza Artesanal', label: 'Cerveza Artesanal', icon: Beer, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { id: 'Restaurantes & Delis', label: 'Comida & Delis', icon: Pizza, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { id: 'Jazz & Música en Vivo', label: 'Jazz & Música', icon: Music, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { id: 'Café de Especialidad', label: 'Café & Bagels', icon: Coffee, color: 'text-amber-600 bg-amber-600/10 border-amber-600/20' },
    { id: 'Compras & Tech', label: 'Compras & Tech', icon: ShoppingBag, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'Vistas & Cultura', label: 'Paseos & Vistas', icon: Landmark, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' }
  ];

  const zones = [
    'all',
    'Greenwich Village',
    'Hell\'s Kitchen',
    'Midtown Manhattan',
    'Chelsea & Meatpacking',
    'Lower East Side',
    'Hudson Yards & High Line',
    'Brooklyn (DUMBO / Gowanus)',
    'Queens (Astoria / Flushing)',
    'Hudson Valley'
  ];

  const getCategoryConfig = (category) => {
    switch (category) {
      case 'Cerveza Artesanal':
        return {
          icon: Beer,
          badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          accentBorder: 'border-l-amber-500',
        };
      case 'Restaurantes & Delis':
        return {
          icon: Pizza,
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          accentBorder: 'border-l-rose-500',
        };
      case 'Jazz & Música en Vivo':
        return {
          icon: Music,
          badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
          accentBorder: 'border-l-purple-500',
        };
      case 'Café de Especialidad':
        return {
          icon: Coffee,
          badgeClass: 'bg-amber-600/10 text-amber-700 dark:text-amber-300 border-amber-600/30',
          accentBorder: 'border-l-amber-600',
        };
      case 'Compras & Tech':
        return {
          icon: ShoppingBag,
          badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
          accentBorder: 'border-l-cyan-500',
        };
      case 'Vistas & Cultura':
      default:
        return {
          icon: Landmark,
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          accentBorder: 'border-l-emerald-500',
        };
    }
  };

  const filteredRecs = recommendations.filter(rec => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (selectedZone !== 'all' && rec.zone !== selectedZone) return false;
    if (filterVisited === 'visited' && !rec.visited) return false;
    if (filterVisited === 'pending' && rec.visited) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rec.name.toLowerCase().includes(q);
      const matchNotes = rec.notes && rec.notes.toLowerCase().includes(q);
      const matchMustTry = rec.mustTry && rec.mustTry.toLowerCase().includes(q);
      const matchZone = rec.zone && rec.zone.toLowerCase().includes(q);
      return matchName || matchNotes || matchMustTry || matchZone;
    }
    return true;
  });

  const handleToggle = (id) => {
    onToggleVisited(id);
    const rec = recommendations.find(r => r.id === id);
    if (rec && !rec.visited) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
  };

  const visitedCount = recommendations.filter(r => r.visited).length;

  const activeExtraFilters = (selectedZone !== 'all' ? 1 : 0) + (filterVisited !== 'all' ? 1 : 0);

  return (
    <div className="w-full space-y-7">

      <PageHeader
        eyebrow="Directorio curado · NYC 2026"
        title="Recomendaciones & spots imperdibles"
        description="La selección definitiva para comer, beber craft beer, escuchar jazz en vivo y visitar los tesoros escondidos de Manhattan, Brooklyn, Queens y Hudson Valley."
        icon={Sparkles}
        stats={[
          { label: 'Lugares', value: recommendations.length, icon: MapPin },
          {
            label: 'Visitados',
            value: `${visitedCount}/${recommendations.length}`,
            icon: CheckCircle2,
            color: 'var(--accent-emerald-text)',
            soft: 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)'
          }
        ]}
        actions={
          <>
            <button onClick={onOpenNewRec} className="spa-btn spa-btn-primary flex-1 sm:flex-none min-h-[3rem]">
              <Plus className="w-4 h-4" />
              Nuevo spot
            </button>
            <button onClick={onOpenImportExport} className="spa-btn spa-btn-ghost flex-1 sm:flex-none min-h-[3rem]">
              <Download className="w-4 h-4 text-[var(--accent-primary-text)]" />
              Importar / Exportar
            </button>
          </>
        }
      />

      {/* Search + category rail stay in reach; the two long dropdowns moved
          into a sheet so the top of this screen isn't a form on a phone. */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar lugar, platillo o zona…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="spa-input pl-11 min-h-[3rem]"
            />
          </div>
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className={`spa-tile flex-shrink-0 ${
              activeExtraFilters > 0
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
            }`}
            aria-label="Más filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="spa-rail hide-scrollbar">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            const count = c.id === 'all'
              ? recommendations.length
              : recommendations.filter(r => r.category === c.id).length;
            const CatIcon = c.icon;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                aria-pressed={isSelected}
                className={`spa-chip ${isSelected ? 'spa-chip-accent' : ''}`}
              >
                {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                {c.label}
                <span className="font-mono text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of recommendation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRecs.length === 0 ? (
          <div className="col-span-full spa-card p-12 text-center space-y-3">
            <span className="spa-tile-lg mx-auto bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
              <Sparkles className="w-6 h-6" />
            </span>
            <p className="font-heading font-bold text-lg text-[var(--text-primary)]">Sin resultados</p>
            <p className="text-sm text-[var(--text-muted)]">Prueba con otra categoría o borra el texto de búsqueda.</p>
          </div>
        ) : (
          filteredRecs.map((rec) => {
            const config = getCategoryConfig(rec.category);
            const safeMapsUrl = sanitizeUrl(rec.mapsUrl);

            return (
              <div
                key={rec.id}
                className={`spa-card spa-card-hover p-6 flex flex-col justify-between transition-all border-l-4 ${config.accentBorder} ${
                  rec.visited ? 'opacity-65 bg-[var(--bg-surface-elevated)]/40' : 'bg-[var(--bg-surface)]'
                }`}
              >
                <div className="space-y-3.5">
                  
                  {/* Top Badges & Category Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${config.badgeClass} flex items-center gap-1`}>
                      <config.icon className="w-3 h-3" />
                      <span>{rec.category}</span>
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded-lg border border-[var(--border-subtle)]">
                        {rec.price || '$$'}
                      </span>
                      <button
                        onClick={() => onDeleteRecommendation(rec.id)}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                        title="Eliminar recomendación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Place Name */}
                  <h3 className="font-heading font-black text-lg text-[var(--text-primary)] leading-snug tracking-tight">
                    {rec.name}
                  </h3>

                  {/* Must Try Spotlight Banner (Eye-Catching) */}
                  {rec.mustTry && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        <span>Qué Pedir / Imperdible:</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        {rec.mustTry}
                      </p>
                    </div>
                  )}

                  {/* Notes / Description */}
                  {rec.notes && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                      {rec.notes}
                    </p>
                  )}

                  {/* Zone & Address Info */}
                  <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                      <Compass className="w-3.5 h-3.5 text-[var(--accent-primary-text)] flex-shrink-0" />
                      <span className="truncate">{rec.zone || 'Manhattan'}</span>
                    </div>
                    {rec.address && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                        <span className="truncate">{rec.address}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(rec.id)}
                    aria-pressed={rec.visited}
                    className="spa-chip flex-1 justify-center"
                    style={rec.visited ? {
                      backgroundColor: 'color-mix(in srgb, var(--accent-emerald) 16%, transparent)',
                      color: 'var(--accent-emerald-text)',
                      borderColor: 'transparent'
                    } : undefined}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {rec.visited ? 'Visitado' : 'Por visitar'}
                  </button>

                  <a
                    href={safeMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${rec.name} NYC`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spa-chip"
                    style={{ backgroundColor: 'var(--accent-primary-soft)', color: 'var(--accent-primary-text)', borderColor: 'transparent' }}
                  >
                    Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Zone + visited filters */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filtros"
        subtitle="Acota por zona de la ciudad o por estado"
        icon={Filter}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setSelectedZone('all'); setFilterVisited('all'); }}
              className="spa-btn spa-btn-ghost w-full min-h-[3rem]"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsFilterSheetOpen(false)}
              className="spa-btn spa-btn-primary w-full min-h-[3rem]"
            >
              Ver resultados
            </button>
          </div>
        }
      >
        <div className="space-y-7">
          <div className="space-y-2.5">
            <span className="spa-eyebrow">Estado</span>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'pending', label: 'Por visitar' },
                { id: 'visited', label: 'Ya visitados' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilterVisited(opt.id)}
                  aria-pressed={filterVisited === opt.id}
                  className={`flex items-center gap-3 w-full min-h-[3.25rem] px-4 rounded-2xl text-left text-sm font-bold transition-colors spa-pressable ${
                    filterVisited === opt.id
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="spa-eyebrow">Zona</span>
            <div className="grid grid-cols-1 gap-2">
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  aria-pressed={selectedZone === z}
                  className={`flex items-center gap-3 w-full min-h-[3.25rem] px-4 rounded-2xl text-left text-sm font-bold transition-colors spa-pressable ${
                    selectedZone === z
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Compass className={`w-4 h-4 flex-shrink-0 ${selectedZone === z ? 'text-white' : 'text-[var(--accent-primary-text)]'}`} />
                  {z === 'all' ? 'Todas las zonas' : z}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
