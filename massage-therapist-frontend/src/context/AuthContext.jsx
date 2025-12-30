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
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    return fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        const user = data.users.find(u => u.email === email && u.password === password);
        if (user) {
          const userData = { id: user.id, email: user.email, role: user.role };
          setCurrentUser(userData);
          return { success: true };
        } else {
          return { success: false, error: 'Неверный email или пароль' };
        }
      });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
