// src/components/BookingForm.jsx
import { useState, useEffect } from 'react';

export default function BookingForm() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
  });

  const [step, setStep] = useState('form'); // 'form' | 'confirm' | 'success'
  const [error, setError] = useState('');

  useEffect(() => {
    // Загружаем услуги и записи из db.json
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setAppointments(data.appointments || []);
      })
      .catch(err => {
        console.error('Ошибка загрузки данных:', err);
        setError('Не удалось загрузить услуги');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.serviceId || !formData.date || !formData.time || !formData.name.trim() || !formData.phone) {
      setError('Заполните все поля');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('confirm');
  };

  const confirmBooking = () => {
    // Здесь можно отправить на сервер
    // Пока — просто показываем успех
    setStep('success');
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      date: '',
      time: '',
      name: '',
      phone: '',
    });
    setStep('form');
    setError('');
  };

  if (loading) return <div>Загрузка услуг...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Записаться на приём</h2>

      {step === 'form' && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Услуга</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
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

          <div style={styles.group}>
            <label style={styles.label}>Дата</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Время</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Ваше имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Анна"
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 999-99-99"
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Далее
          </button>
        </form>
      )}

      {step === 'confirm' && (
        <div style={styles.confirm}>
          <h3 style={styles.confirmTitle}>Подтвердите запись</h3>
          <p><strong>Услуга:</strong> {services.find(s => s.id == formData.serviceId)?.name}</p>
          <p><strong>Дата:</strong> {formData.date}, {formData.time}</p>
          <p><strong>Имя:</strong> {formData.name}</p>
          <p><strong>Телефон:</strong> {formData.phone}</p>
          <div style={styles.confirmButtons}>
            <button onClick={() => setStep('form')} style={styles.cancelBtn}>Назад</button>
            <button onClick={confirmBooking} style={styles.confirmBtn}>Подтвердить</button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div style={styles.success}>
          <h3>✅ Заявка отправлена!</h3>
          <p>Скоро мастер свяжется с вами для подтверждения.</p>
          <button onClick={resetForm} style={styles.button}>Записаться снова</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '2rem auto',
    fontFamily: 'Inter, sans-serif',
  },
  title: {
    fontSize: '1.75rem',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontFamily: '"Playfair Display", serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  group: {
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
    padding: '0.95rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  confirm: {
    textAlign: 'center',
    padding: '1rem',
  },
  confirmTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  confirmButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  success: {
    textAlign: 'center',
    padding: '2rem 1rem',
    fontSize: '1.1rem',
    color: '#1e293b',
  },
};
