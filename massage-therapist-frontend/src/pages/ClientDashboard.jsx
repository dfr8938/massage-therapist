// src/pages/ClientDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaComment, FaWhatsapp, FaTelegram, FaEnvelope, FaStar, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Форма новой записи
  const [booking, setBooking] = useState({ serviceId: '', date: '', time: '' });
  const [bookingStep, setBookingStep] = useState('form');
  const [bookingError, setBookingError] = useState('');

  // Редактирование
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ serviceId: '', date: '', time: '' });
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setIsVisible(true);

    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        const clientData = data.clients.find(c => c.user_id === currentUser.id);
        const clientReviews = data.reviews
          .filter(r => r.client_id === currentUser.id)
          .map(r => ({
            ...r,
            service_name: data.services.find(s => s.id === r.service_id)?.name || 'Услуга'
          }));

        setClient(clientData);
        setServices(data.services);
        setReviews(clientReviews);
      });

    const saved = localStorage.getItem('appointments');
    if (saved) {
      const allAppointments = JSON.parse(saved);
      const userAppointments = allAppointments
        .filter(a => a.client_id === currentUser.id)
        .map(a => ({
          ...a,
          service_name: services.find(s => s.id === a.service_id)?.name || 'Услуга'
        }));
      setAppointments(userAppointments);
    }
  }, [currentUser]);

  useEffect(() => {
    if (appointments.length > 0) {
      const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
      const filtered = existing.filter(a => a.client_id !== currentUser.id);
      const updated = [...filtered, ...appointments];
      localStorage.setItem('appointments', JSON.stringify(updated));
    }
  }, [appointments, currentUser]);

  // --- Новая запись ---
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const validateBooking = () => {
    if (!booking.serviceId || !booking.date || !booking.time) {
      setBookingError('Выберите услугу, дату и время');
      return false;
    }
    setBookingError('');
    return true;
  };

  const submitBooking = (e) => {
    e.preventDefault();
    if (!validateBooking()) return;
    setBookingStep('confirm');
  };

  const confirmBooking = () => {
    const newAppointment = {
      id: Date.now(),
      client_id: currentUser.id,
      service_id: Number(booking.serviceId),
      date: booking.date,
      time: booking.time,
      status: 'Ожидание',
    };

    const service = services.find(s => s.id == booking.serviceId);

    setAppointments([
      {
        ...newAppointment,
        service_name: service?.name || 'Услуга'
      },
      ...appointments
    ]);
    setBookingStep('success');
  };

  const resetBooking = () => {
    setBooking({ serviceId: '', date: '', time: '' });
    setBookingStep('form');
    setBookingError('');
  };

  // --- Редактирование ---
  const startEditing = (app) => {
    setEditing(app.id);
    setEditForm({
      serviceId: app.service_id.toString(),
      date: app.date,
      time: app.time,
    });
    setEditError('');
  };

  const cancelEditing = () => {
    setEditing(null);
    setEditForm({ serviceId: '', date: '', time: '' });
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    if (!editForm.serviceId || !editForm.date || !editForm.time) {
      setEditError('Заполните все поля');
      return;
    }

    const updatedAppointments = appointments.map(app =>
      app.id === editing
        ? {
            ...app,
            service_id: Number(editForm.serviceId),
            date: editForm.date,
            time: editForm.time,
            service_name: services.find(s => s.id === Number(editForm.serviceId))?.name || 'Услуга'
          }
        : app
    );

    setAppointments(updatedAppointments);
    setEditing(null);
    setEditError('');
  };

  // --- Отмена записи (с уведомлением) ---
  const deleteAppointment = (id) => {
    if (window.confirm('Вы действительно хотите отменить эту запись?')) {
      setAppointments(
        appointments.map(app =>
          app.id === id ? { ...app, status: 'Отменена' } : app
        )
      );
      setNotification('Запись отменена');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!client) return <div style={styles.loading}>Загрузка...</div>;

  return (
    <div style={styles.container}>
      {/* Уведомление */}
      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}

      {/* Hero */}
      <section
        style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <h1 style={styles.heroTitle}>Личный кабинет</h1>
        <p style={styles.heroText}>
          Добро пожаловать, {client.name.split(' ')[0]}! Здесь вы управляете записями и отзывами.
        </p>
      </section>

      {/* Личные данные */}
      <div
        style={{
          ...styles.section,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}
      >
        <h2 style={styles.title}>Личные данные</h2>
        <div style={styles.profile}>
          <p><strong>Имя:</strong> {client.name}</p>
          <p><strong>Телефон:</strong> {client.phone}</p>
          <p><strong>Посещений:</strong> {client.visit_count}</p>
          <p><strong>Последнее:</strong> {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : '—'}</p>
          <p><strong>Любимая услуга:</strong> {client.favorite_service || '—'}</p>
        </div>
      </div>

      {/* Форма записи */}
      <div
        style={{
          ...styles.section,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
        }}
      >
        <h2 style={styles.title}>Записаться на приём</h2>

        {bookingStep === 'form' && (
          <form onSubmit={submitBooking} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Услуга</label>
              <select
                name="serviceId"
                value={booking.serviceId}
                onChange={handleBookingChange}
                style={styles.input}
              >
                <option value="">Выберите услугу</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} — {service.price} ₽ ({service.duration} мин)
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Дата</label>
              <input
                type="date"
                name="date"
                value={booking.date}
                onChange={handleBookingChange}
                min={new Date().toISOString().split('T')[0]}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Время</label>
              <input
                type="time"
                name="time"
                value={booking.time}
                onChange={handleBookingChange}
                style={styles.input}
              />
            </div>

            {bookingError && <p style={styles.error}>{bookingError}</p>}

            <button type="submit" style={styles.button}>
              Далее
            </button>
          </form>
        )}

        {bookingStep === 'confirm' && (
          <div style={styles.confirm}>
            <h3>Подтвердите запись</h3>
            <p><strong>Услуга:</strong> {services.find(s => s.id == booking.serviceId)?.name}</p>
            <p><strong>Дата:</strong> {booking.date}, {booking.time}</p>
            <p><strong>Имя:</strong> {client.name}</p>
            <p><strong>Телефон:</strong> {client.phone}</p>
            <div style={styles.buttonGroup}>
              <button onClick={resetBooking} style={styles.cancelBtn}>Назад</button>
              <button onClick={confirmBooking} style={styles.confirmBtn}>Подтвердить</button>
            </div>
          </div>
        )}

        {bookingStep === 'success' && (
          <div style={styles.success}>
            <h3>✅ Запись создана!</h3>
            <p>Ваша заявка принята. Мастер свяжется для подтверждения.</p>
            <button onClick={resetBooking} style={styles.button}>Создать ещё</button>
          </div>
        )}
      </div>

      {/* Мои записи */}
      <div
        style={{
          ...styles.section,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}
      >
        <h2 style={styles.title}>Мои записи</h2>
        {appointments.length === 0 ? (
          <p style={styles.empty}>У вас пока нет записей</p>
        ) : (
          <div style={styles.appointments}>
            {appointments.map(app => (
              <div key={app.id} style={styles.appointmentCard}>
                {editing === app.id ? (
                  <div style={styles.editForm}>
                    <h4 style={styles.editTitle}>Редактировать</h4>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Услуга</label>
                      <select
                        name="serviceId"
                        value={editForm.serviceId}
                        onChange={handleEditChange}
                        style={styles.input}
                      >
                        <option value="">Выберите</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Дата</label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        min={new Date().toISOString().split('T')[0]}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Время</label>
                      <input
                        type="time"
                        name="time"
                        value={editForm.time}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    </div>
                    {editError && <p style={styles.error}>{editError}</p>}
                    <div style={styles.buttonGroup}>
                      <button onClick={cancelEditing} style={styles.cancelBtn}><FaTimes /> Отмена</button>
                      <button onClick={saveEdit} style={styles.confirmBtn}><FaCheck /> Сохранить</button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.appointmentHeader}>
                    <div>
                      <h4 style={styles.cardTitle}>{app.service_name}</h4>
                      <p style={styles.cardText}>{new Date(app.date).toLocaleDateString('ru-RU')}, {app.time}</p>
                    </div>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => startEditing(app)} style={styles.iconButton}><FaEdit /></button>
                      <button onClick={() => deleteAppointment(app.id)} style={styles.iconButton}><FaTrash /></button>
                    </div>
                  </div>
                )}
                <span style={{ ...styles.status, ...styles.status[app.status] }}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Отзывы */}
      <div
        style={{
          ...styles.section,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
        }}
      >
        <h2 style={styles.title}>Мои отзывы</h2>
        {reviews.length === 0 ? (
          <p style={styles.empty}>Пока нет отзывов</p>
        ) : (
          <div style={styles.reviews}>
            {reviews.map(r => (
              <div key={r.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewStars}>
                    {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} size={14} color="#fbbf24" />)}
                  </div>
                </div>
                <p style={styles.reviewText}>{r.text}</p>
                <small style={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString('ru-RU')}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Связь */}
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
        }}
      >
        <h2 style={styles.title}>Связь с мастером</h2>
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
      </div>
    </div>
  );
}

// === STYLES ===
const styles = {
  container: {
    padding: '0',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, -apple-system, sans-serif',
    backgroundColor: '#f9fafb',
  },

  // Hero
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

  // Общие стили
  section: {
    padding: '4rem 2rem',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
    fontFamily: '"Playfair Display", serif',
    color: '#1e293b',
  },
  profile: {
    textAlign: 'center',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#475569',
    maxWidth: '800px',
    margin: '0 auto',
  },

  // Форма
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
  },
  input: {
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.85rem 2.5rem',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  cancelBtn: {
    padding: '0.85rem 1.5rem',
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '0.85rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
  error: {
    color: '#e53e3e',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  empty: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '1.5rem',
  },

  // Редактирование
  editForm: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
  editTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    color: '#1e293b',
    fontWeight: '600',
  },

  // Записи
  appointments: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  appointmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  cardText: {
    color: '#64748b',
    margin: '0',
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4f46e5',
    cursor: 'pointer',
    padding: '0.5rem',
    fontSize: '1.1rem',
  },

  // Статусы
  status: {
    padding: '0.4rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'inline-block',
  },
  'Подтверждена': { backgroundColor: '#dcfce7', color: '#166534' },
  'Завершена': { backgroundColor: '#dbeafe', color: '#1e40af' },
  'Ожидание': { backgroundColor: '#fef9c3', color: '#854d0e' },
  'Отменена': { backgroundColor: '#fee2e2', color: '#991b1b' },

  // Отзывы
  reviews: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  reviewStars: {
    display: 'flex',
    gap: '4px',
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

  // Связь
  contactButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginTop: '1.5rem',
  },
  contactBtn: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.85rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },

  // Уведомление
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
};

// Анимации
const styleEl = document.createElement('style');
styleEl.textContent = `
  .button, .contact-btn, .cancel-btn, .confirm-btn, .hero-button, .cta-button {
    transition: all 0.2s ease;
  }
  .button:hover, .contact-btn:hover, .cancel-btn:hover, .confirm-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
  }
  @media (max-width: 768px) {
    .hero-title { font-size: 2.5rem; }
    .hero-text { font-size: 1.1rem; }
    .title { font-size: 2.2rem; }
  }
`;
document.head.appendChild(styleEl);
