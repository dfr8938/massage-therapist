// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FaUserMd, FaMedal, FaHeart, FaSpa, FaCalendarCheck } from 'react-icons/fa';
import katyaImage from '/images/katya.jpg';
import { useState, useEffect } from 'react';

export default function Home() {
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
        <h1 style={styles.heroTitle}>Расслабление с Екатериной</h1>
        <p style={styles.heroText}>
          Профессиональный массаж для тела и души. Уникальные техники, уютная атмосфера.
        </p>
        <Link to="/contact" style={styles.heroButton}>
          <FaCalendarCheck style={styles.heroButtonIcon} /> Записаться на сеанс
        </Link>
      </section>

      {/* Обо мне */}
      <div
        style={{
          ...styles.aboutSection,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}
      >
        <h2 style={styles.title}>Обо мне</h2>
        <div style={styles.aboutContent}>
          <img src={katyaImage} alt="Екатерина — массажист" style={styles.avatar} />
          <div style={styles.text}>
            <p>
              Меня зовут <strong>Екатерина</strong> — я профессиональный массажист с более чем 8-летним опытом.
              Специализируюсь на восстановлении тела после нагрузок, снятии хронического напряжения и работе с осанкой.
            </p>
            <p>
              Я прошла обучение в школе телесных практик, регулярно повышаю квалификацию и слежу за новыми методиками.
              Каждый сеанс я строю индивидуально — ваше тело, ваш ритм, ваш комфорт.
            </p>
            <p>
              В работе использую комбинацию классических, шведских и глубоких техник. Главная цель — не просто расслабить,
              а запустить процессы восстановления изнутри.
            </p>

            {/* Иконки */}
            <div style={styles.icons}>
              <div style={styles.iconItem}>
                <FaUserMd size={28} color="#4f46e5" />
                <span style={styles.iconLabel}>Индивидуальный подход</span>
              </div>
              <div style={styles.iconItem}>
                <FaMedal size={28} color="#f59e0b" />
                <span style={styles.iconLabel}>8 лет опыта</span>
              </div>
              <div style={styles.iconItem}>
                <FaHeart size={28} color="#e11d48" />
                <span style={styles.iconLabel}>Забота о теле и душе</span>
              </div>
            </div>

            {/* Кнопка "Подробнее" */}
            <div style={styles.cta}>
              <Link to="/about" style={styles.button}>
                Подробнее об опыте и методах
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div
        style={{
          ...styles.benefits,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}
      >
        <h2 style={styles.title}>Почему клиенты выбирают меня</h2>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitCard}>
            <FaSpa size={36} color="#4f46e5" />
            <h3 style={styles.benefitTitle}>Уютная атмосфера</h3>
            <p style={styles.benefitText}>
              Тихий кабинет, приятные ароматы, спокойная музыка — всё для вашего расслабления.
            </p>
          </div>
          <div style={styles.benefitCard}>
            <FaUserMd size={36} color="#4f46e5" />
            <h3 style={styles.benefitTitle}>Индивидуальный план</h3>
            <p style={styles.benefitText}>
              Сеансы подбираются под ваши цели: от снятия стресса до коррекции осанки.
            </p>
          </div>
          <div style={styles.benefitCard}>
            <FaHeart size={36} color="#4f46e5" />
            <h3 style={styles.benefitTitle}>Поддержка после сеанса</h3>
            <p style={styles.benefitText}>
              Даю рекомендации по уходу и упражнениям для продолжения эффекта.
            </p>
          </div>
        </div>
      </div>

      {/* CTA внизу */}
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
        }}
      >
        <Link to="/contact" style={styles.ctaButton}>
          Связаться для записи →
        </Link>
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
  heroButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.85rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  heroButtonIcon: {
    marginRight: '0.5rem',
  },

  // Обо мне
  aboutSection: {
    padding: '4rem 2rem',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
    fontFamily: '"Playfair Display", serif',
    color: '#1e293b',
  },
  aboutContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
  },
  avatar: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    border: '4px solid #4f46e5',
    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)',
  },
  text: {
    textAlign: 'center',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#475569',
    maxWidth: '800px',
  },
  icons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    margin: '2.5rem 0',
    flexWrap: 'wrap',
  },
  iconItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '1rem',
    color: '#1e293b',
    minWidth: '130px',
  },
  iconLabel: {
    marginTop: '0.75rem',
    fontWeight: '500',
    color: '#334155',
  },
  cta: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.85rem 2.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },

  // Преимущества
  benefits: {
    padding: '4rem 2rem',
  },
  benefitsGrid: {
    display: 'grid',
    gap: '2.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    marginTop: '2rem',
  },
  benefitCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  benefitTitle: {
    fontSize: '1.3rem',
    color: '#1e293b',
    margin: '1rem 0 0.75rem',
  },
  benefitText: {
    color: '#64748b',
    lineHeight: '1.7',
  },

  // CTA внизу
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

  .avatar {
    transition: transform 0.3s ease;
  }
  .avatar:hover {
    transform: scale(1.05);
  }

  .hero-button:hover, .button, .cta-button {
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
      font-size: 2.2rem;
    }
    .icons {
      gap: 1.5rem;
    }
    .benefit-title {
      font-size: 1.2rem;
    }
    .cta-button {
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
    }
  }
`;
document.head.appendChild(styleEl);
