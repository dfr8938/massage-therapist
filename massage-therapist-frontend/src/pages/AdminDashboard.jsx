// src/pages/AdminDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaComment, FaEnvelope, FaStar, FaWhatsapp, FaTelegram, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(null);

  // Фильтры
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    clientId: '',
    hasMessage: '',
    search: '',
  });

  // Автозаполнение
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Управление отзывами
  const [reviewForm, setReviewForm] = useState({ clientId: '', text: '', rating: 5 });
  const [isAddingReview, setIsAddingReview] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || []);
        setAppointments(data.appointments || []);
        setReviews(data.reviews || []);
        setMessages(data.messages || []);
      })
      .catch(err => console.error('Ошибка загрузки:', err));
  }, [currentUser, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Закрытие подсказок при клике вне
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Все имена для автозаполнения
  const allNames = [
    ...new Set([
      ...clients.map(c => c.name),
      ...messages.map(m => m.name)
    ])
  ];

  // Показ уведомления
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Фильтрация записей
  const filteredAppointments = appointments.filter((app) => {
    const client = clients.find((c) => c.id === app.client_id);
    const appDate = new Date(app.date);
    const matchesSearch = !filters.search ||
      client?.name.toLowerCase().includes(filters.search.toLowerCase().trim());

    return (
      matchesSearch &&
      (!filters.status || app.status === filters.status) &&
      (!filters.dateFrom || appDate >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || appDate <= new Date(filters.dateTo)) &&
      (!filters.clientId || app.client_id === parseInt(filters.clientId)) &&
      (filters.hasMessage === '' ||
        (filters.hasMessage === 'yes' && messages.some(m => m.name === client?.name)) ||
        (filters.hasMessage === 'no' && !messages.some(m => m.name === client?.name)))
    );
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Статистика
  const totalClients = clients.length;
  const totalAppointments = filteredAppointments.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  // Добавление отзыва
  const handleAddReview = () => {
    if (!reviewForm.clientId || !reviewForm.text.trim()) {
      showNotification('Заполните текст отзыва');
      return;
    }

    const client = clients.find(c => c.id === parseInt(reviewForm.clientId));
    const newReview = {
      id: Date.now(),
      client_id: parseInt(reviewForm.clientId),
      rating: reviewForm.rating,
      text: reviewForm.text,
      created_at: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setIsAddingReview(false);
    setReviewForm({ clientId: '', text: '', rating: 5 });
    showNotification('Отзыв добавлен');
  };

  const handleCancelReview = () => {
    setIsAddingReview(false);
    setReviewForm({ clientId: '', text: '', rating: 5 });
  };

  const renderStars = (value, onChange) => (
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

  return (
    <div style={styles.container}>
      {/* Уведомление */}
      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}

      {/* Hero */}
      <section style={{ ...styles.hero, ...(isVisible ? styles.visible : {}) }}>
        <h1 style={styles.heroTitle}>Админ-панель</h1>
        <p style={styles.heroText}>
          Управляйте клиентами, записями и отзывами. Быстрая аналитика и обратная связь.
        </p>
      </section>

      <div style={styles.content}>
        {/* Статистика */}
        <section style={{ ...styles.section, ...(isVisible ? styles.visible : {}) }}>
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
              <div style={styles.ratingStars}>
                {Array.from({ length: Math.floor(avgRating) }).map((_, i) => (
                  <FaStar key={i} size={14} color="#fbbf24" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Записи с фильтрами */}
        <section style={{ ...styles.section, ...(isVisible ? styles.visible : {}) }}>
          <h2 style={styles.sectionTitle}>
            <FaCalendarAlt style={styles.icon} /> Все записи
          </h2>

          <div style={styles.filters}>
            {/* Фильтры */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Статус</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={styles.filterSelect}
              >
                <option value="">Все</option>
                <option value="Ожидание">Ожидание</option>
                <option value="Подтверждена">Подтверждена</option>
                <option value="Завершена">Завершена</option>
                <option value="Отменена">Отменена</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Дата от</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Дата до</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Клиент</label>
              <select
                value={filters.clientId}
                onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
                style={styles.filterSelect}
              >
                <option value="">Все</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Есть сообщение</label>
              <select
                value={filters.hasMessage}
                onChange={(e) => setFilters({ ...filters, hasMessage: e.target.value })}
                style={styles.filterSelect}
              >
                <option value="">Все</option>
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
            </div>

            <div style={{ ...styles.filterGroup, position: 'relative' }}>
              <label style={styles.filterLabel}>Поиск по имени</label>
              <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({ ...filters, search: value });
                    setSuggestionIndex(-1);
                    if (value) {
                      const filtered = allNames.filter(name =>
                        name.toLowerCase().includes(value.toLowerCase())
                      );
                      setSuggestions(filtered);
                      setShowSuggestions(true);
                    } else {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (suggestions.length === 0) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
                    } else if (e.key === 'Enter' && suggestionIndex !== -1) {
                      setFilters({ ...filters, search: suggestions[suggestionIndex] });
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (filters.search && suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Например: Анна"
                  style={styles.filterInput}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul style={styles.suggestions}>
                    {suggestions.map((name, i) => (
                      <li
                        key={name}
                        style={{
                          ...styles.suggestion,
                          ...(i === suggestionIndex ? styles.suggestionActive : {}),
                        }}
                        onMouseEnter={() => setSuggestionIndex(i)}
                        onMouseDown={() => {
                          setFilters({ ...filters, search: name });
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }}
                      >
                        {name.split(new RegExp(`(${filters.search})`, 'gi')).map((part, i) =>
                          part.toLowerCase() === filters.search.toLowerCase() ? (
                            <strong key={i} style={styles.highlight}>{part}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={() => setFilters({
                status: '', dateFrom: '', dateTo: '', clientId: '', hasMessage: '', search: ''
              })}
              style={styles.clearBtn}
            >
              Сбросить всё
            </button>
          </div>

          {/* Список записей */}
          {filteredAppointments.length === 0 ? (
            <p style={styles.empty}>Нет записей по фильтрам</p>
          ) : (
            <div style={styles.appointments}>
              {filteredAppointments.map(app => {
                const client = clients.find(c => c.id === app.client_id);
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
        <section style={{ ...styles.section, ...(isVisible ? styles.visible : {}) }}>
          <h2 style={styles.sectionTitle}>
            <FaComment style={styles.icon} /> Отзывы
          </h2>

          {!isAddingReview ? (
            <button onClick={() => setIsAddingReview(true)} style={styles.addReviewBtn}>
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
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                <button onClick={handleCancelReview} style={styles.cancelBtn}>Отмена</button>
                <button onClick={handleAddReview} style={styles.saveBtn}>
                  <FaCheck style={{ marginRight: '8px' }} /> Добавить
                </button>
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            <div style={styles.reviews}>
              {reviews.map(r => {
                const client = clients.find(c => c.id === r.client_id);
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
        <section style={{ ...styles.section, ...(isVisible ? styles.visible : {}) }}>
          <h2 style={styles.sectionTitle}>
            <FaEnvelope style={styles.icon} /> Сообщения
          </h2>

          <div style={{ ...styles.filterGroup, position: 'relative', marginBottom: '1rem' }}>
            <label style={styles.filterLabel}>Поиск по имени</label>
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({ ...filters, search: value });
                  setSuggestionIndex(-1);
                  if (value) {
                    const filtered = allNames.filter(name =>
                      name.toLowerCase().includes(value.toLowerCase())
                    );
                    setSuggestions(filtered);
                    setShowSuggestions(true);
                  } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (filters.search && suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Например: Анна"
                style={styles.filterInput}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul style={styles.suggestions}>
                  {suggestions.map((name, i) => (
                    <li
                      key={name}
                      style={{
                        ...styles.suggestion,
                        ...(i === suggestionIndex ? styles.suggestionActive : {}),
                      }}
                      onMouseEnter={() => setSuggestionIndex(i)}
                      onMouseDown={() => {
                        setFilters({ ...filters, search: name });
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      {name.split(new RegExp(`(${filters.search})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === filters.search.toLowerCase() ? (
                          <strong key={i} style={styles.highlight}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {messages
            .filter(msg => !filters.search || msg.name.toLowerCase().includes(filters.search.toLowerCase().trim()))
            .map(msg => {
              const client = clients.find(c => c.name === msg.name);
              return (
                <div key={msg.id} style={styles.messageCard}>
                  <h4 style={styles.cardTitle}>
                    {msg.name} {client && <span style={styles.clientLabel}>(Клиент)</span>}
                    <small style={styles.messageEmail}>({msg.email})</small>
                  </h4>
                  <p style={{ ...styles.cardText, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                  {msg.phone && <p style={styles.cardText}>📞 {msg.phone}</p>}
                </div>
              );
            })}
        </section>

        {/* Связь */}
        <section style={{ ...styles.section, ...(isVisible ? styles.visible : {}) }}>
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
        <div style={{ ...styles.backSection, ...(isVisible ? styles.visible : {}) }}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <FaArrowLeft style={{ marginRight: '8px' }} /> Назад
          </button>
        </div>
      </div>
    </div>
  );
}

// === СТИЛИ ===
const styles = {
  container: {
    padding: '0',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, -apple-system, sans-serif',
    backgroundColor: '#f9fafb',
  },

  // Анимация появления
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
  },

  // Hero
  hero: {
    textAlign: 'center',
    padding: '6rem 1.5rem 5rem',
    background: 'linear-gradient(135deg, #f0f5ff 0%, #eef2ff 100%)',
    color: '#1e293b',
    margin: '0 0 4rem 0',
    borderRadius: '0 0 20px 20px',
    opacity: 0,
    transform: 'translateY(-20px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
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

  // Общие
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
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
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

  // Статистика
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
  ratingStars: {
    display: 'flex',
    gap: '2px',
    justifyContent: 'center',
    marginTop: '0.5rem',
  },

  // Фильтры
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  filterLabel: {
    fontSize: '0.9rem',
    color: '#334155',
    fontWeight: '500',
  },
  filterSelect: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  filterInput: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
  },
  clearBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#f87171',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1rem',
    marginTop: 'auto',
    alignSelf: 'flex-start',
  },

  // Автозаполнение
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    zIndex: 1000,
  },
  suggestion: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#475569',
  },
  suggestionActive: {
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
  },
  highlight: {
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    padding: '0 4px',
    borderRadius: '4px',
    fontWeight: '600',
  },

  // Записи
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
  },
  'Подтверждена': { backgroundColor: '#dcfce7', color: '#166534' },
  'Завершена': { backgroundColor: '#dbeafe', color: '#1e40af' },
  'Ожидание': { backgroundColor: '#fef9c3', color: '#854d0e' },
  'Отменена': { backgroundColor: '#fee2e2', color: '#991b1b' },

  // Отзывы
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

  // Сообщения
  messageCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    marginBottom: '1rem',
  },
  messageEmail: {
    color: '#64748b',
    fontSize: '0.9rem',
  },
  clientLabel: {
    color: '#4f46e5',
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },

  // Связь
  contactButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  contactBtn: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },

  // Добавление отзыва
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
  },
  textarea: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical',
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

  // Пусто
  empty: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '1.5rem',
  },

  // Назад
  backSection: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },
  backBtn: {
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    padding: '1rem 2.5rem',
    borderRadius: '12px',
    border: '2px solid #4f46e5',
    fontWeight: '600',
    fontSize: '1.2rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
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

  // Вспомогательные
  stars: {
    display: 'flex',
    gap: '6px',
    marginBottom: '1rem',
  },
};

// === АНИМАЦИИ ===
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .addReviewBtn, .saveBtn, .cancelBtn, .contactBtn, .backBtn, .clearBtn {
    transition: all 0.2s ease;
  }
  .addReviewBtn:hover, .saveBtn:hover, .cancelBtn:hover, .contactBtn:hover, .backBtn:hover, .clearBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
  }

  @media (max-width: 768px) {
    .heroTitle { font-size: 2.5rem; }
    .heroText { font-size: 1.1rem; }
    .sectionTitle { font-size: 1.6rem; }
  }
`;
document.head.appendChild(styleEl);
