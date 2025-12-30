// src/pages/Privacy.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Privacy() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        <h1 style={styles.heroTitle}>Политика конфиденциальности</h1>
        <p style={styles.heroText}>
          Как я собираю, использую и защищаю ваши персональные данные.
        </p>
      </section>

      {/* Контент */}
      <div style={styles.content}>
        {/* Введение */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <p style={styles.intro}>
            Настоящая политика конфиденциальности объясняет, как я собираю, использую и защищаю ваши персональные данные при использовании сайта.
          </p>
        </section>

        {/* Раздел 1 */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <h3 style={styles.sectionTitle}>1. Сбор информации</h3>
          <p style={styles.text}>
            Я собираю только ту информацию, которая необходима для связи и записи на сеанс: имя, номер телефона или электронная почта. 
            Данные передаются напрямую через форму на странице «Контакты» и не хранятся в базах третьих лиц.
          </p>
        </section>

        {/* Раздел 2 */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
          }}
        >
          <h3 style={styles.sectionTitle}>2. Использование данных</h3>
          <p style={styles.text}>
            Персональные данные используются исключительно для организации сеанса массажа: подтверждение записи, напоминания, обратная связь. 
            Я не передаю ваши данные третьим лицам без вашего согласия.
          </p>
        </section>

        {/* Раздел 3 */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
          }}
        >
          <h3 style={styles.sectionTitle}>3. Файлы cookie</h3>
          <p style={styles.text}>
            Этот сайт не использует файлы cookie для отслеживания поведения. 
            Единственные cookie могут быть техническими (например, от браузера), и они не содержат персональной информации.
          </p>
        </section>

        {/* Раздел 4 */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
          }}
        >
          <h3 style={styles.sectionTitle}>4. Изменения в политике</h3>
          <p style={styles.text}>
            Я могу время от времени обновлять эту политику. Все изменения будут опубликованы на этой странице с указанием даты последнего обновления. 
            Рекомендую периодически проверять её на актуальность.
          </p>
        </section>

        {/* CTA */}
        <div
          style={{
            ...styles.cta,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s',
          }}
        >
          <p style={styles.ctaText}>
            Последнее обновление: <strong>1 апреля 2025 г.</strong>
          </p>
          <Link to="/contact" style={styles.ctaButton}>
            Связаться со мной
          </Link>
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

  // Основной контент
  content: {
    padding: '0 2rem 4rem',
  },

  // Секции
  section: {
    marginBottom: '3rem',
  },
  intro: {
    fontSize: '1.15rem',
    color: '#64748b',
    lineHeight: '1.7',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 2.5rem',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    color: '#1e293b',
    fontFamily: '"Playfair Display", serif',
    marginBottom: '1.2rem',
    fontWeight: '600',
    lineHeight: '1.4',
  },
  text: {
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.8',
  },

  // CTA
  cta: {
    textAlign: 'center',
    marginTop: '4rem',
  },
  ctaText: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: '1.7',
  },
  ctaButton: {
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

// === Глобальные стили (единые) ===
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

  .cta-button:hover {
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
    .intro,
    .text {
      font-size: 1.1rem;
    }
    .section-title {
      font-size: 1.5rem;
    }
    .cta-button {
      display: block;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      text-align: center;
    }
  }
`;
styleEl.id = 'privacy-page-styles';
if (!document.head.querySelector('#privacy-page-styles')) {
  document.head.appendChild(styleEl);
}
