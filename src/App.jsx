import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroDashboard from './components/HeroDashboard';
import LiveTripCompanion from './components/LiveTripCompanion';
import ItineraryView from './components/ItineraryView';
import ActivityModal from './components/ActivityModal';
import PendingModal from './components/PendingModal';
import RecommendationsView from './components/RecommendationsView';
import RecommendationModal from './components/RecommendationModal';
import ImportExportModal from './components/ImportExportModal';
import USOpenPassView from './components/USOpenPassView';
import BooksTechView from './components/BooksTechView';
import BudgetView from './components/BudgetView';
import SurvivalGuideView from './components/SurvivalGuideView';
import EmergencyHotelCard from './components/EmergencyHotelCard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoginModal from './components/LoginModal';
import UserManagementView from './components/UserManagementView';
import AdminPanel from './components/AdminPanel';
import PrintableReport from './components/PrintableReport';
import ErrorBoundary from './components/ErrorBoundary';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { loadTripData, saveTripData } from './utils/storage';
import { confirmAction, notify } from './utils/alerts';
import { isReminderDueToday, dismissReminderForToday, getTodayKey } from './utils/dailyReminder';
import { Phone, Check } from './utils/icons';

function MainAppContent() {
  const { currentUser } = useAuth();
  const [tripData, setTripData] = useState(() => loadTripData());
  const [currentTab, setCurrentTab] = useState('itinerary');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [defaultDayForModal, setDefaultDayForModal] = useState(1);

  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showMomReminder, setShowMomReminder] = useState(() => isReminderDueToday());

  // Auto-persist to localStorage on state changes
  useEffect(() => {
    saveTripData(tripData);
  }, [tripData]);

  // Daily 8pm CDMX reminder to call home. Best-effort: only fires while the
  // app is open (no push server here), backstopped by the persistent banner
  // below in case the exact minute is missed.
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    let lastFiredKey = null;
    const checkReminder = () => {
      if (!isReminderDueToday()) return;
      setShowMomReminder(true);
      const todayKey = getTodayKey();
      if (lastFiredKey === todayKey) return;
      lastFiredKey = todayKey;
      notify('📞 Son las 8pm en CDMX — ¡no olvides llamar a la mamita preciosa!', 'info');
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('NYC · US Open 2026', { body: 'Llama a la mamita preciosa 💛', icon: '/icon-192.png' });
        } catch {
          // Some browsers (notably iOS PWA) restrict the Notification constructor — the toast above still covers it.
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, []);

  // ACTIVITY STATUS & CRUD
  const handleChangeActivityStatus = (dayNumber, activityId, newStatus) => {
    setTripData(prev => {
      const updatedDays = prev.days.map(d => {
        if (d.dayNumber !== dayNumber) return d;
        const updatedTimeline = d.timeline.map(t => {
          if (t.id !== activityId) return t;
          return { 
            ...t, 
            status: newStatus,
            completed: newStatus === 'hecho'
          };
        });
        return { ...d, timeline: updatedTimeline };
      });
      return { ...prev, days: updatedDays };
    });
  };

  const handleOpenNewActivity = (dayNum = 1) => {
    setEditingActivity(null);
    setDefaultDayForModal(dayNum);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (dayNumber, activityItem) => {
    setEditingActivity({ ...activityItem, dayNumber });
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (activityData) => {
    setTripData(prev => {
      const targetDay = activityData.dayNumber;
      const isExisting = prev.days.some(d => d.timeline.some(t => t.id === activityData.id));

      const updatedDays = prev.days.map(d => {
        if (isExisting && d.dayNumber !== targetDay) {
          return {
            ...d,
            timeline: d.timeline.filter(t => t.id !== activityData.id)
          };
        }

        if (d.dayNumber === targetDay) {
          const existsInTarget = d.timeline.some(t => t.id === activityData.id);
          let newTimeline;
          if (existsInTarget) {
            newTimeline = d.timeline.map(t => t.id === activityData.id ? activityData : t);
          } else {
            newTimeline = [...d.timeline, activityData];
          }

          newTimeline.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
          return { ...d, timeline: newTimeline };
        }

        return d;
      });

      return { ...prev, days: updatedDays };
    });
    notify('Parada guardada en el itinerario', 'success');
  };

  const handleDeleteActivity = async (dayNumber, activityId) => {
    const confirmed = await confirmAction({
      title: 'Eliminar parada',
      text: '¿Seguro que deseas eliminar esta parada del itinerario? No se puede deshacer.',
      confirmText: 'Eliminar',
      danger: true
    });
    if (!confirmed) return;
    setTripData(prev => {
      const updatedDays = prev.days.map(d => {
        if (d.dayNumber !== dayNumber) return d;
        return {
          ...d,
          timeline: d.timeline.filter(t => t.id !== activityId)
        };
      });
      return { ...prev, days: updatedDays };
    });
    notify('Parada eliminada del itinerario', 'success');
  };

  const handleMoveActivity = (dayNumber, index, direction) => {
    setTripData(prev => {
      const updatedDays = prev.days.map(d => {
        if (d.dayNumber !== dayNumber) return d;
        const newTimeline = [...d.timeline];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newTimeline.length) return d;

        const temp = newTimeline[index];
        newTimeline[index] = newTimeline[targetIndex];
        newTimeline[targetIndex] = temp;

        return { ...d, timeline: newTimeline };
      });
      return { ...prev, days: updatedDays };
    });
  };

  // TASKS / PENDIENTES CRUD
  const handleToggleTask = (taskId) => {
    setTripData(prev => ({
      ...prev,
      urgentTasks: prev.urgentTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleAddTask = (newTask) => {
    setTripData(prev => ({
      ...prev,
      urgentTasks: [newTask, ...prev.urgentTasks]
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTripData(prev => ({
      ...prev,
      urgentTasks: prev.urgentTasks.filter(t => t.id !== taskId)
    }));
  };

  // RECOMMENDATIONS CRUD
  const handleToggleVisitedRec = (recId) => {
    setTripData(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(r => r.id === recId ? { ...r, visited: !r.visited } : r)
    }));
  };

  const handleSaveRecommendation = (newRec) => {
    setTripData(prev => ({
      ...prev,
      recommendations: [newRec, ...prev.recommendations]
    }));
    notify('Recomendación agregada', 'success');
  };

  const handleSaveBatchRecommendations = (batchArray) => {
    setTripData(prev => ({
      ...prev,
      recommendations: [...batchArray, ...prev.recommendations]
    }));
    notify(`${batchArray.length} recomendaciones importadas`, 'success');
  };

  const handleDeleteRecommendation = async (recId) => {
    const confirmed = await confirmAction({
      title: 'Eliminar recomendación',
      text: '¿Deseas eliminar esta recomendación? No se puede deshacer.',
      confirmText: 'Eliminar',
      danger: true
    });
    if (!confirmed) return;
    setTripData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r.id !== recId)
    }));
    notify('Recomendación eliminada', 'success');
  };

  // HONEY DEUCE & GO CITY
  const handleUpdateHoneyDeuce = (count) => {
    setTripData(prev => ({
      ...prev,
      honeyDeuceTracker: {
        ...(prev.honeyDeuceTracker || {}),
        currentCount: count
      }
    }));
  };

  const handleToggleGoCityAttraction = (attId) => {
    setTripData(prev => ({
      ...prev,
      goCityPass: {
        ...prev.goCityPass,
        attractions: prev.goCityPass.attractions.map(a => a.id === attId ? { ...a, completed: !a.completed } : a)
      }
    }));
  };

  // STRAND BOOKS
  const handleToggleBook = (bookId) => {
    setTripData(prev => ({
      ...prev,
      strandBooksList: (prev.strandBooksList || []).map(b => b.id === bookId ? { ...b, acquired: !b.acquired } : b)
    }));
  };

  const handleAddBook = (newBook) => {
    setTripData(prev => ({
      ...prev,
      strandBooksList: [newBook, ...(prev.strandBooksList || [])]
    }));
  };

  const handleDeleteBook = (bookId) => {
    setTripData(prev => ({
      ...prev,
      strandBooksList: (prev.strandBooksList || []).filter(b => b.id !== bookId)
    }));
  };

  // EXPENSES
  const handleAddExpense = (newExp) => {
    setTripData(prev => ({
      ...prev,
      budgetExpenses: [newExp, ...(prev.budgetExpenses || [])]
    }));
  };

  const handleDeleteExpense = (expId) => {
    setTripData(prev => ({
      ...prev,
      budgetExpenses: (prev.budgetExpenses || []).filter(e => e.id !== expId)
    }));
  };

  const handleRestoreTripData = (restored) => {
    setTripData(restored);
  };

  const urgentCount = tripData.urgentTasks.filter(t => !t.completed).length;

  // Hard gate: nothing renders — not even the printable report — until a
  // profile is chosen. Closing this modal isn't possible (mandatory).
  if (!currentUser) {
    return <LoginModal isOpen={true} onClose={() => {}} mandatory />;
  }

  if (currentTab === 'printable') {
    return (
      <PrintableReport
        tripData={tripData}
        onBack={() => setCurrentTab('itinerary')}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--accent-primary)] selection:text-white transition-colors">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        urgentCount={urgentCount}
        onOpenNewActivity={() => handleOpenNewActivity(1)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Daily reminder banner — visible on every tab from 8pm CDMX until dismissed for the day */}
      {showMomReminder && (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="spa-card p-4 sm:p-5 border-l-4 border-l-rose-500 bg-rose-500/5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-rose-500/10 text-rose-500 flex-shrink-0">
                <Phone className="w-4 h-4" />
              </span>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Ya son las 8pm en CDMX — no olvides llamar a la mamita preciosa
              </p>
            </div>
            <button
              onClick={() => { dismissReminderForToday(); setShowMomReminder(false); }}
              className="px-3.5 py-2 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Ya le hablé
            </button>
          </div>
        </div>
      )}

      {/* Main Container - 95% Centered Layout (w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8) */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-20 mobile-safe-bottom">

        {/* Tab 1: Itinerary — the "En Vivo" companion has its own dedicated
            tab, so it isn't duplicated here; this screen stays focused on
            the trip overview + day-by-day plan instead of stacking both. */}
        {currentTab === 'itinerary' && (
          <div className="space-y-16 sm:space-y-20 w-full">
            <section>
              <HeroDashboard
                tripData={tripData}
                onOpenNewActivity={() => handleOpenNewActivity(1)}
                onOpenTasks={() => setIsPendingModalOpen(true)}
                onNavigateTab={setCurrentTab}
              />
            </section>

            <section>
              <ItineraryView
                tripData={tripData}
                onChangeActivityStatus={handleChangeActivityStatus}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
                onMoveActivity={handleMoveActivity}
                onAddActivityToDay={(dayNum) => handleOpenNewActivity(dayNum)}
              />
            </section>
          </div>
        )}

        {/* Tab 2: En Vivo Dedicated View */}
        {currentTab === 'live' && (
          <div className="space-y-12 w-full">
            <LiveTripCompanion
              tripData={tripData}
              onChangeActivityStatus={handleChangeActivityStatus}
              onEditActivity={handleEditActivity}
              onNavigateToDay={(dayNum) => {}}
            />
          </div>
        )}

        {/* Tab 3: Pendientes */}
        {currentTab === 'pendientes' && (
          <div className="space-y-12 w-full">
            <div className="spa-card p-8 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[var(--text-primary)]">Pendientes & Reservas del Viaje</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Requisitos antes de abordar el vuelo</p>
              </div>
              <button
                onClick={() => setIsPendingModalOpen(true)}
                className="px-5 py-2.5 bg-[var(--accent-primary)] text-white font-bold text-xs rounded shadow-sm"
              >
                Abrir Gestor Completo
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripData.urgentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id)}
                  className={`spa-card p-5 cursor-pointer transition-all flex items-start gap-4 ${
                    t.completed ? 'opacity-60' : 'hover:border-[var(--border-medium)]'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs ${
                    t.completed ? 'bg-emerald-500 text-white font-bold' : 'border border-[var(--border-strong)]'
                  }`}>
                    {t.completed && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <span className={`font-bold text-sm text-[var(--text-primary)] block ${t.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                      {t.text}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono mt-1 block">{t.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Recommendations */}
        {currentTab === 'recommendations' && (
          <div className="space-y-12 w-full">
            <RecommendationsView
              recommendations={tripData.recommendations}
              onToggleVisited={handleToggleVisitedRec}
              onDeleteRecommendation={handleDeleteRecommendation}
              onOpenNewRec={() => setIsRecModalOpen(true)}
              onOpenImportExport={() => setIsImportExportModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 5: US Open & Pases */}
        {currentTab === 'usopen' && (
          <div className="space-y-12 w-full">
            <USOpenPassView
              tripData={tripData}
              onUpdateHoneyDeuce={handleUpdateHoneyDeuce}
              onToggleGoCityAttraction={handleToggleGoCityAttraction}
            />
          </div>
        )}

        {/* Tab 6: Admin Panel / CMS */}
        {currentTab === 'admin' && (
          <div className="space-y-12 w-full">
            <AdminPanel
              tripData={tripData}
              onChangeActivityStatus={handleChangeActivityStatus}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onOpenNewActivity={handleOpenNewActivity}
              onUpdatePendingTask={() => {}}
              onDeletePendingTask={handleDeleteTask}
              onOpenNewTask={() => setIsPendingModalOpen(true)}
              onDeleteRecommendation={handleDeleteRecommendation}
              onOpenNewRec={() => setIsRecModalOpen(true)}
              onOpenNewBook={() => {
                setCurrentTab('guide');
                notify('Usa el formulario de Strand Bookstore para agregar el libro 👇', 'info');
              }}
              onDeleteBook={handleDeleteBook}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        )}

        {/* Tab 7: Users & Permisos (Administración de Usuarios) */}
        {currentTab === 'users' && (
          <div className="space-y-12 w-full">
            <UserManagementView
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 8: Guía Pro */}
        {currentTab === 'guide' && (
          <div className="space-y-16 w-full">
            <SurvivalGuideView />
            <BooksTechView
              books={tripData.strandBooksList || []}
              onToggleBook={handleToggleBook}
              onAddBook={handleAddBook}
              onDeleteBook={handleDeleteBook}
            />
          </div>
        )}

        {/* Tab 9: Budget */}
        {currentTab === 'budget' && (
          <div className="space-y-12 w-full">
            <BudgetView
              expenses={tripData.budgetExpenses || []}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        )}

      </main>

      {/* Footer 95% Centered */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12 text-center text-xs text-[var(--text-muted)] space-y-1.5 mt-16">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-medium text-sm text-[var(--text-secondary)]">NYC · US Open 2026 · Lalo & Fefe · 4–10 septiembre</p>
          <p className="text-xs text-[var(--text-muted)]">PWA Offline Enabled · Todos los cambios se guardan automáticamente en tu dispositivo</p>
        </div>
      </footer>

      {/* Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        initialData={editingActivity}
        defaultDay={defaultDayForModal}
      />

      <PendingModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        tasks={tripData.urgentTasks}
        onToggleTask={handleToggleTask}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
      />

      <RecommendationModal
        isOpen={isRecModalOpen}
        onClose={() => setIsRecModalOpen(false)}
        onSaveRecommendation={handleSaveRecommendation}
        onSaveBatchRecommendations={handleSaveBatchRecommendations}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        tripData={tripData}
        onRestoreTripData={handleRestoreTripData}
        onAddBatchRecommendations={handleSaveBatchRecommendations}
      />

      <EmergencyHotelCard
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        tripData={tripData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <PWAInstallPrompt
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
