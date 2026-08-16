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
import PageHeader from './PageHeader';
import BottomSheet from './BottomSheet';
import { COUNTRY_CODES, PHONE_KINDS, emptyPhone, normalisePhones, formatPhone, hasPhone } from '../utils/phone';
import confetti from 'canvas-confetti';

export default function UserManagementView({ onOpenLoginModal }) {
  const { users, currentUser, addUser, updateUser, updateUserRole, deleteUser, isAdmin, logout } = useAuth();
  // Which row is in edit mode, and the in-progress values for it.
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    name: '', fullName: '', country: '', address: '', relationship: '',
    phones: { mobile: emptyPhone(), home: emptyPhone() },
    emergencyContactId: null
  });
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
    <div className="w-full space-y-7">

      <PageHeader
        eyebrow="Control de acceso"
        title="Usuarios & permisos"
        description="Quién puede entrar al viaje y qué puede hacer. Solo los correos de Gmail listados aquí logran iniciar sesión; el rol define si además pueden editar el itinerario y registrar gastos."
        icon={Users}
        actions={
          <button onClick={onOpenLoginModal} className="spa-btn spa-btn-primary min-h-[3rem]">
            <Key className="w-4 h-4" />
            Cambiar perfil / Iniciar sesión
          </button>
        }
      />

      {/* Current Active Session Spotlight Card */}
      <div className="spa-banner p-6 sm:p-8 border-l-4 border-l-[var(--accent-primary)] space-y-4">
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
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
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
              className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-bold text-rose-500 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
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
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
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
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--accent-primary)]"
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
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
                  >
                    <option value="editor">✏️ Editor (Puede editar actividades y gastos)</option>
                    <option value="viewer">👁️ Lector (Solo lectura)</option>
                    <option value="admin">👑 Administrador (Acceso y control total)</option>
                  </select>
                </div>

                {invitedSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>¡Usuario agregado exitosamente!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold rounded-lg text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Agregar Usuario</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs space-y-2">
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
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-amber-500 flex items-center gap-1.5"><Crown className="w-3.5 h-3.5" /> Administrador (Lalo):</span>
                <p>Permisos totales: altas, bajas y cambios en todos los catálogos del CMS, gestión de usuarios, respaldos y configuración del viaje.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--accent-primary-text)] flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> Editor (Fefe):</span>
                <p>Puede cambiar estados ("Hice esto", "Se puede quitar", "Omitir"), agregar paradas, registrar gastos y notas.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
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
                  Cada uno entra con su propia cuenta de Google — esta lista solo controla quién tiene permiso
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
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-lg bg-[var(--accent-primary)] text-white">
                              Activo Ahora
                            </span>
                          )}
                          {u.isOwner && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                              Propietario
                            </span>
                          )}
                        </div>
                        {u.fullName && (
                          <span className="text-xs text-[var(--text-secondary)] block mt-0.5 truncate">{u.fullName}</span>
                        )}
                        {(hasPhone(u.phones?.mobile) || hasPhone(u.phones?.home)) && (
                          <span className="text-xs text-[var(--text-muted)] font-mono block mt-0.5 truncate">
                            {[
                              hasPhone(u.phones?.mobile) && `📱 ${formatPhone(u.phones.mobile)}`,
                              hasPhone(u.phones?.home) && `🏠 ${formatPhone(u.phones.home)}`
                            ].filter(Boolean).join('  ')}
                          </span>
                        )}
                        <span className="text-xs text-[var(--text-muted)] font-mono block mt-0.5 truncate">{u.email}</span>
                      </div>
                    </div>

                    {/* Role & Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-subtle)]">
                      {isAdmin && !u.isOwner ? (
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
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

                      {(isAdmin || isCurrent) && (
                        <button
                          onClick={() => {
                            setEditingId(u.id);
                            setDraft({
                              name: u.name || '',
                              fullName: u.fullName || '',
                              country: u.country || '',
                              address: u.address || '',
                              relationship: u.relationship || '',
                              phones: normalisePhones(u.phones, u.phone),
                              emergencyContactId: u.emergencyContactId || null
                            });
                          }}
                          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-primary-text)] transition-colors"
                          title="Editar nombre y alias"
                          aria-label={`Editar ${u.name}`}
                        >
                          <Edit3 className="w-4 h-4" />
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


      {/* Edit alias + full name.
          The email is intentionally read-only here: it is the access-control
          key that a Google sign-in is matched against, so editing it from a
          screen that reads like a profile editor would silently grant or
          revoke someone's access. */}
      <BottomSheet
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Editar usuario"
        subtitle="El alias se usa en la app; el nombre completo, en la ficha del taxi"
        icon={Edit3}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setEditingId(null)} className="spa-btn spa-btn-ghost w-full min-h-[3rem]">
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!draft.name.trim()) {
                  notify('El alias no puede quedar vacío.', 'error');
                  return;
                }
                updateUser(editingId, draft);
                setEditingId(null);
                notify('Usuario actualizado', 'success');
              }}
              className="spa-btn spa-btn-primary w-full min-h-[3rem]"
            >
              <Check className="w-4 h-4" />
              Guardar
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2.5">
            <label htmlFor="user-alias" className="spa-eyebrow">Alias</label>
            <input
              id="user-alias"
              type="text"
              value={draft.name}
              maxLength={40}
              onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Lalo"
              className="spa-input min-h-[3.25rem]"
            />
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
              Es el nombre corto que ves en el menú, el itinerario y los gastos.
            </p>
          </div>

          <div className="space-y-2.5">
            <label htmlFor="user-fullname" className="spa-eyebrow">Nombre completo</label>
            <input
              id="user-fullname"
              type="text"
              value={draft.fullName}
              maxLength={80}
              onChange={(e) => setDraft(d => ({ ...d, fullName: e.target.value }))}
              placeholder="Como aparece en tu pasaporte"
              className="spa-input min-h-[3.25rem]"
            />
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
              Este es el que se lee y se reproduce en la ficha de taxi y emergencias, así que
              conviene que coincida con tu identificación.
            </p>
          </div>


          {PHONE_KINDS.map(kind => (
            <div key={kind.key} className="space-y-2.5">
              <span className="spa-eyebrow">Teléfono {kind.label.toLowerCase()}</span>
              <div className="flex gap-2">
                <select
                  value={draft.phones[kind.key].code}
                  onChange={(e) => setDraft(d => ({
                    ...d,
                    phones: { ...d.phones, [kind.key]: { ...d.phones[kind.key], code: e.target.value } }
                  }))}
                  aria-label={`Código de país del teléfono ${kind.label.toLowerCase()}`}
                  className="spa-input min-h-[3.25rem] w-[7.5rem] flex-shrink-0 font-mono"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} {c.label}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  inputMode="tel"
                  value={draft.phones[kind.key].number}
                  maxLength={20}
                  onChange={(e) => setDraft(d => ({
                    ...d,
                    phones: { ...d.phones, [kind.key]: { ...d.phones[kind.key], number: e.target.value } }
                  }))}
                  aria-label={`Número de teléfono ${kind.label.toLowerCase()}`}
                  placeholder="55 1234 5678"
                  className="spa-input min-h-[3.25rem] flex-1"
                />
              </div>
            </div>
          ))}
          <p className="text-[12px] text-[var(--text-muted)] leading-relaxed -mt-2">
            El código de país se guarda aparte para que el número se pueda marcar tal cual desde
            Estados Unidos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label htmlFor="user-country" className="spa-eyebrow">País</label>
              <input
                id="user-country"
                type="text"
                value={draft.country}
                maxLength={40}
                onChange={(e) => setDraft(d => ({ ...d, country: e.target.value }))}
                placeholder="México"
                className="spa-input min-h-[3.25rem]"
              />
            </div>
            <div className="space-y-2.5">
              <label htmlFor="user-relationship" className="spa-eyebrow">Parentesco</label>
              <input
                id="user-relationship"
                type="text"
                value={draft.relationship}
                maxLength={40}
                onChange={(e) => setDraft(d => ({ ...d, relationship: e.target.value }))}
                placeholder="Mamá, hermano, amigo…"
                className="spa-input min-h-[3.25rem]"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label htmlFor="user-address" className="spa-eyebrow">Dirección</label>
            <textarea
              id="user-address"
              rows={2}
              value={draft.address}
              maxLength={160}
              onChange={(e) => setDraft(d => ({ ...d, address: e.target.value }))}
              placeholder="Calle, número, colonia, ciudad"
              className="spa-input min-h-[4.5rem] resize-none"
            />
          </div>

          {/* Each person picks their own. Two travellers naming the same
              person is fine and expected — it's a reference, not a flag. */}
          <div className="space-y-2.5">
            <label htmlFor="user-emergency" className="spa-eyebrow">
              <ShieldCheck className="w-3 h-3" />
              Su contacto de emergencia
            </label>
            <select
              id="user-emergency"
              value={draft.emergencyContactId || ''}
              onChange={(e) => setDraft(d => ({ ...d, emergencyContactId: e.target.value || null }))}
              className="spa-input min-h-[3.25rem]"
            >
              <option value="">Sin contacto asignado</option>
              {users.filter(u => u.id !== editingId).map(u => (
                <option key={u.id} value={u.id}>
                  {u.fullName ? `${u.name} · ${u.fullName}` : u.name}
                </option>
              ))}
            </select>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
              A quién llamar si algo le pasa a esta persona. Aparece en su ficha de taxi y
              emergencias con botón para marcar. Varias personas pueden elegir al mismo contacto.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--bg-surface-elevated)] p-4 space-y-1">
            <span className="spa-eyebrow">Correo (no editable)</span>
            <p className="font-mono text-[13px] text-[var(--text-secondary)] break-all">
              {users.find(u => u.id === editingId)?.email}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed pt-1">
              El correo es la llave de acceso. Para dar o quitar acceso, agrega o elimina al usuario.
            </p>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
