import React from 'react';
import { Printer, ArrowLeft, MapPin, AlertTriangle, TennisBall, Ticket, Lock, Lightbulb, Check, BookOpen, iconForEmoji } from '../utils/icons';

export default function PrintableReport({ tripData, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Floating Action Controls Bar (Hidden during print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-4 sticky top-4 z-40">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la App Interactiva</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-heading font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 stroke-[2.5]" />
          <span>Imprimir Itinerario / Guardar PDF</span>
        </button>
      </div>

      {/* Main Printable Document Canvas (Designed like an editorial print sheet) */}
      <article className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl space-y-8 border border-slate-200 print:p-0 print:border-none print:shadow-none font-sans">
        
        {/* Document Cover / Header */}
        <header className="border-b-2 border-slate-900 pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-widest bg-slate-950 text-white px-2.5 py-1 rounded-lg">
              Plan Maestro de Viaje · 2026
            </span>
            <span className="font-mono text-xs font-bold text-slate-600">
              Documento Oficial
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-serif">
            Nueva York & US Open 2026
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-700">
            <div>
              <span className="font-bold block text-slate-900 uppercase text-[10px]">Viajeros:</span>
              <span>{tripData.metadata.travelers} (Lalo & Fefe)</span>
            </div>
            <div>
              <span className="font-bold block text-slate-900 uppercase text-[10px]">Fechas:</span>
              <span>{tripData.metadata.dates} (7 días)</span>
            </div>
            <div>
              <span className="font-bold block text-slate-900 uppercase text-[10px]">Hotel:</span>
              <span>Marriott Marquis Times Square</span>
            </div>
          </div>
        </header>

        {/* Section 1: Urgent Requirements & Tasks */}
        <section className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Checklist de Pendientes & Reservaciones Clave</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {tripData.urgentTasks.map((t) => (
              <div key={t.id} className="p-2.5 rounded-lg border border-slate-300 bg-slate-50 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${t.completed ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                  <span className="font-bold text-slate-900">{t.text}</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-3.5">{t.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Passes & Packages */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-900 space-y-1.5">
            <h3 className="font-bold text-xs text-slate-950 uppercase flex items-center gap-1.5">
              <TennisBall className="w-3 h-3" />
              Paquete Sports Traveler (4 Sesiones Arthur Ashe)
            </h3>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              {tripData.sportsTravelerPackage.sessions.map((s, i) => (
                <li key={i} className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span><strong>{s.session}:</strong> {s.name} ({s.date})</span>
                  <span className="font-mono text-slate-900">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-900 space-y-1.5">
            <h3 className="font-bold text-xs text-slate-950 uppercase flex items-center gap-1.5">
              <Ticket className="w-3 h-3" />
              Go City Explorer Pass (3 Atracciones)
            </h3>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              {tripData.goCityPass.attractions.map((a, i) => (
                <li key={i} className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span><strong>{a.name}</strong></span>
                  <span className="font-mono text-slate-600">{a.window}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3: Daily Itineraries (Day 1 to Day 7) */}
        <section className="space-y-6">
          {tripData.days.map((day, dIdx) => (
            <div 
              key={day.dayNumber} 
              className={`space-y-3 ${dIdx > 0 ? 'page-break pt-4' : ''}`}
            >
              <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white text-slate-950 font-bold flex items-center justify-center text-xs">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-serif font-black text-sm sm:text-base">
                      {day.date} — {day.title}
                    </h3>
                    <span className="text-[10px] text-slate-300 font-mono">{day.badge}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
                {day.timeline.map((item) => {
                  const currentStatus = item.status || (item.completed ? 'hecho' : 'pendiente');
                  const TravelIcon = item.travelFromPrev ? iconForEmoji(item.travelFromPrev.icon) : null;
                  const TipIcon = item.insiderTip ? iconForEmoji(item.insiderTip.icon) : null;
                  return (
                    <div key={item.id} className="p-2.5 flex items-start gap-2.5 hover:bg-slate-50">
                      <span className="font-mono font-bold text-slate-900 w-12 flex-shrink-0">
                        {item.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        {item.travelFromPrev && (
                          <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                            <TravelIcon className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                            <span>{item.travelFromPrev.text}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-slate-950 text-xs">
                            {item.title}
                          </h4>
                          {currentStatus === 'fijo' && (
                            <span className="text-[8px] font-bold px-1 rounded-lg bg-indigo-100 text-indigo-800 inline-flex items-center gap-0.5">
                              <Lock className="w-2 h-2" /> Inamovible
                            </span>
                          )}
                          {currentStatus === 'opcional' && (
                            <span className="text-[8px] font-bold px-1 rounded-lg bg-amber-100 text-amber-800 inline-flex items-center gap-0.5">
                              <Lightbulb className="w-2 h-2" /> Opcional
                            </span>
                          )}
                          {currentStatus === 'hecho' && (
                            <span className="text-[8px] font-bold px-1 rounded-lg bg-emerald-100 text-emerald-800 inline-flex items-center gap-0.5">
                              <Check className="w-2 h-2" /> Hecho
                            </span>
                          )}
                        </div>
                        {item.sub && (
                          <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                            {item.sub}
                          </p>
                        )}
                        {item.address && (
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" />
                            <span>{item.address}</span>
                          </div>
                        )}
                        {item.insiderTip && (
                          <div className="text-[10px] text-amber-700 mt-0.5 flex items-center gap-1">
                            <TipIcon className="w-2.5 h-2.5 text-amber-600 flex-shrink-0" />
                            <span>{item.insiderTip.text}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {day.tips && day.tips.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950 space-y-0.5">
                  <span className="font-bold uppercase text-[9px] flex items-center gap-1 text-amber-900">
                    <Lightbulb className="w-2.5 h-2.5" /> Tips del Día {day.dayNumber}:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                    {day.tips.map((t, ti) => (
                      <li key={ti}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Section 4: Strand Books */}
        <section className="page-break space-y-3 pt-4 border-t-2 border-slate-900 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Wishlist de Libros Strand & Tech
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(tripData.strandBooksList || []).map((b) => (
              <div key={b.id} className="p-2 rounded-lg border border-slate-300 bg-slate-50">
                <span className="text-[9px] font-bold text-slate-500 uppercase">{b.category}</span>
                <h4 className="font-bold text-slate-900 text-xs">{b.title}</h4>
                <p className="text-[11px] text-slate-600">{b.author} · {b.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-300 pt-4 text-center text-xs text-slate-500">
          <p className="font-serif">Viaje NYC & US Open 2026 · Lalo & Fefe · Generado para consulta e impresión</p>
        </footer>

      </article>

    </div>
  );
}
