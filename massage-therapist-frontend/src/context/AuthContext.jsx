// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Восстановление сессии при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setCurrentUser(parsed);
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage, clearing...', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Вход
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);

        const userData = {
          email: email,
          role: data.role,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client-dashboard');
        }

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Неверный email или пароль' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Сервер недоступен. Попробуйте позже.' };
    }
  };

  // Регистрация
  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);

        const userData = {
          email: email,
          role: 'client',
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        navigate('/client-dashboard');

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Ошибка регистрации' };
      }
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: 'Сервер недоступен. Попробуйте позже.' };
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
