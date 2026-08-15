import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckSquare,
  Sparkles,
  Trophy,
  DollarSign,
  Plus,
  Compass,
  Car,
  Sun,
  Moon,
  Database,
  Printer,
  Zap,
  Users,
  Type,
  Menu,
  X as CloseIcon,
  Crown,
  Edit3,
  Eye,
  LogOut
} from '../utils/icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  currentTab,
  setCurrentTab,
  urgentCount,
  onOpenNewActivity,
  onOpenEmergency,
  onOpenLogin
}) {
  const { isDark, toggleTheme, fontSize, cycleFontSize } = useTheme();
  const { currentUser, logout } = useAuth();
  const [cdmxTime, setCdmxTime] = useState('');
  const [nycTime, setNycTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const cdmxStr = new Intl.DateTimeFormat('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);

      const nycStr = new Intl.DateTimeFormat('es-MX', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);

      setCdmxTime(cdmxStr);
      setNycTime(nycStr);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll + close on Escape while the menu drawer is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Core: quick-access items for the mobile thumb bar (max 4 + "Menú" = 5 total)
  const primaryNavItems = [
    { id: 'itinerary', label: 'Itinerario', icon: Calendar },
    { id: 'live', label: 'En Vivo', icon: Zap },
    { id: 'pendientes', label: 'Pendientes', icon: CheckSquare, badge: urgentCount > 0 ? urgentCount : null },
    { id: 'usopen', label: 'US Open', icon: Trophy },
  ];

  // Reference & planning screens
  const secondaryNavItems = [
    { id: 'recommendations', label: 'Recomendaciones', icon: Sparkles },
    { id: 'guide', label: 'Guía Pro', icon: Compass },
    { id: 'budget', label: 'Gastos', icon: DollarSign },
  ];

  // Meta / configuration screens, kept visually separate from the trip experience
  const adminNavItems = [
    { id: 'admin', label: 'Catálogos CMS', icon: Database },
    { id: 'users', label: 'Usuarios', icon: Users },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems, ...adminNavItems];
  const isSecondaryTabActive = [...secondaryNavItems, ...adminNavItems].some(item => item.id === currentTab);

  const getFontSizeLabel = () => {
    if (fontSize === 'xlarge') return 'A+ Grande (130%)';
    if (fontSize === 'large') return 'A Mediana (115%)';
    return 'A Normal (100%)';
  };

  const goTo = (tabId) => {
    setCurrentTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Centered at 95% Width */}
      <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-3 transition-colors shadow-xs">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Left cluster: hamburger (below xl) + Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded transition-colors active:scale-95 ${
                isSecondaryTabActive
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
              }`}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div
              onClick={() => setCurrentTab('itinerary')}
              className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 select-none min-w-0"
            >
              <div className="w-8 h-8 rounded bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-heading font-black text-sm sm:text-base text-[var(--text-primary)] tracking-tight">
                    NYC <span className="text-[var(--accent-primary-text)]">2026</span>
                  </span>
                  <span className="hidden sm:inline text-[10px] font-mono font-bold bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] px-1.5 py-0.2 rounded">
                    US OPEN
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-[var(--text-muted)] font-semibold">Lalo & Fefe · 4–10 Sep</p>
              </div>
            </div>
          </div>


          {/* Right Utilities & User Profile Actions */}
          <div className="flex items-center gap-2">

            {/* Clocks */}
            <div className="hidden md:flex h-9 items-center gap-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] px-3 rounded text-xs font-mono text-[var(--text-secondary)]">
              <span>CDMX <strong className="text-[var(--text-primary)]">{cdmxTime}</strong></span>
              <span className="text-[var(--border-strong)]">|</span>
              <span className="text-[var(--accent-primary-text)] font-bold">NYC <strong>{nycTime}</strong></span>
            </div>

            {/* Font Size Toggle Button */}
            <button
              onClick={cycleFontSize}
              className="h-9 flex items-center gap-1.5 px-2.5 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-xs transition-all active:scale-95"
              title={`Tamaño de letra: ${getFontSizeLabel()}`}
              aria-label={`Cambiar tamaño de letra. Actual: ${getFontSizeLabel()}`}
            >
              <Type className="w-4 h-4 text-[var(--accent-primary-text)]" />
              <span className="text-[11px] font-mono">
                {fontSize === 'xlarge' ? 'A+++' : fontSize === 'large' ? 'A++' : 'A+'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title={isDark ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Print Button */}
            <button
              onClick={() => setCurrentTab('printable')}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Reporte Imprimible / PDF"
              aria-label="Ver reporte imprimible"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Taxi Emergency Button */}
            <button
              onClick={onOpenEmergency}
              className="hidden sm:flex h-9 px-3 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs items-center gap-1.5 transition-colors"
              title="Ficha para el taxista"
            >
              <Car className="w-4 h-4" />
              <span className="hidden lg:inline">Taxi & Hotel</span>
            </button>

            {/* Profile Switcher — local family profiles, not a real login */}
            <button
              onClick={onOpenLogin}
              className="hidden sm:flex h-9 items-center gap-2 px-2.5 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold transition-colors"
              title="Cambiar de perfil (Lalo / Fefe / Invitado)"
            >
              <img
                src={currentUser?.avatar}
                alt=""
                className="w-5 h-5 rounded-full border border-[var(--border-medium)]"
              />
              <div className="hidden lg:flex flex-col items-start leading-tight text-left">
                <span className="text-[var(--text-primary)]">{currentUser?.name}</span>
                <span className="text-[9px] text-[var(--accent-primary-text)] font-bold uppercase flex items-center gap-1">
                  {currentUser?.role === 'admin' ? <Crown className="w-2.5 h-2.5" /> : currentUser?.role === 'editor' ? <Edit3 className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                  {currentUser?.role === 'admin' ? 'Admin' : currentUser?.role === 'editor' ? 'Editor' : 'Lector'}
                </span>
              </div>
            </button>

            {/* Quick Logout — only shown when a real profile (not guest) is active */}
            {currentUser?.id !== 'guest' && (
              <button
                onClick={logout}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded bg-[var(--bg-surface-elevated)] hover:bg-rose-500/10 border border-[var(--border-subtle)] hover:border-rose-500/30 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                title="Cerrar sesión (pasar a Modo Lector)"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Add Activity Button */}
            <button
              onClick={onOpenNewActivity}
              className="h-9 px-3.5 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Parada</span>
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar — capped at 4 core tabs + Menú, per touch-nav best practice */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] px-2 py-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] shadow-xl">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-around">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded transition-all min-w-[56px] ${
                  isActive ? 'text-[var(--accent-primary-text)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[60px]">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-0 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded transition-all min-w-[56px] ${
              isSecondaryTabActive ? 'text-[var(--accent-primary-text)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Menú</span>
          </button>
        </div>
      </div>

      {/* Full Navigation Menu Drawer — every screen, grouped, always reachable */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in-backdrop"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-[85vw] sm:w-[380px] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] shadow-2xl flex flex-col animate-in-panel">

            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] flex-shrink-0">
              <h2 className="font-heading font-black text-lg text-[var(--text-primary)]">Menú</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]"
                aria-label="Cerrar menú"
              >
                <CloseIcon className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2">Tu Viaje</span>
                {[...primaryNavItems, ...secondaryNavItems].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2">Administración</span>
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goTo(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2">Accesos Rápidos</span>
                <button
                  onClick={() => { setCurrentTab('printable'); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Printer className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className="flex-1 text-left">Reporte Imprimible / PDF</span>
                </button>
                <button
                  onClick={() => { onOpenEmergency(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <Car className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className="flex-1 text-left">Ficha Taxi & Hotel</span>
                </button>
                <button
                  onClick={() => { onOpenLogin(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <img src={currentUser?.avatar} alt="" className="w-4.5 h-4.5 rounded-full flex-shrink-0" />
                  <span className="flex-1 text-left">Perfil: {currentUser?.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
