// src/components/BookingForm.jsx
import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
  });

  const [error, setError] = useState('');

  // Форматирование телефона: +7 (XXX) XXX-XX-XX
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    let number = digits;
    if (number[0] === '8' && number.length > 1) number = number.substring(1);
    if (number[0] === '7' && number.length > 1) number = number.substring(1);
    number = number.slice(0, 10);
    if (number.length < 3) return `+7 (${number}`;
    if (number.length < 6) return `+7 (${number.slice(0, 3)}) ${number.slice(3)}`;
    if (number.length < 9) return `+7 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    return `+7 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 8)}-${number.slice(8)}`;
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const formatted = formatPhone(raw);
    setFormData({ ...formData, phone: formatted });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'phone') {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация
    if (!formData.name.trim()) {
      setError('Введите имя');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '').replace(/^7/, '');
    if (phoneDigits.length !== 10) {
      setError('Введите корректный телефон');
      return;
    }

    if (!formData.service) {
      setError('Выберите услугу');
      return;
    }

    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay(); // 0 – вс, 1 – пн, ..., 6 – сб
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setError('Запись доступна только в будние дни (пн–пт)');
      return;
    }

    if (!formData.time) {
      setError('Выберите время');
      return;
    }

    setError('');
    alert(`Запись оформлена!\nУслуга: ${formData.service}\nДата: ${formData.date} в ${formData.time}\nИмя: ${formData.name}\nТелефон: ${formData.phone}`);
  };

  // Генерация времени с шагом 30 минут (с 9:00 до 20:00)
  const timeOptions = [];
  for (let hour = 9; hour <= 19; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  timeOptions.push('20:00');

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Записаться на приём</h3>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Иван Иванов"
          required
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="phone"
          placeholder="+7 (999) 999-99-99"
          required
          value={formData.phone}
          onChange={handlePhoneChange}
          style={styles.input}
        />

        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Выберите услугу</option>
          <option value="Классический массаж">Классический массаж</option>
          <option value="Спортивный массаж">Спортивный массаж</option>
          <option value="Антицеллюлитный массаж">Антицеллюлитный массаж</option>
          <option value="Релакс-массаж">Релакс-массаж</option>
        </select>

        <input
          type="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          style={styles.input}
        />

        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Выберите время</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          Записаться
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f0fff4',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #c6f6d5',
    maxWidth: '500px',
    margin: '2rem auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2f855a',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '0.5rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.75rem',
    marginBottom: '0.75rem',
    border: '1px solid #a2fca2',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border 0.2s',
  },
  inputFocus: {
    border: '1px solid #48bb78',
    outline: 'none',
  },
  button: {
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    marginTop: '0.5rem',
  },
  buttonHover: {
    backgroundColor: '#38a169',
  },
};
