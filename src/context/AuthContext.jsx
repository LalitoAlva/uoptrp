import React, { createContext, useContext, useState, useEffect } from 'react';
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
    email: 'kasimiromiramontes@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'admin', // admin, editor, viewer
    isOwner: true,
    lastLogin: null
  },
  {
    id: 'user-2',
    name: 'Fefe',
    email: 'ealvatorres59@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    role: 'editor',
    isOwner: false,
    lastLogin: null
  }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_app_users_v2');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // No default profile: a fresh device (or after logout) starts with no
  // active session, so the app can gate all content behind picking one.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_current_user_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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
    return updated;
  };

  const logout = () => {
    // Clear the session entirely — no silent fallback to a guest profile.
    // The app gates all content behind the login screen until someone
    // signs in with Google again.
    setCurrentUser(null);
  };

  const addUser = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.email)}`,
      role: userData.role || 'editor',
      isOwner: false,
      lastLogin: null
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserRole = (userId, newRole) => {
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

  const isAdmin = currentUser?.role === 'admin';
  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'editor';

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      isAdmin,
      canEdit,
      loginWithGoogleCredential,
      logout,
      addUser,
      updateUserRole,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
