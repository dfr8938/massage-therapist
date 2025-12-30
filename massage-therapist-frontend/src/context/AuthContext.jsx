// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 🔐 Синхронный вход — без fetch, без db.json
  const login = (email, password) => {
    return new Promise((resolve) => {
      // Встроенные пользователи
      const users = [
        {
          id: 1,
          email: 'admin@spa.ru',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: 2,
          email: 'client@spa.ru',
          password: 'password123',
          role: 'client'
        }
      ];

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        const userData = { id: user.id, email: user.email, role: user.role };
        setCurrentUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Неверный email или пароль' });
      }
    });
  };

  // 🚪 Выход
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
