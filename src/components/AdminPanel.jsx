import React, { useState } from 'react';
import {
  Database,
  Calendar,
  CheckSquare,
  Sparkles,
  Trophy,
  BookOpen,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Search,
  Lock,
  Clock,
  MapPin,
  ExternalLink,
  Ticket,
  AlertCircle,
  AlertTriangle
} from '../utils/icons';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel({ 
  tripData, 
  onChangeActivityStatus, 
  onEditActivity, 
  onDeleteActivity, 
  onOpenNewActivity,
  onUpdatePendingTask,
  onDeletePendingTask,
  onOpenNewTask,
  onDeleteRecommendation,
  onOpenNewRec,
  onOpenNewBook,
  onDeleteBook,
  onDeleteExpense
}) {
  const { isAdmin } = useAuth();
  const [activeCatalog, setActiveCatalog] = useState('itinerary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');

  const catalogs = [
    { id: 'itinerary', label: 'Itinerario & Paradas', icon: Calendar, count: tripData.days.reduce((acc, d) => acc + d.timeline.length, 0) },
    { id: 'pending', label: 'Pendientes & Reservas', icon: CheckSquare, count: tripData.urgentTasks.length },
    { id: 'recommendations', label: 'Recomendaciones', icon: Sparkles, count: tripData.recommendations.length },
    { id: 'passes', label: 'Pases & Arthur Ashe', icon: Trophy, count: tripData.sportsTravelerPackage.sessions.length + tripData.goCityPass.attractions.length },
    { id: 'books', label: 'Libros Strand & Tech', icon: BookOpen, count: (tripData.strandBooksList || []).length },
    { id: 'budget', label: 'Gastos & Presupuesto', icon: DollarSign, count: (tripData.budgetExpenses || []).length },
  ];

  let allActivities = [];
  tripData.days.forEach(day => {
    day.timeline.forEach(item => {
      allActivities.push({ ...item, dayNumber: day.dayNumber, dayDate: day.date });
    });
  });

  const filteredActivities = allActivities.filter(item => {
    if (selectedDayFilter !== 'all' && item.dayNumber !== parseInt(selectedDayFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.sub && item.sub.toLowerCase().includes(q)) ||
        (item.address && item.address.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="w-full space-y-4">

      {/* CMS Header */}
      <div className="spa-banner p-6 sm:p-9 space-y-5">
        <div className="flex items-start gap-4">
          <span className="spa-tile-lg flex-shrink-0 bg-[var(--accent-primary-soft)] text-[var(--accent-primary-text)]">
            <Database className="w-6 h-6" />
          </span>
          <div className="flex-1 min-w-0">
            <span className="spa-eyebrow">Panel de contenido (CMS)</span>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-[var(--text-primary)] leading-tight mt-1">
              Catálogos maestros
            </h1>
          </div>
        </div>

        <p className="text-[13px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          El lugar donde se edita todo el contenido del viaje de un solo tirón: paradas del itinerario,
          pendientes, recomendaciones, pases, libros y gastos. Altas, bajas y cambios en una sola pantalla.
        </p>

        {!isAdmin && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: 'color-mix(in srgb, var(--accent-amber) 14%, transparent)' }}
          >
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--accent-amber-text)]" />
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">Modo consulta.</strong> Inicia sesión como
              administrador para editar los catálogos.
            </p>
          </div>
        )}

        {/* Catalog Selector Pills */}
        <div className="spa-rail hide-scrollbar">
          {catalogs.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCatalog === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCatalog(cat.id)}
                aria-pressed={isActive}
                className={`spa-chip ${isActive ? 'spa-chip-accent' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
                <span className="font-mono text-[10px] opacity-70">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CATALOG 1: ITINERARY (Full CRUD Table) */}
      {activeCatalog === 'itinerary' && (
        <div className="space-y-3">
          
          {/* Controls Bar */}
          <div className="spa-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en catálogo de paradas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
              >
                <option value="all">Todos los Días (1-7)</option>
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <option key={d} value={d}>Día {d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onOpenNewActivity(1)}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Alta de Parada</span>
            </button>
          </div>

          {/* Table */}
          <div className="spa-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] font-bold uppercase text-[10px] tracking-wider border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-2.5 px-3">Día</th>
                    <th className="py-2.5 px-3">Hora</th>
                    <th className="py-2.5 px-3">Actividad</th>
                    <th className="py-2.5 px-3">Categoría</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-[var(--text-muted)]">
                        No se encontraron actividades.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act) => {
                      const currentStatus = act.status || (act.completed ? 'hecho' : 'pendiente');
                      return (
                        <tr 
                          key={`${act.dayNumber}-${act.id}`}
                          className="hover:bg-[var(--bg-surface-elevated)]/50 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-bold text-[var(--text-primary)]">
                            <span className="w-6 h-6 rounded-lg bg-[var(--bg-surface-elevated)] inline-flex items-center justify-center text-xs">
                              D{act.dayNumber}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[var(--accent-primary-text)]">
                            {act.time}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-[var(--text-primary)]">{act.title}</div>
                            {act.sub && <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">{act.sub}</div>}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                              {act.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={currentStatus}
                              onChange={(e) => onChangeActivityStatus(act.dayNumber, act.id, e.target.value)}
                              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-[11px] font-bold text-[var(--text-primary)] focus:outline-none"
                            >
                              <option value="fijo">🔒 Inamovible</option>
                              <option value="opcional">💡 Opcional</option>
                              <option value="hecho">✅ Hecho</option>
                              <option value="no_hecho">❌ No hecho</option>
                              <option value="pendiente">⏳ Por hacer</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onEditActivity(act.dayNumber, act)}
                                className="p-1 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteActivity(act.dayNumber, act.id)}
                                className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* CATALOG 2: PENDIENTES */}
      {activeCatalog === 'pending' && (
        <div className="space-y-3">
          <div className="spa-card p-3 flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-[var(--text-primary)]">
              Catálogo de Requisitos & Tareas Urgentes
            </span>
            <button
              onClick={onOpenNewTask}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Pendiente</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {tripData.urgentTasks.map((t) => (
              <div
                key={t.id}
                className="spa-card p-3 flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-lg flex items-center gap-1 ${
                      t.priority === 'urgent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {t.priority === 'urgent' ? <AlertCircle className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                      {t.priority === 'urgent' ? 'Urgente' : 'Importante'}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">{t.text}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">{t.details}</p>
                </div>
                <button
                  onClick={() => onDeletePendingTask(t.id)}
                  className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATALOG 3: RECOMMENDATIONS */}
      {activeCatalog === 'recommendations' && (
        <div className="space-y-3">
          <div className="spa-card p-3 flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-[var(--text-primary)]">
              Catálogo de Recomendaciones ({tripData.recommendations.length})
            </span>
            <button
              onClick={onOpenNewRec}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Recomendación</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {tripData.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="spa-card p-3.5 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {rec.category}
                    </span>
                    <button
                      onClick={() => onDeleteRecommendation(rec.id)}
                      className="p-1 text-[var(--text-muted)] hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] mt-1">{rec.name}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5">{rec.notes}</p>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-1.5 flex justify-between">
                  <span>{rec.zone}</span>
                  <span className="text-[var(--accent-primary-text)] font-bold">{rec.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATALOG 4: PASSES */}
      {activeCatalog === 'passes' && (
        <div className="space-y-3 text-xs">
          <div className="spa-card p-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[var(--accent-primary-text)]" />
              Sesiones Arthur Ashe (US Open)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {tripData.sportsTravelerPackage.sessions.map((sess, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="font-bold text-[var(--text-primary)]">{sess.session} · {sess.name}</div>
                  <p className="text-[11px] text-[var(--accent-primary-text)] font-mono mt-0.5">{sess.date} - {sess.time}</p>
                  <p className="text-[var(--text-muted)] text-[11px] mt-1">{sess.stadium} · Promenade / Loge</p>
                </div>
              ))}
            </div>
          </div>

          <div className="spa-card p-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-cyan-500" />
              Go City Explorer Pass (3 Atracciones)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {tripData.goCityPass.attractions.map((att) => (
                <div key={att.id} className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <span className="font-bold text-[var(--text-primary)] block">{att.name}</span>
                  <span className="text-[11px] text-cyan-500 font-bold block mt-0.5">{att.window}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-1">{att.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATALOG 5: BOOKS */}
      {activeCatalog === 'books' && (
        <div className="space-y-3">
          <div className="spa-card p-3 flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-[var(--text-primary)]">
              Wishlist de Libros Strand & Tech
            </span>
            <button
              onClick={onOpenNewBook}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Alta de Libro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {(tripData.strandBooksList || []).map((b) => (
              <div
                key={b.id}
                className="spa-card p-3 flex items-start justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-bold text-orange-500 uppercase">{b.category}</span>
                  <h4 className="font-bold text-[var(--text-primary)] mt-0.5">{b.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">{b.author}</p>
                </div>
                <button
                  onClick={() => onDeleteBook(b.id)}
                  className="p-1 text-[var(--text-muted)] hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATALOG 6: BUDGET */}
      {activeCatalog === 'budget' && (
        <div className="space-y-3">
          <div className="spa-card p-3">
            <span className="font-heading font-bold text-sm text-[var(--text-primary)]">
              Auditoría de Gastos Registrados
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {(tripData.budgetExpenses || []).map((exp) => (
              <div
                key={exp.id}
                className="spa-card p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">{exp.concept}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{exp.date} · {exp.payer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-500 text-sm">
                    ${exp.amountUSD} USD
                  </span>
                  <button
                    onClick={() => onDeleteExpense(exp.id)}
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
