import React, { useState } from 'react';
import DayCard from './DayCard';
import BottomSheet from './BottomSheet';
import {
  TennisBall, Beer, Utensils, Landmark, BookOpen, Plane,
  Lock, Lightbulb, CheckCircle2, CircleXmark, Calendar,
  Sliders, X, Clock
} from '../utils/icons';
import { getStatus } from '../utils/activityMeta';

/**
 * Big pill option used inside the filter sheet — 52px+ tall.
 *
 * Module scope, not inside ItineraryView: a component declared in a render
 * body gets a new identity every render, so React unmounts and remounts it.
 * A remount between a finger's pointerdown and its click throws the tap away.
 */
function FilterOption({ option, isActive, onClick }) {
  const Icon = option.icon;
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`flex items-center gap-3 w-full min-h-[3.25rem] px-4 rounded-2xl text-left text-sm font-bold transition-colors spa-pressable ${
        isActive
          ? 'bg-[var(--accent-primary)] text-white'
          : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
      }`}
    >
      {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[var(--accent-primary-text)]'}`} />}
      <span className="flex-1">{option.label}</span>
      {typeof option.count === 'number' && (
        <span className={`font-mono text-xs ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
          {option.count}
        </span>
      )}
    </button>
  );
}

export default function ItineraryView({
  tripData,
  onChangeActivityStatus,
  onEditActivity,
  onDeleteActivity,
  onMoveActivity,
  onAddActivityToDay
}) {
  const [selectedDayTab, setSelectedDayTab] = useState(1);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Todo', icon: Calendar },
    { id: 'tennis', label: 'US Open', icon: TennisBall },
    { id: 'beer', label: 'Bares', icon: Beer },
    { id: 'food', label: 'Comida', icon: Utensils },
    { id: 'sights', label: 'Paseos', icon: Landmark },
    { id: 'books', label: 'Libros & Tech', icon: BookOpen },
    { id: 'logistics', label: 'Logística', icon: Plane }
  ];

  const counts = { fijo: 0, opcional: 0, hecho: 0, no_hecho: 0, pendiente: 0 };
  tripData.days.forEach(d => d.timeline.forEach(t => { counts[getStatus(t)]++; }));

  const statuses = [
    { id: 'all', label: 'Todos', icon: Calendar },
    { id: 'pendiente', label: 'Por hacer', icon: Clock, count: counts.pendiente },
    { id: 'fijo', label: 'Inamovibles', icon: Lock, count: counts.fijo },
    { id: 'opcional', label: 'Opcionales', icon: Lightbulb, count: counts.opcional },
    { id: 'hecho', label: 'Hechos', icon: CheckCircle2, count: counts.hecho },
    { id: 'no_hecho', label: 'Omitidos', icon: CircleXmark, count: counts.no_hecho },
  ];

  const daysToRender = selectedDayTab === 'all'
    ? tripData.days
    : tripData.days.filter(d => d.dayNumber === selectedDayTab);

  const activeFilters = [
    filterStatus !== 'all' && {
      key: 'status',
      label: statuses.find(s => s.id === filterStatus)?.label,
      clear: () => setFilterStatus('all')
    },
    filterCategory !== 'all' && {
      key: 'category',
      label: categories.find(c => c.id === filterCategory)?.label,
      clear: () => setFilterCategory('all')
    }
  ].filter(Boolean);

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ── Sticky day picker ────────────────────────────────────────────
          Pinned under the header so switching days never means scrolling
          back to the top of a long timeline. */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-[1.125rem] sm:-mx-7 lg:-mx-10 px-[1.125rem] sm:px-7 lg:px-10 py-3 spa-blur border-b border-[var(--border-subtle)]">

        <div className="spa-rail hide-scrollbar">
          {tripData.days.map((day) => {
            const isSelected = selectedDayTab === day.dayNumber;
            const [weekday, dayNum] = day.date.split(' ');
            const done = day.timeline.filter(t => getStatus(t) === 'hecho').length;
            const allDone = day.timeline.length > 0 && done === day.timeline.length;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayTab(day.dayNumber)}
                aria-pressed={isSelected}
                className={`relative flex flex-col items-center justify-center gap-1 w-[4.25rem] h-[4.5rem] rounded-2xl font-bold transition-colors spa-pressable ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-white shadow-[0_10px_24px_-14px_var(--accent-primary)]'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest leading-none ${isSelected ? 'text-white/75' : 'text-[var(--text-muted)]'}`}>
                  {weekday?.slice(0, 3)}
                </span>
                <span className="font-display text-2xl leading-none">{dayNum}</span>
                {allDone && (
                  <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[var(--accent-emerald)]'}`} />
                )}
              </button>
            );
          })}

          <button
            onClick={() => setSelectedDayTab('all')}
            aria-pressed={selectedDayTab === 'all'}
            className={`flex flex-col items-center justify-center gap-1.5 w-[4.25rem] h-[4.5rem] rounded-2xl font-bold transition-colors spa-pressable ${
              selectedDayTab === 'all'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wide leading-none">Todo</span>
          </button>
        </div>

        {/* Filters live behind one button; whatever is active shows as a
            removable chip so the state is never hidden. */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className={`spa-chip flex-shrink-0 ${activeFilters.length > 0 ? 'spa-chip-accent' : ''}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Filtros
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/25 text-[10px] font-black flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {activeFilters.map((f) => (
            <button key={f.key} onClick={f.clear} className="spa-chip flex-shrink-0">
              {f.label}
              <X className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Days ─────────────────────────────────────────────────────── */}
      <div className="space-y-8 sm:space-y-12">
        {daysToRender.map((day) => (
          <DayCard
            key={day.dayNumber}
            day={day}
            filterCategory={filterCategory}
            filterStatus={filterStatus}
            onChangeActivityStatus={onChangeActivityStatus}
            onEditActivity={onEditActivity}
            onDeleteActivity={onDeleteActivity}
            onMoveActivity={onMoveActivity}
            onAddActivityToDay={onAddActivityToDay}
          />
        ))}
      </div>

      {/* ── Filter sheet ─────────────────────────────────────────────── */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filtrar paradas"
        subtitle="Se aplica a todos los días visibles"
        icon={Sliders}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setFilterStatus('all'); setFilterCategory('all'); }}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {statuses.map((st) => (
                <FilterOption
                  key={st.id}
                  option={st}
                  isActive={filterStatus === st.id}
                  onClick={() => setFilterStatus(st.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="spa-eyebrow">Tipo de parada</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((cat) => (
                <FilterOption
                  key={cat.id}
                  option={cat}
                  isActive={filterCategory === cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
