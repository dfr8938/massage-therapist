// src/pages/ClientDashboard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCalendarAlt, FaComment, FaWhatsapp, FaTelegram, FaEnvelope, FaStar, FaEdit, FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [review, setReview] = useState({ text: '', rating: 5 });
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        const clientData = data.clients.find(c => c.user_id === currentUser.id);
        const clientAppointments = data.appointments
          .filter(a => a.client_id === currentUser.id)
          .map(a => ({
            ...a,
            service_name: data.services.find(s => s.id === a.service_id)?.name || 'Услуга'
          }));
        const clientReviews = data.reviews
          .filter(r => r.client_id === currentUser.id)
          .map(r => ({
            ...r,
            service_name: data.services.find(s => s.id === r.service_id)?.name || 'Услуга'
          }));

        setClient(clientData);
        setAppointments(clientAppointments);
        setReviews(clientReviews);

        const [firstName, lastName] = clientData?.name?.split(' ') || ['', ''];
        setProfileForm({ firstName, lastName });
      })
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) return <div style={styles.loading}>Загрузка...</div>;
  if (!client) return <div style={styles.error}>Не удалось загрузить данные</div>;

  const handleSubmitReview = () => {
    if (!review.text.trim()) return;
    const newReview = {
      id: Date.now(),
      client_id: currentUser.id,
      service_id: 1,
      rating: review.rating,
      text: review.text,
      created_at: new Date().toISOString()
    };
    setReviews([newReview, ...reviews]);
    setReview({ text: '', rating: 5 });
    setIsEditing(false);
  };

  const handleEditReview = (rev) => {
    setReview({ text: rev.text, rating: rev.rating });
    setEditingReviewId(rev.id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setReview({ text: '', rating: 5 });
    setEditingReviewId(null);
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    const name = `${profileForm.firstName.trim()} ${profileForm.lastName?.trim()}`.trim();
    setClient({ ...client, name });
    setIsEditingProfile(false);
  };

  const renderStars = (value, onChange) => (
    <div style={styles.stars}>
      {[1, 2, 3, 4, 5].map(star => (
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
      <section style={{ ...styles.hero, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-20px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
        <h1 style={styles.heroTitle}>Личный кабинет</h1>
        <p style={styles.heroText}>
          Добро пожаловать, {client.name?.split(' ')[0]}! Здесь вы управляете профилем, записями и отзывами.
        </p>
      </section>

      <div style={styles.content}>
        <section style={{ ...styles.section, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s' }}>
          <h2 style={styles.sectionTitle}><FaUser style={styles.icon} /> Личные данные</h2>
          {isEditingProfile ? (
            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Имя</label>
                <input value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Фамилия</label>
                <input value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} style={styles.input} />
              </div>
              <div style={styles.buttonGroup}>
                <button onClick={() => setIsEditingProfile(false)} style={styles.cancelBtn}>Отмена</button>
                <button onClick={handleSaveProfile} style={styles.saveBtn}>Сохранить</button>
              </div>
            </div>
          ) : (
            <div style={styles.profile}>
              <p><strong>Имя:</strong> {client.name}</p>
              <p><strong>Телефон:</strong> {client.phone}</p>
              <p><strong>Посещений:</strong> {client.visit_count}</p>
              <p><strong>Последнее:</strong> {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ru-RU') : '—'}</p>
              <p><strong>Любимая услуга:</strong> {client.favorite_service || '—'}</p>
              <button onClick={() => setIsEditingProfile(true)} style={styles.editBtn}>
                <FaEdit style={{ marginRight: '8px' }} /> Редактировать
              </button>
            </div>
          )}
        </section>

        <section style={{ ...styles.section, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s' }}>
          <h2 style={styles.sectionTitle}><FaCalendarAlt style={styles.icon} /> Мои записи</h2>
          {appointments.length === 0 ? (
            <p style={styles.empty}>У вас пока нет записей</p>
          ) : (
            <div style={styles.appointments}>
              {appointments.map(app => (
                <div key={app.id} style={styles.appointmentCard}>
                  <h4 style={styles.cardTitle}>{app.service_name}</h4>
                  <p style={styles.cardText}>{new Date(app.date).toLocaleDateString('ru-RU')}, {app.time}</p>
                  <span style={{ ...styles.status, ...styles.status[app.status] }}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ ...styles.section, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s' }}>
          <h2 style={styles.sectionTitle}><FaComment style={styles.icon} /> Мои отзывы</h2>
          {!isEditing && (
            <div style={styles.reviewForm}>
              {renderStars(review.rating, setReview)}
              <textarea value={review.text} onChange={e => setReview({ ...review, text: e.target.value })} placeholder="Поделитесь впечатлениями о сеансе..." style={styles.textarea} />
              <button onClick={handleSubmitReview} style={styles.submitBtn}><FaCheck style={{ marginRight: '8px' }} /> Отправить отзыв</button>
            </div>
          )}
          {isEditing && (
            <div style={styles.editReview}>
              <h4 style={styles.editTitle}>Редактировать отзыв</h4>
              {renderStars(review.rating, setReview)}
              <textarea value={review.text} onChange={e => setReview({ ...review, text: e.target.value })} style={styles.textarea} />
              <div style={styles.buttonGroup}>
                <button onClick={handleCancelEdit} style={styles.cancelBtn}>Отмена</button>
                <button onClick={handleSubmitReview} style={styles.saveBtn}>Обновить</button>
              </div>
            </div>
          )}
          {reviews.length > 0 ? (
            <div style={styles.reviews}>
              {reviews.map(r => (
                <div key={r.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewStars}>
                      {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} size={14} color="#fbbf24" />)}
                    </div>
                    <small style={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString('ru-RU')}</small>
                  </div>
                  <p style={styles.reviewText}>{r.text}</p>
                  <button onClick={() => handleEditReview(r)} style={styles.smallEditBtn}><FaEdit size={12} /> Ред.</button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.empty}>Пока нет отзывов</p>
          )}
        </section>

        <section style={{ ...styles.section, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s' }}>
          <h2 style={styles.sectionTitle}><FaComment style={styles.icon} /> Связаться с мастером</h2>
          <div style={styles.contactButtons}>
            <a href="https://wa.me/79255616201" target="_blank" rel="noreferrer" style={styles.contactBtn}><FaWhatsapp /> WhatsApp</a>
            <a href="https://t.me/katya_massage" target="_blank" rel="noreferrer" style={styles.contactBtn}><FaTelegram /> Telegram</a>
            <a href="mailto:gorelovaee01@gmail.com" style={styles.contactBtn}><FaEnvelope /> Email</a>
          </div>
        </section>

        <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s' }}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Назад</button>
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
  profile: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.8',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
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
    transition: 'all 0.2s ease',
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
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  editBtn: {
    marginTop: '2rem',
    padding: '0.875rem 1.75rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  submitBtn: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  editReview: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    backgroundColor: '#f8fafc',
  },
  editTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  reviews: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  reviewCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    position: 'relative',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    color: '#64748b',
    fontSize: '0.95rem',
  },
  reviewStars: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  reviewDate: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
  reviewText: {
    color: '#475569',
    lineHeight: '1.7',
    marginBottom: '1rem',
  },
  smallEditBtn: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.9rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
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

// === ГЛОБАЛЬНЫЕ СТИЛИ (CSS) ===
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  input:focus, textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  .cancel-btn:hover, .save-btn:hover, .edit-btn:hover, .contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
  }

  .small-edit-btn:hover {
    background-color: #5a67d8;
  }

  @media (max-width: 768px) {
    .profile {
      grid-template-columns: 1fr;
    }
    .button-group {
      flex-direction: column;
    }
    .contact-btn {
      width: 100%;
    }
    .back-btn {
      display: block;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      text-align: center;
    }
  }
`;
styleEl.id = 'client-dashboard-styles';
if (!document.head.querySelector('#client-dashboard-styles')) {
  document.head.appendChild(styleEl);
}
