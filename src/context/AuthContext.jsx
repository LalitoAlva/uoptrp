import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notify } from '../utils/alerts';
import { decodeGoogleCredential } from '../config/googleAuth';

const AuthContext = createContext();

// The `email` on each entry IS the access control — only these real Gmail
// accounts can sign in with Google and reach the app. To grant someone
// access, add them here (or via the "Usuarios" panel once an admin is
// signed in); to revoke access, remove them.
const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Lalo',
    fullName: 'Eduardo Alva Ramírez',
    email: 'kasimiromiramontes@gmail.com',
    phone: '',
    country: 'México',
    address: '',
    relationship: '',
    isEmergencyContact: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'admin', // admin, editor, viewer
    isOwner: true,
    lastLogin: null
  },
  {
    id: 'user-2',
    name: 'Fefe',
    fullName: 'Fernanda Torres',
    email: 'ealvatorres59@gmail.com',
    phone: '',
    country: 'México',
    address: '',
    relationship: '',
    isEmergencyContact: false,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    role: 'editor',
    isOwner: false,
    lastLogin: null
  }
];

const VALID_ROLES = ['admin', 'editor', 'viewer'];

/**
 * Session lifetime.
 *
 * Modelled as an *idle* timeout: any real interaction pushes the deadline
 * back to 30 minutes out. The last 2 minutes are the warning window, where
 * ordinary activity deliberately stops renewing and only the explicit
 * "Seguir aquí" button does — otherwise a stray scroll would silently
 * dismiss the warning and the countdown would never mean anything.
 */
export const SESSION_DURATION_MS = 30 * 60 * 1000;
export const SESSION_WARNING_MS = 2 * 60 * 1000;

const SESSION_DEADLINE_KEY = 'nyc_session_deadline_v1';

/**
 * The deadline as stored, or null when there is no live session.
 *
 * Returns null for anything missing, unparseable, or already past, so the
 * single check `readStoredDeadline() === null` covers "no session" and
 * "expired while the app was closed" identically.
 */
function readStoredDeadline() {
  try {
    const raw = localStorage.getItem(SESSION_DEADLINE_KEY);
    if (!raw) return null;
    const ts = Number(raw);
    if (!Number.isFinite(ts) || ts <= Date.now()) return null;
    return ts;
  } catch {
    return null;
  }
}

function writeStoredDeadline(ts) {
  try {
    if (ts === null) localStorage.removeItem(SESSION_DEADLINE_KEY);
    else localStorage.setItem(SESSION_DEADLINE_KEY, String(ts));
  } catch {
    // Without persistence the session still expires in-tab; it just won't
    // survive a reload, which fails safe (towards logged out).
  }
}

/**
 * Shapes one stored user record.
 *
 * This list IS the access-control list and it lives in localStorage, so treat
 * every field as untrusted: an unknown `role` string would otherwise flow
 * straight into the `isAdmin` / `canEdit` checks, and a non-string `email`
 * would throw inside the whitelist comparison during sign-in. Anything that
 * doesn't fit the expected shape is dropped or downgraded to `viewer` (the
 * least-privileged role) rather than being trusted.
 */
function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return null;
  if (typeof user.email !== 'string' || !user.email.includes('@')) return null;

  return {
    id: typeof user.id === 'string' ? user.id : `user-${Date.now()}`,
    // `name` is the alias shown around the app; `fullName` is the real name
    // used where a stranger has to read it (the taxi / emergency card).
    name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : user.email.split('@')[0],
    fullName: typeof user.fullName === 'string' && user.fullName.trim() ? user.fullName.trim() : '',
    email: user.email,
    avatar: typeof user.avatar === 'string' ? user.avatar : '',
    // Contact details. Optional everywhere, but the emergency card reads
    // them, so they're normalised to strings rather than left undefined.
    phone: typeof user.phone === 'string' ? user.phone.trim() : '',
    country: typeof user.country === 'string' ? user.country.trim() : '',
    address: typeof user.address === 'string' ? user.address.trim() : '',
    relationship: typeof user.relationship === 'string' ? user.relationship.trim() : '',
    // Someone to call if things go wrong. Marked per-user rather than kept in
    // a separate list, so a person who is both a traveller and the emergency
    // contact doesn't have to be entered twice.
    isEmergencyContact: user.isEmergencyContact === true,
    role: VALID_ROLES.includes(user.role) ? user.role : 'viewer',
    isOwner: user.isOwner === true,
    lastLogin: typeof user.lastLogin === 'string' ? user.lastLogin : null
  };
}

function readStoredUsers() {
  try {
    const saved = localStorage.getItem('nyc_app_users_v2');
    if (!saved) return INITIAL_USERS;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_USERS;
    const cleaned = parsed.map(sanitizeUser).filter(Boolean);
    // Never leave the app with an empty whitelist — that would lock everyone
    // out with no way back in from the UI.
    return cleaned.length > 0 ? cleaned : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readStoredUsers);

  // No default profile: a fresh device (or after logout) starts with no
  // active session, so the app can gate all content behind picking one.
  //
  // The stored session is only honoured if its deadline hasn't passed —
  // otherwise closing the laptop for an hour and reopening it would restore
  // a session that should have expired.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_current_user_v2');
      if (!saved) return null;
      if (readStoredDeadline() === null) {
        localStorage.removeItem('nyc_current_user_v2');
        localStorage.removeItem(SESSION_DEADLINE_KEY);
        return null;
      }
      return sanitizeUser(JSON.parse(saved));
    } catch {
      return null;
    }
  });

  /** Epoch ms at which the session dies if nothing renews it. */
  const [deadline, setDeadline] = useState(() => readStoredDeadline());
  const [msLeft, setMsLeft] = useState(() => {
    const d = readStoredDeadline();
    return d === null ? 0 : d - Date.now();
  });

  useEffect(() => {
    localStorage.setItem('nyc_app_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nyc_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nyc_current_user_v2');
    }
  }, [currentUser]);

  /**
   * Verifies a real Google Sign-In credential and, only if the verified
   * email matches someone on the `users` whitelist, logs them in as that
   * profile (keeping our friendly name, adopting their real Google photo).
   * Returns the logged-in user on success, or null (with a toast explaining
   * why) on failure.
   */
  const loginWithGoogleCredential = (credential) => {
    const payload = decodeGoogleCredential(credential);
    if (!payload || !payload.email) {
      notify('No se pudo leer tu cuenta de Google. Intenta de nuevo.', 'error');
      return null;
    }
    if (!payload.email_verified) {
      notify('Tu correo de Google no está verificado.', 'error');
      return null;
    }

    const email = payload.email.toLowerCase();
    const matched = users.find(u => u.email.toLowerCase() === email);

    if (!matched) {
      notify(`${payload.email} no tiene acceso a este viaje. Pídele a Lalo que te agregue en Usuarios.`, 'error');
      return null;
    }

    const updated = {
      ...matched,
      avatar: payload.picture || matched.avatar,
      lastLogin: new Date().toISOString().slice(0, 10)
    };
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    setCurrentUser(updated);
    // Signing in starts the 30-minute clock.
    const next = Date.now() + SESSION_DURATION_MS;
    setDeadline(next);
    setMsLeft(SESSION_DURATION_MS);
    writeStoredDeadline(next);
    return updated;
  };

  const logout = useCallback(() => {
    // Clear the session entirely — no silent fallback to a guest profile.
    // The app gates all content behind the login screen until someone
    // signs in with Google again.
    setCurrentUser(null);
    setDeadline(null);
    setMsLeft(0);
    writeStoredDeadline(null);
  }, []);

  /** Pushes the deadline out to a full session from now. */
  const extendSession = useCallback(() => {
    const next = Date.now() + SESSION_DURATION_MS;
    setDeadline(next);
    setMsLeft(SESSION_DURATION_MS);
    writeStoredDeadline(next);
  }, []);

  // Tick while signed in: drives the countdown and performs the expiry.
  useEffect(() => {
    if (!currentUser || deadline === null) return undefined;

    const tick = () => {
      const remaining = deadline - Date.now();
      setMsLeft(remaining);
      if (remaining <= 0) {
        logout();
        notify('Tu sesión expiró por inactividad. Vuelve a iniciar sesión.', 'warning');
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentUser, deadline, logout]);

  // Ordinary interaction renews the session — but not once the warning is
  // up, where renewing is an explicit decision (see the note on the
  // constants above). Writes are throttled to once every 30s so a scroll
  // doesn't hammer localStorage on every frame.
  useEffect(() => {
    if (!currentUser) return undefined;

    let lastRenew = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastRenew < 30000) return;
      if (deadline !== null && deadline - now <= SESSION_WARNING_MS) return;
      lastRenew = now;
      const next = now + SESSION_DURATION_MS;
      setDeadline(next);
      writeStoredDeadline(next);
    };

    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, onActivity, { passive: true }));
    return () => events.forEach(evt => window.removeEventListener(evt, onActivity));
  }, [currentUser, deadline]);

  // Coming back to a backgrounded tab: timers are throttled or frozen there,
  // so re-check against the wall clock rather than trusting the interval.
  useEffect(() => {
    if (!currentUser) return undefined;
    const onVisible = () => {
      if (document.hidden) return;
      if (readStoredDeadline() === null) {
        logout();
        notify('Tu sesión expiró por inactividad. Vuelve a iniciar sesión.', 'warning');
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [currentUser, logout]);

  /**
   * Grants someone access. Adding a row here is what lets that Gmail account
   * sign in, so the email is validated and de-duplicated, and the role is
   * checked against the allowlist instead of being taken at face value.
   */
  const addUser = (userData) => {
    const email = typeof userData?.email === 'string' ? userData.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify('Ese correo no tiene un formato válido.', 'error');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === email)) {
      notify('Ese correo ya tiene acceso al viaje.', 'warning');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: (typeof userData.name === 'string' && userData.name.trim()) || email.split('@')[0],
      fullName: (typeof userData.fullName === 'string' && userData.fullName.trim()) || '',
      phone: (typeof userData.phone === 'string' && userData.phone.trim()) || '',
      country: (typeof userData.country === 'string' && userData.country.trim()) || '',
      address: (typeof userData.address === 'string' && userData.address.trim()) || '',
      relationship: (typeof userData.relationship === 'string' && userData.relationship.trim()) || '',
      isEmergencyContact: userData.isEmergencyContact === true,
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      role: VALID_ROLES.includes(userData.role) ? userData.role : 'viewer',
      isOwner: false,
      lastLogin: null
    };
    setUsers(prev => [...prev, newUser]);
  };

  /**
   * Edits a user's display fields.
   *
   * Only alias and full name are editable: the email IS the access-control
   * key (it's what a Google sign-in is matched against), so letting it be
   * rewritten here would silently grant or revoke someone's access from a
   * screen that reads like a profile editor. Role changes go through
   * `updateUserRole`, which validates against the allowlist.
   */
  const updateUser = (userId, changes) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const updated = {
        ...u,
        name: typeof changes.name === 'string' && changes.name.trim() ? changes.name.trim() : u.name,
        fullName: typeof changes.fullName === 'string' ? changes.fullName.trim() : u.fullName,
        phone: typeof changes.phone === 'string' ? changes.phone.trim() : u.phone,
        country: typeof changes.country === 'string' ? changes.country.trim() : u.country,
        address: typeof changes.address === 'string' ? changes.address.trim() : u.address,
        relationship: typeof changes.relationship === 'string' ? changes.relationship.trim() : u.relationship,
        isEmergencyContact: typeof changes.isEmergencyContact === 'boolean'
          ? changes.isEmergencyContact
          : u.isEmergencyContact
      };
      if (currentUser?.id === userId) setCurrentUser(updated);
      return updated;
    }));
  };

  const updateUserRole = (userId, newRole) => {
    if (!VALID_ROLES.includes(newRole)) return;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, role: newRole };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  const deleteUser = (userId) => {
    if (users.length <= 1) return notify('No puedes eliminar al único usuario.', 'warning');
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  /** Everyone flagged as someone to call if things go wrong. */
  const emergencyContacts = users.filter(u => u.isEmergencyContact);

  const isAdmin = currentUser?.role === 'admin';
  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      emergencyContacts,
      isAdmin,
      canEdit,
      loginWithGoogleCredential,
      logout,
      addUser,
      updateUser,
      updateUserRole,
      deleteUser,
      // Session lifetime
      sessionMsLeft: msLeft,
      isSessionExpiring: Boolean(currentUser) && deadline !== null && msLeft > 0 && msLeft <= SESSION_WARNING_MS,
      extendSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
