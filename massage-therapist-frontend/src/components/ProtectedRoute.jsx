// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();
  const location = useLocation(); // Сохраняем текущий путь

  if (!currentUser) {
    // 🔁 Не авторизован → на /login, с указанием, откуда пришёл
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    // 🔏 Не админ → на клиентский кабинет
    return <Navigate to="/client-dashboard" replace />;
  }

  // ✅ Всё ок — рендерим
  return children;
}
