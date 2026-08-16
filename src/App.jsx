import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroDashboard from './components/HeroDashboard';
import LiveTripCompanion from './components/LiveTripCompanion';
import ItineraryView from './components/ItineraryView';
import ActivityModal from './components/ActivityModal';
import PendingModal from './components/PendingModal';
import PendingListView from './components/PendingListView';
import NearbySheet from './components/NearbySheet';
import { useNearby } from './hooks/useNearby';
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
import { LocationProvider } from './context/LocationContext';
import { loadTripData, saveTripData } from './utils/storage';
import { confirmAction, notify } from './utils/alerts';
import ReminderSettingsSheet from './components/ReminderSettingsSheet';
import SessionWarningModal from './components/SessionWarningModal';
import {
  isReminderDueToday,
  dismissReminderForToday,
  getTodayKey,
  getReminderSettings,
  saveReminderSettings,
  clearDismissal
} from './utils/dailyReminder';
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
  const [isReminderSheetOpen, setIsReminderSheetOpen] = useState(false);
  const [isNearbySheetOpen, setIsNearbySheetOpen] = useState(false);
  const [reminderSettings, setReminderSettings] = useState(() => getReminderSettings());
  const [showMomReminder, setShowMomReminder] = useState(() => isReminderDueToday());

  // Auto-persist to localStorage on state changes
  useEffect(() => {
    saveTripData(tripData);
  }, [tripData]);

  // Daily reminder (message + hour configurable from Menú → Recordatorio de
  // llamada). Best-effort: only fires while the app is open (no push server
  // here), backstopped by the persistent banner below in case the exact
  // minute is missed.
  useEffect(() => {
    if (!reminderSettings.enabled) {
      setShowMomReminder(false);
      return;
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    let lastFiredKey = null;
    const checkReminder = () => {
      if (!isReminderDueToday(reminderSettings)) return;
      setShowMomReminder(true);
      const todayKey = getTodayKey();
      if (lastFiredKey === todayKey) return;
      lastFiredKey = todayKey;
      notify(reminderSettings.message, 'info');
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('NYC · US Open 2026', { body: reminderSettings.message, icon: '/icon-192.png' });
        } catch {
          // Some browsers (notably iOS PWA) restrict the Notification constructor — the toast above still covers it.
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [reminderSettings]);

  const handleSaveReminder = (next) => {
    const saved = saveReminderSettings(next);
    // A changed hour/message should be able to fire again today rather than
    // staying suppressed by an earlier "ya le hablé".
    clearDismissal();
    setReminderSettings(saved);
    setShowMomReminder(isReminderDueToday(saved));
    notify('Recordatorio actualizado', 'success');
  };

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

  // Which day the location suggestions reason about. Prefers the trip day
  // that matches today's real date; outside the trip window it falls back to
  // the first day that still has something pending, so the "de camino" list
  // has a destination to aim at instead of going blank.
  const activeDay = useMemo(() => {
    const todayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
    const matched = tripData.days.find(d => d.isoDate === todayKey);
    if (matched) return matched;
    return tripData.days.find(d => d.timeline.some(t => !t.completed && t.status !== 'hecho'))
      || tripData.days[0];
  }, [tripData.days]);

  // Mounted here, above the popup, so the proximity alerts keep firing even
  // while the "cerca de ti" sheet is closed.
  const nearbyData = useNearby(tripData.recommendations, activeDay);

  // Hard gate: nothing renders — not even the printable report — until
  // there's a live session. This is also the expiry path: when the session
  // times out AuthContext clears currentUser, so the whole tree unmounts
  // back to the sign-in screen rather than leaving content on screen.
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
        onOpenReminderSettings={() => setIsReminderSheetOpen(true)}
        reminderMessage={reminderSettings.message}
        onOpenNearby={() => setIsNearbySheetOpen(true)}
        nearbyCount={nearbyData.total}
        nearbyActive={nearbyData.status === 'ready'}
      />

      {/* Daily reminder banner — visible on every tab from 8pm CDMX until dismissed for the day */}
      {showMomReminder && (
        <div className="page-x pt-5">
          <div className="spa-card p-4 flex items-center gap-3.5 border-[color-mix(in_srgb,var(--accent-rose)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent-rose)_8%,var(--bg-surface))]">
            <span className="spa-tile flex-shrink-0 bg-[color-mix(in_srgb,var(--accent-rose)_16%,transparent)] text-[var(--accent-rose-text)]">
              <Phone className="w-4 h-4" />
            </span>
            <button
              onClick={() => setIsReminderSheetOpen(true)}
              className="flex-1 text-left text-[13px] sm:text-sm font-bold text-[var(--text-primary)] leading-snug"
              title="Editar este recordatorio"
            >
              {reminderSettings.message}
            </button>
            <button
              onClick={() => { dismissReminderForToday(); setShowMomReminder(false); }}
              className="spa-btn spa-btn-ghost h-10 min-h-0 px-4 text-xs flex-shrink-0"
            >
              <Check className="w-3.5 h-3.5 text-[var(--accent-emerald-text)]" />
              <span className="hidden xs:inline">Ya le hablé</span>
            </button>
          </div>
        </div>
      )}

      {/* Main container — `page-x` owns horizontal rhythm app-wide, `stack`
          owns the breathing room between top-level sections. */}
      <main className="flex-1 page-x py-7 sm:py-12 stack mobile-safe-bottom">

        {/* Tab 1: Itinerary — the "En Vivo" companion has its own dedicated
            tab, so it isn't duplicated here; this screen stays focused on
            the trip overview + day-by-day plan instead of stacking both. */}
        {currentTab === 'itinerary' && (
          <div className="stack w-full">
            <HeroDashboard
              tripData={tripData}
              onOpenNewActivity={() => handleOpenNewActivity(1)}
              onOpenTasks={() => setIsPendingModalOpen(true)}
              onNavigateTab={setCurrentTab}
            />


            <ItineraryView
              tripData={tripData}
              onChangeActivityStatus={handleChangeActivityStatus}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onMoveActivity={handleMoveActivity}
              onAddActivityToDay={(dayNum) => handleOpenNewActivity(dayNum)}
            />
          </div>
        )}

        {/* Tab 2: En Vivo Dedicated View */}
        {currentTab === 'live' && (
          <LiveTripCompanion
            tripData={tripData}
            onChangeActivityStatus={handleChangeActivityStatus}
            onEditActivity={handleEditActivity}
          />
        )}

        {/* Tab 3: Pendientes */}
        {currentTab === 'pendientes' && (
          <PendingListView
            tasks={tripData.urgentTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onOpenManager={() => setIsPendingModalOpen(true)}
          />
        )}

        {/* Tab 4: Recommendations */}
        {currentTab === 'recommendations' && (
          <RecommendationsView
            recommendations={tripData.recommendations}
            onToggleVisited={handleToggleVisitedRec}
            onDeleteRecommendation={handleDeleteRecommendation}
            onOpenNewRec={() => setIsRecModalOpen(true)}
            onOpenImportExport={() => setIsImportExportModalOpen(true)}
          />
        )}

        {/* Tab 5: US Open & Pases */}
        {currentTab === 'usopen' && (
          <USOpenPassView
            tripData={tripData}
            onUpdateHoneyDeuce={handleUpdateHoneyDeuce}
            onToggleGoCityAttraction={handleToggleGoCityAttraction}
          />
        )}

        {/* Tab 6: Admin Panel / CMS */}
        {currentTab === 'admin' && (
          <div className="w-full">
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
          <UserManagementView
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* Tab 8: Guía Pro */}
        {currentTab === 'guide' && (
          <div className="stack w-full">
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
          <BudgetView
            expenses={tripData.budgetExpenses || []}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

      </main>

      {/* Footer — hidden behind the tab bar on phones, so it only shows where
          there's room for it. */}
      <footer className="hidden xl:block w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-10 mt-10">
        <div className="page-x text-center space-y-1.5">
          <p className="font-bold text-sm text-[var(--text-secondary)]">NYC · US Open 2026 · Lalo &amp; Fefe · 4–10 septiembre</p>
          <p className="text-xs text-[var(--text-muted)]">PWA offline · Todos los cambios se guardan automáticamente en tu dispositivo</p>
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

      <ReminderSettingsSheet
        isOpen={isReminderSheetOpen}
        onClose={() => setIsReminderSheetOpen(false)}
        settings={reminderSettings}
        onSave={handleSaveReminder}
      />

      <NearbySheet
        isOpen={isNearbySheetOpen}
        onClose={() => setIsNearbySheetOpen(false)}
        data={nearbyData}
      />

      {/* Renders itself only during the last two minutes of the session. */}
      <SessionWarningModal />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          {/* Inside AuthProvider so the location prompt only appears once
              someone is actually signed in and looking at the trip, rather
              than firing behind the login gate. */}
          <LocationProvider>
            <MainAppContent />
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
