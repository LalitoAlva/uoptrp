import React, { useState } from 'react';
import DayCard from './DayCard';
import { TennisBall, Beer, Utensils, Landmark, BookOpen, Plane, Lock, Lightbulb, CheckCircle2, CircleXmark } from '../utils/icons';

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

  const categories = [
    { id: 'all', label: 'Todo', icon: null },
    { id: 'tennis', label: 'US Open', icon: TennisBall },
    { id: 'beer', label: 'Bares', icon: Beer },
    { id: 'food', label: 'Comida', icon: Utensils },
    { id: 'sights', label: 'Paseos', icon: Landmark },
    { id: 'books', label: 'Libros & Tech', icon: BookOpen },
    { id: 'logistics', label: 'Logística', icon: Plane }
  ];

  let totalFijo = 0;
  let totalOpcional = 0;
  let totalHecho = 0;
  let totalNoHecho = 0;

  tripData.days.forEach(d => {
    d.timeline.forEach(t => {
      const st = t.status || (t.completed ? 'hecho' : 'pendiente');
      if (st === 'fijo') totalFijo++;
      else if (st === 'opcional') totalOpcional++;
      else if (st === 'hecho') totalHecho++;
      else if (st === 'no_hecho') totalNoHecho++;
    });
  });

  const statuses = [
    { id: 'all', label: 'Todos los estados', icon: null },
    { id: 'fijo', label: `Inamovibles (${totalFijo})`, icon: Lock },
    { id: 'opcional', label: `Opcionales (${totalOpcional})`, icon: Lightbulb },
    { id: 'hecho', label: `Hechos (${totalHecho})`, icon: CheckCircle2 },
    { id: 'no_hecho', label: `No hechos (${totalNoHecho})`, icon: CircleXmark },
  ];

  const daysToRender = selectedDayTab === 'all' 
    ? tripData.days 
    : tripData.days.filter(d => d.dayNumber === selectedDayTab);

  return (
    <div className="w-full space-y-10">
      
      {/* Top Filter Bar with ample padding */}
      <div className="spa-card p-6 sm:p-8 space-y-5">
        
        {/* Day Selector Pills — larger, more prominent touch targets */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {tripData.days.map((day) => {
            const isSelected = selectedDayTab === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayTab(day.dayNumber)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm sm:text-base font-bold transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                <span className={`w-7 h-7 rounded flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isSelected ? 'bg-white text-[var(--accent-primary-text)]' : 'bg-[var(--border-medium)] text-[var(--text-primary)]'
                }`}>
                  {day.dayNumber}
                </span>
                <span>D{day.dayNumber} · {day.date.split(',')[0]}</span>
              </button>
            );
          })}

          <button
            onClick={() => setSelectedDayTab('all')}
            className={`px-5 py-3 rounded-lg text-sm sm:text-base font-bold transition-colors whitespace-nowrap ${
              selectedDayTab === 'all'
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
            }`}
          >
            Ver Todo el Viaje (Días 1-7)
          </button>
        </div>

        {/* Status and Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)] text-xs sm:text-sm">
          
          {/* Status filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mr-1">Estado:</span>
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${
                  filterStatus === st.id
                    ? 'bg-[var(--text-primary)] text-[var(--bg-surface)]'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {st.icon && <st.icon className="w-3 h-3" />}
                {st.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mr-1">Tipo:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  filterCategory === cat.id
                    ? 'bg-[var(--accent-primary)] text-white font-bold'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {cat.icon && <cat.icon className="w-3 h-3" />}
                {cat.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Days List — generous gap plus an explicit divider when several days
          stack together ("Ver Todo"), so it's unambiguous where one day ends
          and the next begins instead of relying on whitespace alone. */}
      <div className="space-y-20 sm:space-y-28">
        {daysToRender.map((day, idx) => (
          <div key={day.dayNumber}>
            {idx > 0 && (
              <div className="flex items-center gap-4 mb-20 sm:mb-28" aria-hidden="true">
                <div className="flex-1 h-px bg-[var(--border-medium)]" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] px-3 py-1 rounded-full border border-[var(--border-medium)] bg-[var(--bg-app)]">
                  Día {day.dayNumber}
                </span>
                <div className="flex-1 h-px bg-[var(--border-medium)]" />
              </div>
            )}
            <DayCard
              day={day}
              filterCategory={filterCategory}
              filterStatus={filterStatus}
              onChangeActivityStatus={onChangeActivityStatus}
              onEditActivity={onEditActivity}
              onDeleteActivity={onDeleteActivity}
              onMoveActivity={onMoveActivity}
              onAddActivityToDay={onAddActivityToDay}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
