// src/pages/AdminDashboard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCalendarAlt, FaComment, FaEnvelope, FaStar, FaWhatsapp, FaTelegram, FaEdit, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Форма добавления отзыва
  const [reviewForm, setReviewForm] = useState({ clientId: '', text: '', rating: 5 });
  const [isAddingReview, setIsAddingReview] = useState(false);

  // Редактирование профиля
  const [isEditing, setIsEditing] = useState(false);
  const [adminName, setAdminName] = useState('Екатерина');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Загружаем данные из db.json
    fetch('/db.json')
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients || []);
        setAppointments(data.appointments || []);
        setReviews(data.reviews || []);
        setMessages(data.messages || []);
      })
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return <div style={styles.loading}>Загрузка админ-панели...</div>;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <div style={styles.error}>Доступ запрещён</div>;
  }

  // Статистика
  const totalClients = clients.length;
  const totalAppointments = appointments.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  // Добавление отзыва
  const handleAddReview = () => {
    if (!reviewForm.clientId || !reviewForm.text.trim()) return;

    const newReview = {
      id: Date.now(),
      client_id: parseInt(reviewForm.clientId),
      rating: reviewForm.rating,
      text: reviewForm.text,
      created_at: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setReviewForm({ clientId: '', text: '', rating: 5 });
    setIsAddingReview(false);
  };

  const handleCancelReview = () => {
    setReviewForm({ clientId: '', text: '', rating: 5 });
    setIsAddingReview(false);
  };

  const renderStars = (value, onChange) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={18}
            style={{ cursor: 'pointer', color: star <= value ? '#fbbf24' : '#d1d5db' }}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section
        style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <h1 style={styles.heroTitle}>Админ-панель</h1>
        <p style={styles.heroText}>
          Добро пожаловать, {adminName}! Управляйте клиентами, записями и отзывами.
        </p>
      </section>

      <div style={styles.content}>
        {/* Статистика */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaUser style={styles.icon} /> Статистика
          </h2>
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <h3>Клиенты</h3>
              <p style={styles.statNumber}>{totalClients}</p>
            </div>
            <div style={styles.statCard}>
              <h3>Записи</h3>
              <p style={styles.statNumber}>{totalAppointments}</p>
            </div>
            <div style={styles.statCard}>
              <h3>Рейтинг</h3>
              <p style={styles.statNumber}>{avgRating}</p>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {Array.from({ length: Math.floor(avgRating) }).map((_, i) => (
                  <FaStar key={i} size={14} color="#fbbf24" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Клиенты */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaUser style={styles.icon} /> Все клиенты
          </h2>

          {clients.length === 0 ? (
            <p style={styles.empty}>Нет клиентов</p>
          ) : (
            <div style={styles.clients}>
              {clients.map((client) => (
                <div key={client.id} style={styles.clientCard}>
                  <h4 style={styles.cardTitle}>{client.name}</h4>
                  <p style={styles.cardText}>Телефон: {client.phone}</p>
                  <p style={styles.cardText}>Посещений: {client.visit_count || 0}</p>
                  <p style={styles.cardText}>
                    Последнее: {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : '—'}
                  </p>
                  <p style={styles.cardText}>Любимая услуга: {client.favorite_service || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Записи */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaCalendarAlt style={styles.icon} /> Все записи
          </h2>

          {appointments.length === 0 ? (
            <p style={styles.empty}>Нет записей</p>
          ) : (
            <div style={styles.appointments}>
              {appointments.map((app) => {
                const client = clients.find((c) => c.id === app.client_id);
                return (
                  <div key={app.id} style={styles.appointmentCard}>
                    <h4 style={styles.cardTitle}>{client?.name || 'Неизвестно'}</h4>
                    <p style={styles.cardText}>
                      {new Date(app.date).toLocaleDateString('ru-RU')}, {app.time}
                    </p>
                    <span style={{ ...styles.status, ...styles.status[app.status] }}>{app.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Отзывы */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaComment style={styles.icon} /> Ваши отзывы
          </h2>

          {/* Добавление отзыва */}
          {!isAddingReview ? (
            <button
              onClick={() => setIsAddingReview(true)}
              style={styles.addReviewBtn}
            >
              + Добавить отзыв
            </button>
          ) : (
            <div style={styles.reviewForm}>
              <h4 style={styles.editTitle}>Добавить отзыв</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Клиент</label>
                <select
                  value={reviewForm.clientId}
                  onChange={(e) => setReviewForm({ ...reviewForm, clientId: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Выберите клиента</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {renderStars(reviewForm.rating, (rating) => setReviewForm({ ...reviewForm, rating }))}
              <textarea
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                placeholder="Текст отзыва"
                style={styles.textarea}
              />
              <div style={styles.buttonGroup}>
                <button onClick={handleCancelReview} style={styles.cancelBtn}>
                  Отмена
                </button>
                <button onClick={handleAddReview} style={styles.saveBtn}>
                  <FaCheck style={{ marginRight: '8px' }} /> Добавить
                </button>
              </div>
            </div>
          )}

          {/* Список отзывов */}
          {reviews.length > 0 ? (
            <div style={styles.reviews}>
              {reviews.map((r) => {
                const client = clients.find((c) => c.id === r.client_id);
                return (
                  <div key={r.id} style={styles.reviewCard}>
                    <div style={styles.reviewHeader}>
                      <strong>{client?.name || 'Клиент'}</strong>
                      <div style={styles.reviewStars}>
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <FaStar key={i} size={14} color="#fbbf24" />
                        ))}
                      </div>
                    </div>
                    <p style={styles.reviewText}>{r.text}</p>
                    <small style={styles.reviewDate}>
                      {new Date(r.created_at).toLocaleDateString('ru-RU')}
                    </small>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={styles.empty}>Пока нет отзывов</p>
          )}
        </section>

        {/* Сообщения */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaEnvelope style={styles.icon} /> Сообщения
          </h2>

          {messages.length === 0 ? (
            <p style={styles.empty}>Нет сообщений</p>
          ) : (
            <div style={styles.messages}>
              {messages.map((msg) => (
                <div key={msg.id} style={styles.messageCard}>
                  <h4 style={styles.cardTitle}>
                    {msg.name} <small style={styles.messageEmail}>({msg.email})</small>
                  </h4>
                  <p style={{ ...styles.cardText, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                  {msg.phone && <p style={styles.cardText}>📞 {msg.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Связь */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s',
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaComment style={styles.icon} /> Быстрая связь
          </h2>
          <div style={styles.contactButtons}>
            <a href="https://wa.me/79255616201" target="_blank" rel="noreferrer" style={styles.contactBtn}>
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="https://t.me/katya_massage" target="_blank" rel="noreferrer" style={styles.contactBtn}>
              <FaTelegram /> Telegram
            </a>
            <a href="mailto:gorelovaee01@gmail.com" style={styles.contactBtn}>
              <FaEnvelope /> Email
            </a>
          </div>
        </section>

        {/* Назад */}
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s',
          }}
        >
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <FaArrowLeft style={{ marginRight: '8px' }} /> Назад
          </button>
        </div>
      </div>
    </div>
  );
}

// Стили (остаются как в ClientDashboard)
const styles = {
  container: {
    padding: '0',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, -apple-system, sans-serif',
    backgroundColor: '#f9fafb',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#475569',
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    color: '#e53e3e',
    fontSize: '1.2rem',
  },
  hero: {
    textAlign: 'center',
    padding: '6rem 1.5rem 5rem',
    background: 'linear-gradient(135deg, #f0f5ff 0%, #eef2ff 100%)',
    color: '#1e293b',
    margin: '0 0 4rem 0',
    borderRadius: '0 0 20px 20px',
  },
  heroTitle: {
    fontSize: '3rem',
    margin: '0 0 1rem 0',
    fontWeight: '700',
    color: '#1e3a8a',
    fontFamily: '"Playfair Display", serif',
  },
  heroText: {
    fontSize: '1.25rem',
    color: '#475569',
    maxWidth: '700px',
    margin: '0 auto 2rem',
    lineHeight: '1.7',
  },
  content: {
    padding: '0 2rem 4rem',
  },
  section: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    marginBottom: '3rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#1e293b',
    fontFamily: '"Playfair Display", serif',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  icon: {
    color: '#4f46e5',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e3a8a',
    margin: '0.5rem 0 0 0',
  },
  clients: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  clientCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
  appointments: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  appointmentCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
  cardTitle: {
    fontSize: '1.2rem',
    margin: '0 0 0.5rem 0',
    color: '#1e293b',
    fontWeight: '600',
  },
  cardText: {
    color: '#475569',
    margin: '0 0 0.75rem 0',
  },
  status: {
    padding: '0.4rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'inline-block',
    textTransform: 'lowercase',
  },
  'Подтверждена': { backgroundColor: '#dcfce7', color: '#166534' },
  'Завершена': { backgroundColor: '#dbeafe', color: '#1e40af' },
  'Ожидание': { backgroundColor: '#fef9c3', color: '#854d0e' },
  'Отменена': { backgroundColor: '#fee2e2', color: '#991b1b' },
  stars: { display: 'flex', gap: '6px', marginBottom: '1rem' },
  reviews: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  reviewCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    color: '#1e293b',
  },
  reviewStars: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  reviewText: {
    color: '#475569',
    lineHeight: '1.7',
    marginBottom: '0.5rem',
  },
  reviewDate: {
    color: '#64748b',
    fontSize: '0.9rem',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  messageCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
  messageEmail: {
    color: '#64748b',
    fontSize: '0.9rem',
  },
  contactButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  contactBtn: {
    flex: 1,
    padding: '0.875rem',
    textAlign: 'center',
    backgroundColor: '#4f46e5',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  addReviewBtn: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  },
  reviewForm: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    marginBottom: '1.5rem',
  },
  editTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
    display: 'block',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  cancelBtn: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1.1rem',
  },
  saveBtn: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1.1rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  empty: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '1.5rem',
  },
  backBtn: {
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    padding: '1rem 2.5rem',
    borderRadius: '12px',
    border: '2px solid #4f46e5',
    fontWeight: '600',
    fontSize: '1.2rem',
    display: 'inline-block',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
};
