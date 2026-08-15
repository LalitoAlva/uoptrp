import React, { createContext, useContext, useState, useEffect } from 'react';
import { notify } from '../utils/alerts';

const AuthContext = createContext();

const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Lalo',
    email: 'lalo@travelnyc.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'admin', // admin, editor, viewer
    isOwner: true,
    lastLogin: '2026-08-15'
  },
  {
    id: 'user-2',
    name: 'Fefe',
    email: 'fefe@travelnyc.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    role: 'editor',
    isOwner: false,
    lastLogin: '2026-08-15'
  }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_app_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  useEffect(() => {
    localStorage.setItem('nyc_app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nyc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const loginWithGoogle = (email = 'lalo@travelnyc.com', customName = 'Lalo') => {
    // Check if user exists or create new
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: customName || email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: users.length === 0 ? 'admin' : 'editor',
        isOwner: false,
        lastLogin: new Date().toISOString().slice(0, 10)
      };
      setUsers(prev => [...prev, user]);
    } else {
      user = { ...user, lastLogin: new Date().toISOString().slice(0, 10) };
    }
    setCurrentUser(user);
    return user;
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    // Set to viewer guest
    setCurrentUser({
      id: 'guest',
      name: 'Invitado (Solo Lectura)',
      email: 'invitado@travelnyc.com',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
      role: 'viewer',
      isOwner: false,
      lastLogin: new Date().toISOString().slice(0, 10)
    });
  };

  const addUser = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.email)}`,
      role: userData.role || 'editor',
      isOwner: false,
      lastLogin: 'Pendiente'
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
      const remaining = users.filter(u => u.id !== userId);
      setCurrentUser(remaining[0] || null);
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
      loginWithGoogle,
      switchUser,
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
