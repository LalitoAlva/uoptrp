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
  LogOut,
  ChevronRight,
  Phone,
  Navigation
} from '../utils/icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  currentTab,
  setCurrentTab,
  urgentCount,
  onOpenNewActivity,
  onOpenEmergency,
  onOpenLogin,
  onOpenReminderSettings,
  reminderMessage,
  onOpenNearby,
  nearbyCount = 0,
  nearbyActive = false
}) {
  const { isDark, toggleTheme, fontSize, cycleFontSize } = useTheme();
  const { currentUser, logout } = useAuth();
  const [cdmxTime, setCdmxTime] = useState('');
  const [nycTime, setNycTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const format = (timeZone) => new Intl.DateTimeFormat('es-MX', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);

      setCdmxTime(format('America/Mexico_City'));
      setNycTime(format('America/New_York'));
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

  // Quick-access items for the mobile thumb bar (max 4 + "Menú" = 5 total)
  const primaryNavItems = [
    { id: 'itinerary', label: 'Itinerario', icon: Calendar, hint: 'Los 7 días, parada por parada' },
    { id: 'live', label: 'En Vivo', icon: Zap, hint: 'Qué sigue ahora mismo' },
    { id: 'pendientes', label: 'Pendientes', icon: CheckSquare, hint: 'Reservas y trámites antes del vuelo', badge: urgentCount > 0 ? urgentCount : null },
    { id: 'usopen', label: 'US Open', icon: Trophy, hint: 'Sesiones, pases y Honey Deuce' },
  ];

  const secondaryNavItems = [
    { id: 'recommendations', label: 'Recomendaciones', icon: Sparkles, hint: 'Lugares por descubrir' },
    { id: 'guide', label: 'Guía Pro', icon: Compass, hint: 'Metro, propinas, libros y tech' },
    { id: 'budget', label: 'Gastos', icon: DollarSign, hint: 'Presupuesto y gastos del viaje' },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Catálogos CMS', icon: Database, hint: 'Editar todo el contenido' },
    { id: 'users', label: 'Usuarios', icon: Users, hint: 'Perfiles y permisos' },
  ];

  const isSecondaryTabActive = [...secondaryNavItems, ...adminNavItems].some(item => item.id === currentTab);

  const getFontSizeLabel = () => {
    if (fontSize === 'xlarge') return 'Grande (130%)';
    if (fontSize === 'large') return 'Mediana (115%)';
    return 'Normal (100%)';
  };

  const goTo = (tabId) => {
    setCurrentTab(tabId);
    setIsMenuOpen(false);
  };

  const roleMeta = currentUser?.role === 'admin'
    ? { icon: Crown, label: 'Admin' }
    : currentUser?.role === 'editor'
      ? { icon: Edit3, label: 'Editor' }
      : { icon: Eye, label: 'Lector' };
  const RoleIcon = roleMeta.icon;

  /** Tall drawer row — icon tile, title, hint, chevron. Min 68px tall. */
  const DrawerRow = ({ item, isActive, onClick, tone }) => {
    const Icon = item.icon;
    const toneColor = tone || (isActive ? '#fff' : 'var(--accent-primary-text)');
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3.5 px-3 py-3.5 min-h-[4.25rem] rounded-2xl text-left transition-colors spa-pressable ${
          isActive
            ? 'bg-[var(--accent-primary)] text-white shadow-[0_10px_24px_-14px_var(--accent-primary)]'
            : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
        }`}
      >
        <span
          className="spa-tile flex-shrink-0"
          style={{
            backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : 'var(--bg-surface-elevated)',
            color: toneColor
          }}
        >
          <Icon className="w-5 h-5" />
        </span>

        <span className="flex-1 min-w-0">
          <span className="block font-heading font-bold text-[15px] leading-tight">{item.label}</span>
          {item.hint && (
            <span className={`block text-xs mt-0.5 leading-snug truncate ${isActive ? 'text-white/75' : 'text-[var(--text-muted)]'}`}>
              {item.hint}
            </span>
          )}
        </span>

        {item.badge ? (
          <span className="flex-shrink-0 min-w-[1.5rem] h-6 px-2 rounded-full bg-[var(--accent-rose)] text-white text-xs font-black flex items-center justify-center">
            {item.badge}
          </span>
        ) : (
          <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white/70' : 'text-[var(--text-muted)]'}`} />
        )}
      </button>
    );
  };

  return (
    <>
      {/* ── Sticky top header ────────────────────────────────────────────
          Mobile keeps only what a thumb needs: menu, identity, type size,
          theme and "add stop". Everything else moved into the drawer, which
          is what un-crowds the top of every screen on a phone. */}
      <header className="sticky top-0 z-40 w-full spa-blur border-b border-[var(--border-subtle)]">
        <div className="page-x h-[var(--header-h)] flex items-center justify-between gap-3">

          {/* Left: hamburger + wordmark */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`spa-tile-sm flex-shrink-0 transition-colors spa-pressable ${
                isSecondaryTabActive
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]'
              }`}
              aria-haspopup="dialog"
              aria-expanded={isMenuOpen}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentTab('itinerary')}
              className="flex items-center gap-2.5 min-w-0 text-left"
              aria-label="Ir al itinerario"
            >
              <span className="spa-tile-sm bg-[var(--accent-primary)] text-white flex-shrink-0">
                <Trophy className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading font-black text-[15px] leading-none tracking-tight text-[var(--text-primary)] whitespace-nowrap">
                  NYC <span className="text-[var(--accent-primary-text)]">2026</span>
                </span>
                <span className="hidden xs:block text-[10px] text-[var(--text-muted)] font-bold mt-0.5 leading-none">
                  US Open · Lalo &amp; Fefe
                </span>
              </span>
            </button>
          </div>

          {/* Right: utilities */}
          <div className="flex items-center gap-1.5">

            <div className="hidden lg:flex h-9 items-center gap-2 spa-surface-elevated px-3 text-xs font-mono text-[var(--text-secondary)]">
              <span>CDMX <strong className="text-[var(--text-primary)]">{cdmxTime}</strong></span>
              <span className="text-[var(--border-strong)]">|</span>
              <span className="text-[var(--accent-primary-text)] font-bold">NYC <strong>{nycTime}</strong></span>
            </div>

            {/* Hidden on phones: the header now carries nearby + taxi, which
                are street tools, and type size is one tap away in the drawer. */}
            <button
              onClick={cycleFontSize}
              className="hidden sm:flex spa-tile-sm bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors spa-pressable"
              title={`Tamaño de letra: ${getFontSizeLabel()}`}
              aria-label={`Cambiar tamaño de letra. Actual: ${getFontSizeLabel()}`}
            >
              <span className="font-heading font-black text-[13px] leading-none text-[var(--accent-primary-text)]">
                {fontSize === 'xlarge' ? 'A³' : fontSize === 'large' ? 'A²' : 'A¹'}
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className="spa-tile-sm bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] transition-colors spa-pressable"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* "Cerca de ti" — opens the location suggestions popup. The dot
                signals that something from the list is actually around. */}
            <button
              onClick={onOpenNearby}
              className={`relative spa-tile-sm transition-colors spa-pressable ${
                nearbyActive
                  ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-text)]'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
              }`}
              title="Qué tengo cerca"
              aria-label={nearbyCount > 0 ? `Cerca de ti: ${nearbyCount} lugares` : 'Qué tengo cerca'}
            >
              <Navigation className="w-4 h-4" />
              {nearbyCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] ring-2 ring-[var(--bg-surface)]" />
              )}
            </button>

            {/* Taxi card. Visible on phones too — showing the driver the
                hotel address is a street task, so hiding it below `md` was
                exactly backwards. */}
            <button
              onClick={onOpenEmergency}
              className="spa-tile-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors spa-pressable"
              title="Ficha para el taxista"
              aria-label="Ficha Taxi y Hotel"
            >
              <Car className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="hidden sm:flex h-9 items-center gap-2 pl-1 pr-3 rounded-full bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] transition-colors spa-pressable"
              title="Cambiar de perfil"
            >
              <img src={currentUser?.avatar} alt="" className="w-7 h-7 rounded-full" />
              <span className="hidden lg:flex flex-col items-start leading-none text-left">
                <span className="text-xs font-bold text-[var(--text-primary)]">{currentUser?.name}</span>
                <span className="text-[9px] text-[var(--accent-primary-text)] font-black uppercase flex items-center gap-1 mt-0.5">
                  <RoleIcon className="w-2.5 h-2.5" />
                  {roleMeta.label}
                </span>
              </span>
            </button>

            <button
              onClick={logout}
              className="hidden sm:flex spa-tile-sm bg-[var(--bg-surface-elevated)] hover:bg-[color-mix(in_srgb,var(--accent-rose)_14%,transparent)] text-[var(--text-muted)] hover:text-[var(--accent-rose-text)] transition-colors spa-pressable"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNewActivity}
              className="spa-btn spa-btn-primary h-9 min-h-0 px-3 sm:px-4 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Parada</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Bottom tab bar (phones & tablets) ────────────────────────────
          72px tall with a pill behind the active icon, so the current
          screen is obvious at a glance and every target clears 48px. */}
      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 z-50 spa-blur border-t border-[var(--border-subtle)] shadow-[var(--shadow-nav)] pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Navegación principal"
      >
        <div className="h-[var(--tabbar-h)] px-2 flex items-stretch justify-around max-w-xl mx-auto">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 spa-pressable"
              >
                <span
                  className={`relative flex items-center justify-center h-8 w-14 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  <Icon className="w-[1.15rem] h-[1.15rem]" />
                  {item.badge && (
                    <span className={`absolute top-0.5 right-2.5 w-2 h-2 rounded-full ring-2 ${
                      isActive ? 'bg-white ring-[var(--accent-primary)]' : 'bg-[var(--accent-rose)] ring-[var(--bg-surface)]'
                    }`} />
                  )}
                </span>
                <span className={`text-[10px] leading-none tracking-tight ${
                  isActive ? 'font-black text-[var(--text-primary)]' : 'font-bold text-[var(--text-muted)]'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 spa-pressable"
          >
            <span className={`flex items-center justify-center h-8 w-14 rounded-full transition-all duration-200 ${
              isSecondaryTabActive ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-muted)]'
            }`}>
              <Menu className="w-[1.15rem] h-[1.15rem]" />
            </span>
            <span className={`text-[10px] leading-none tracking-tight ${
              isSecondaryTabActive ? 'font-black text-[var(--text-primary)]' : 'font-bold text-[var(--text-muted)]'
            }`}>
              Menú
            </span>
          </button>
        </div>
      </nav>

      {/* ── Navigation drawer ────────────────────────────────────────────
          Every screen, grouped, with tall rows that describe themselves. */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-in-backdrop"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute top-0 left-0 h-full w-[88vw] max-w-[400px] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] shadow-2xl flex flex-col animate-in-panel">

            {/* Profile header doubles as the profile switcher */}
            <div className="flex-shrink-0 px-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-4">
                <span className="spa-eyebrow">Menú</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="spa-tile-sm bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] spa-pressable"
                  aria-label="Cerrar menú"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => { onOpenLogin(); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3.5 p-3 min-h-[4.25rem] rounded-2xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] transition-colors text-left spa-pressable"
              >
                <img src={currentUser?.avatar} alt="" className="w-12 h-12 rounded-full flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block font-heading font-black text-base text-[var(--text-primary)] truncate">
                    {currentUser?.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[var(--accent-primary-text)] mt-0.5">
                    <RoleIcon className="w-3 h-3" />
                    {roleMeta.label} · Cambiar perfil
                  </span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-xs font-mono text-[var(--text-muted)]">
                <span>CDMX <strong className="text-[var(--text-secondary)]">{cdmxTime}</strong></span>
                <span className="text-[var(--border-medium)]">·</span>
                <span>NYC <strong className="text-[var(--accent-primary-text)]">{nycTime}</strong></span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">

              <div className="space-y-1.5">
                <span className="spa-eyebrow px-2">Tu viaje</span>
                {[...primaryNavItems, ...secondaryNavItems].map((item) => (
                  <DrawerRow
                    key={item.id}
                    item={item}
                    isActive={currentTab === item.id}
                    onClick={() => goTo(item.id)}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <span className="spa-eyebrow px-2">Herramientas</span>
                <DrawerRow
                  item={{ label: 'Ficha Taxi & Hotel', hint: 'Muéstrasela al taxista', icon: Car }}
                  tone="var(--accent-amber-text)"
                  isActive={false}
                  onClick={() => { onOpenEmergency(); setIsMenuOpen(false); }}
                />
                <DrawerRow
                  item={{
                    label: 'Recordatorio de llamada',
                    hint: reminderMessage ? `Ahora: “${reminderMessage}”` : 'Editar el aviso diario',
                    icon: Phone
                  }}
                  tone="var(--accent-rose-text)"
                  isActive={false}
                  onClick={() => { onOpenReminderSettings(); setIsMenuOpen(false); }}
                />
                <DrawerRow
                  item={{ label: 'Reporte imprimible', hint: 'Versión PDF de todo el viaje', icon: Printer }}
                  isActive={currentTab === 'printable'}
                  onClick={() => goTo('printable')}
                />
                <DrawerRow
                  item={{
                    label: isDark ? 'Modo claro' : 'Modo oscuro',
                    hint: `Ahora: ${isDark ? 'oscuro' : 'claro'}`,
                    icon: isDark ? Sun : Moon
                  }}
                  tone={isDark ? 'var(--accent-amber-text)' : 'var(--accent-indigo-text)'}
                  isActive={false}
                  onClick={toggleTheme}
                />
                <DrawerRow
                  item={{ label: 'Tamaño de letra', hint: `Ahora: ${getFontSizeLabel()}`, icon: Type }}
                  isActive={false}
                  onClick={cycleFontSize}
                />
              </div>

              <div className="space-y-1.5">
                <span className="spa-eyebrow px-2">Administración</span>
                {adminNavItems.map((item) => (
                  <DrawerRow
                    key={item.id}
                    item={item}
                    isActive={currentTab === item.id}
                    onClick={() => goTo(item.id)}
                  />
                ))}
                {/* Always available: sessions are real Google sign-ins now,
                    and logging out returns to the sign-in gate. */}
                <DrawerRow
                  item={{ label: 'Cerrar sesión', hint: `Salir de la cuenta de ${currentUser?.name}`, icon: LogOut }}
                  tone="var(--accent-rose-text)"
                  isActive={false}
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
