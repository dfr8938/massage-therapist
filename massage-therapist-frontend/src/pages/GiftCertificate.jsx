// src/pages/GiftCertificate.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';

export default function GiftCertificate() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(3000);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${t('gift_alert') || 'Сертификат заказан'}: ${amount} ₽!`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>{t('gift')}</h2>
        <p style={styles.subtitle}>
          Идеальный подарок для близких — расслабление и забота о теле.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('nominal')} (₽)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
              step="500"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('personal_message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message_placeholder')}
              rows="3"
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.submit}>
            {t('order_gift')}
          </button>
        </form>

        {/* Превью сертификата */}
        <div style={styles.preview}>
          <h4 style={styles.previewTitle}>{t('preview')}</h4>
          <div style={styles.card}>
            <h5 style={styles.cardTitle}>{t('gift')}</h5>
            <p style={styles.cardText}>
              {t('amount')}: <strong>{amount} ₽</strong>
            </p>
            <p style={styles.cardMessage}>
              {message || 'С любовью — Екатерина'}
            </p>
          </div>
        </div>

        <div style={styles.cta}>
          <Link to="/" style={styles.link}>← {t('back')}</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '3rem 1rem',
    maxWidth: '700px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    animation: 'fade-in-up 0.6s ease-out',
  },
  content: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '2.4rem',
    textAlign: 'center',
    marginBottom: '1rem',
    fontFamily: '"Playfair Display", serif',
    color: '#2d3748',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#4a5568',
    marginBottom: '2.5rem',
  },
  form: {
    marginBottom: '3rem',
  },
  inputGroup: {
    marginBottom: '1.8rem',
  },
  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: '0.6rem',
  },
  input: {
    width: '100%',
    padding: '0.85rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '1rem',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.85rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '1rem',
    resize: 'vertical',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  submit: {
    width: '100%',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    padding: '0.95rem',
    borderRadius: '6px',
    fontSize: '1.15rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  preview: {
    textAlign: 'center',
    marginTop: '2.5rem',
    marginBottom: '3rem',
  },
  previewTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1.2rem',
  },
  card: {
    display: 'inline-block',
    border: '2px solid #4299e1',
    borderRadius: '12px',
    padding: '1.8rem 2.2rem',
    backgroundColor: '#ebf8ff',
    textAlign: 'center',
    minWidth: '280px',
    boxShadow: '0 4px 8px rgba(66, 153, 226, 0.1)',
  },
  cardTitle: {
    margin: '0 0 0.6rem 0',
    fontSize: '1.4rem',
    color: '#2b6cb0',
    fontFamily: '"Playfair Display", serif',
  },
  cardText: {
    margin: '0.6rem 0',
    fontSize: '1.15rem',
    color: '#2d3748',
  },
  cardMessage: {
    fontSize: '1rem',
    color: '#4a5568',
    margin: '0.6rem 0 0 0',
    fontStyle: 'italic',
  },
  cta: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  link: {
    color: '#4299e1',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1.15rem',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.3s ease',
  },
};

// Адаптивность
if (window.innerWidth < 768) {
  styles.title.fontSize = '2.1rem';
  styles.submit.fontSize = '1.05rem';
  styles.link.fontSize = '1.05rem';
}
