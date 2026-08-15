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

  return (
    <div className="w-full space-y-8">
      
      {/* Header Banner */}
      <div className="spa-card p-8 sm:p-10 border border-[var(--border-subtle)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary-text)]">
                Directorio Curado de Autor · NYC 2026
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-[var(--text-primary)] tracking-tight">
              Recomendaciones & Spots Imperdibles
            </h1>
            
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              La selección definitiva para comer, beber craft beer, escuchar jazz en vivo y visitar los tesoros escondidos de Manhattan, Brooklyn, Queens y Hudson Valley.
            </p>

            {/* Quick Stats Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Lugares Curados:</span>
                <span className="font-mono text-[var(--accent-primary-text)]">{recommendations.length}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Visitados:</span>
                <span className="font-mono">{visitedCount} de {recommendations.length}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenImportExport}
              className="flex-1 lg:flex-none px-4 py-2.5 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[var(--accent-primary-text)]" />
              <span>Importar / Exportar</span>
            </button>

            <button
              onClick={onOpenNewRec}
              className="flex-1 lg:flex-none px-5 py-2.5 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Nuevo Spot</span>
            </button>
          </div>
        </div>

        {/* Category Quick Filter Pills Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] space-y-4">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              const count = c.id === 'all' 
                ? recommendations.length 
                : recommendations.filter(r => r.category === c.id).length;
              
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-2 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                      : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Zone and Visited Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, comida, platillo imperdible, zona..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
            >
              <option value="all">📍 Todas las Zonas de NYC</option>
              {zones.filter(z => z !== 'all').map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>

            <select
              value={filterVisited}
              onChange={(e) => setFilterVisited(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="pending">⏳ Por Visitar</option>
              <option value="visited">✅ Ya Visitados</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Eye-Catching Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecs.length === 0 ? (
          <div className="col-span-full spa-card p-12 text-center text-[var(--text-muted)] text-sm space-y-2">
            <Sparkles className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
            <p className="font-bold text-[var(--text-primary)]">No se encontraron recomendaciones con estos filtros.</p>
            <p className="text-xs">Prueba seleccionando otra categoría o borra el texto de búsqueda.</p>
          </div>
        ) : (
          filteredRecs.map((rec) => {
            const config = getCategoryConfig(rec.category);

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
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${config.badgeClass} flex items-center gap-1`}>
                      <config.icon className="w-3 h-3" />
                      <span>{rec.category}</span>
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
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
                    <div className="p-3 rounded bg-amber-500/10 border border-amber-500/25 space-y-1">
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
                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handleToggle(rec.id)}
                    className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                      rec.visited
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${rec.visited ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`} />
                    <span>{rec.visited ? 'Visitado' : 'Por Visitar'}</span>
                  </button>

                  {rec.mapsUrl ? (
                    <a
                      href={rec.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary-text)] font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(rec.name + ' NYC')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--accent-primary-text)] font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
