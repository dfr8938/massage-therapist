// src/pages/AdminDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaComment, FaEnvelope, FaStar } from 'react-icons/fa';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') return;

    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients);
        setAppointments(data.appointments);
        setReviews(data.reviews);
        setMessages(data.messages);
      })
      .catch(err => console.error('Ошибка:', err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) return <div>Загрузка админки...</div>;
  if (!currentUser || currentUser.role !== 'admin') return <div>Доступ запрещён</div>;

  const totalClients = clients.length;
  const totalAppointments = appointments.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div style={styles.container}>
      <h1>Админ-панель</h1>

      <section>
        <h2><FaUser /> Статистика</h2>
        <div style={styles.stats}>
          <div style={styles.stat}>Клиентов: <strong>{totalClients}</strong></div>
          <div style={styles.stat}>Записей: <strong>{totalAppointments}</strong></div>
          <div style={styles.stat}>Рейтинг: <strong>{avgRating}</strong></div>
        </div>
      </section>

      <section>
        <h2><FaUser /> Все клиенты</h2>
        <ul>
          {clients.map(c => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.phone}, {c.visit_count} посещений
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2><FaCalendarAlt /> Все записи</h2>
        <ul>
          {appointments.map(a => {
            const client = clients.find(c => c.id === a.client_id);
            return (
              <li key={a.id}>
                <strong>{client?.name || 'Неизвестно'}</strong> — {a.date}, {a.time} ({a.status})
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2><FaComment /> Отзывы</h2>
        {reviews.map(r => {
          const client = clients.find(c => c.id === r.client_id);
          return (
            <div key={r.id} style={styles.review}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[...Array(r.rating)].map((_, i) => <FaStar key={i} size={16} color="#fbbf24" />)}
              </div>
              <p>{r.text}</p>
              <small>{client?.name} — {new Date(r.created_at).toLocaleDateString('ru-RU')}</small>
            </div>
          );
        })}
      </section>

      <section>
        <h2><FaEnvelope /> Сообщения</h2>
        {messages.map(m => (
          <div key={m.id} style={styles.message}>
            <strong>{m.name}</strong> ({m.email}){m.phone && ` — ${m.phone}`}
            <p>{m.message}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: 'Arial, sans-serif' },
  stats: { display: 'flex', gap: '2rem', margin: '1rem 0' },
  stat: { padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' },
  review: { border: '1px solid #eee', padding: '1rem', margin: '0.5rem 0', borderRadius: '8px' },
  message: { border: '1px solid #e2e8f0', padding: '1rem', margin: '0.5rem 0', borderRadius: '8px' },
};
