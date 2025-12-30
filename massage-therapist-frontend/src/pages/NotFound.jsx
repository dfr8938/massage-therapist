// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero */}
      <section
        style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <h1 style={styles.heroTitle}>Ошибка 404</h1>
        <p style={styles.heroText}>
          Страница, которую вы ищете, не найдена.
        </p>
      </section>

      {/* Контент */}
      <div style={styles.content}>
        <div
          style={{
            ...styles.card,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          {/* Иконка */}
          <div style={styles.iconWrapper}>
            <FaExclamationTriangle size={64} color="#e53e3e" />
          </div>

          {/* Заголовок */}
          <h2 style={styles.title}>404</h2>

          {/* Кнопка */}
          <div style={styles.cta}>
            <Link to="/" style={styles.button}>
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    padding: '6rem 1.5rem 4rem',
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

  // Основной контент
  content: {
    padding: '0 2rem 4rem',
    display: 'flex',
    justifyContent: 'center',
  },

  // Карточка
  card: {
    backgroundColor: 'white',
    padding: '4rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '700px',
    width: '100%',
  },

  // Иконка
  iconWrapper: {
    marginBottom: '1.8rem',
    display: 'flex',
    justifyContent: 'center',
  },

  // Заголовок
  title: {
    fontSize: '5rem',
    margin: '0 0 1.5rem 0',
    color: '#e53e3e',
    fontWeight: '700',
    fontFamily: '"Playfair Display", serif',
  },

  // CTA
  cta: {
    marginTop: '1.5rem',
  },

  // Кнопка
  button: {
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

// === Глобальные стили с ID-проверкой ===
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

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-text {
      font-size: 1.1rem;
    }
    .title {
      font-size: 4rem;
    }
    .card {
      padding: 3rem 1.5rem;
    }
    .button {
      display: block;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      text-align: center;
    }
  }
`;
styleEl.id = 'not-found-styles';
if (!document.head.querySelector('#not-found-styles')) {
  document.head.appendChild(styleEl);
}
