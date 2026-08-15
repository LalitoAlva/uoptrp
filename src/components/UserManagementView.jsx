import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Crown, 
  Edit3, 
  Eye, 
  Mail, 
  Check, 
  ArrowRight,
  LogOut,
  Shield,
  Key
} from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { confirmAction, notify } from '../utils/alerts';
import confetti from 'canvas-confetti';

export default function UserManagementView({ onOpenLoginModal }) {
  const { users, currentUser, addUser, updateUserRole, deleteUser, isAdmin, switchUser, logout } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    addUser({
      email: newEmail.trim(),
      name: newName.trim() || newEmail.split('@')[0],
      role: newRole
    });
    setNewEmail('');
    setNewName('');
    setNewRole('editor');
    setInvitedSuccess(true);
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    setTimeout(() => setInvitedSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Header Banner */}
      <div className="spa-card p-8 sm:p-10 border border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)]">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary-text)]">
                Control de Acceso & Colaboradores
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-[var(--text-primary)] tracking-tight">
              Administración de Usuarios & Permisos
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
              Gestiona los colaboradores con acceso al viaje NYC 2026. Asigna roles de Administrador, Editor o Lector y controla quién puede modificar el itinerario o registrar gastos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2.5 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Cambiar Perfil / Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Active Session Spotlight Card */}
      <div className="spa-card p-6 sm:p-8 border-l-4 border-l-[var(--accent-primary)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name} 
              className="w-14 h-14 rounded-full border-2 border-[var(--border-medium)] shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--text-muted)] font-medium">Sesión Activa:</span>
                <h3 className="text-lg font-heading font-black text-[var(--text-primary)]">
                  {currentUser?.name}
                </h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                  currentUser?.role === 'admin' 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : currentUser?.role === 'editor'
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary-text)] border border-[var(--accent-primary)]/20'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}>
                  {currentUser?.role === 'admin' ? <><Crown className="w-3 h-3 inline mr-1" />Administrador Total</> : currentUser?.role === 'editor' ? <><Edit3 className="w-3 h-3 inline mr-1" />Editor de Viaje</> : <><Eye className="w-3 h-3 inline mr-1" />Modo Lectura</>}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold text-rose-500 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión (Modo Lector)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Form on left/top, Users Table on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Invite New User Form */}
        <div className="space-y-6">
          
          <div className="spa-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <UserPlus className="w-4 h-4 text-[var(--accent-primary-text)]" />
              <h3 className="font-heading font-bold text-base text-[var(--text-primary)]">
                Invitar Colaborador
              </h3>
            </div>

            {isAdmin ? (
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                    Nombre del Viajero
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Fefe, Carlos..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                    Correo de Google (Gmail)
                  </label>
                  <input
                    type="email"
                    placeholder="correo@gmail.com..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                    Rol y Nivel de Permisos
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                  >
                    <option value="editor">✏️ Editor (Puede editar actividades y gastos)</option>
                    <option value="viewer">👁️ Lector (Solo lectura)</option>
                    <option value="admin">👑 Administrador (Acceso y control total)</option>
                  </select>
                </div>

                {invitedSuccess && (
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>¡Usuario agregado exitosamente!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold rounded text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Agregar Usuario</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs space-y-2">
                <span className="font-bold flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Modo Restringido</span>
                <p>Solo los Administradores (Lalo) pueden dar de alta o modificar colaboradores del viaje.</p>
              </div>
            )}
          </div>

          {/* Roles Description Matrix */}
          <div className="spa-card p-6 space-y-3 text-xs">
            <h4 className="font-heading font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[var(--accent-primary-text)]" />
              Matriz de Permisos por Rol
            </h4>
            <div className="space-y-2 text-[var(--text-secondary)] text-[11px] leading-relaxed">
              <div className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-amber-500 flex items-center gap-1.5"><Crown className="w-3.5 h-3.5" /> Administrador (Lalo):</span>
                <p>Permisos totales: altas, bajas y cambios en todos los catálogos del CMS, gestión de usuarios, respaldos y configuración del viaje.</p>
              </div>
              <div className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--accent-primary-text)] flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> Editor (Fefe):</span>
                <p>Puede cambiar estados ("Hice esto", "Se puede quitar", "Omitir"), agregar paradas, registrar gastos y notas.</p>
              </div>
              <div className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--text-muted)] flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Lector (Familia / Invitado):</span>
                <p>Consulta el itinerario, clima y horarios en vivo sin riesgo de modificar o borrar información.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Authorized Users Table */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="spa-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[var(--text-primary)]">
                  Usuarios con Acceso Autorizado ({users.length})
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Haz clic en cualquier usuario para cambiar de perfil instantáneamente
                </p>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    className={`p-4 sm:p-5 rounded-md border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/40 shadow-sm'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img 
                        src={u.avatar} 
                        alt={u.name} 
                        className="w-10 h-10 rounded-full border border-[var(--border-medium)] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[var(--text-primary)] truncate">{u.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-[var(--accent-primary)] text-white">
                              Activo Ahora
                            </span>
                          )}
                          {u.isOwner && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                              Propietario
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[var(--text-muted)] font-mono block mt-0.5 truncate">{u.email}</span>
                      </div>
                    </div>

                    {/* Role & Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-subtle)]">
                      {isAdmin && !u.isOwner ? (
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded px-3 py-1.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                        >
                          <option value="admin">👑 Admin</option>
                          <option value="editor">✏️ Editor</option>
                          <option value="viewer">👁️ Lector</option>
                        </select>
                      ) : (
                        <span className="text-xs font-bold text-[var(--text-secondary)] px-2 py-1 flex items-center gap-1.5">
                          {u.role === 'admin' ? <Crown className="w-3.5 h-3.5" /> : u.role === 'editor' ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {u.role === 'admin' ? 'Admin' : u.role === 'editor' ? 'Editor' : 'Lector'}
                        </span>
                      )}

                      {!isCurrent && (
                        <button
                          onClick={() => switchUser(u.id)}
                          className="px-3 py-1.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--accent-primary-text)] flex items-center gap-1 transition-colors"
                        >
                          <span>Usar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {isAdmin && !u.isOwner && (
                        <button
                          onClick={async () => {
                            const confirmed = await confirmAction({
                              title: 'Eliminar acceso',
                              text: `¿Deseas eliminar el acceso de ${u.name}? Podrás volver a invitarlo después.`,
                              confirmText: 'Eliminar',
                              danger: true
                            });
                            if (confirmed) {
                              deleteUser(u.id);
                              notify(`Acceso de ${u.name} eliminado`, 'success');
                            }
                          }}
                          className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                          title="Eliminar acceso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
