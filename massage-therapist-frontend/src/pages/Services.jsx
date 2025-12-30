// src/pages/Services.jsx
import { Link } from 'react-router-dom';
import { FaHands, FaDumbbell, FaSpa, FaUserMd } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      title: 'Классический массаж',
      duration: '60 / 75 / 90 мин',
      price: '3000 / 3800 / 4500 ₽',
      description: 'Глубокое расслабление мышц, снятие напряжения, улучшение кровообращения.',
      icon: <FaHands size={36} color="#4f46e5" />,
    },
    {
      title: 'Спортивный массаж',
      duration: '60 мин',
      price: '3500 ₽',
      description: 'Профилактика травм, восстановление после нагрузок, работа с зажатыми мышцами.',
      icon: <FaDumbbell size={36} color="#4f46e5" />,
    },
    {
      title: 'Массаж шеи и спины',
      duration: '45 мин',
      price: '2500 ₽',
      description: 'Снятие напряжения в области шеи, плеч, верхней части спины.',
      icon: <FaUserMd size={36} color="#4f46e5" />,
    },
    {
      title: 'Релакс-массаж',
      duration: '60 мин',
      price: '3200 ₽',
      description: 'Мягкие техники для полного расслабления, снятия стресса и бессонницы.',
      icon: <FaSpa size={36} color="#4f46e5" />,
    },
  ];

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
        <h1 style={styles.heroTitle}>Услуги и цены</h1>
        <p style={styles.heroText}>
          Все сеансы проходят в уютной атмосфере. Масло, полотенца, халат — всё включено.
        </p>
      </section>

      {/* Сетка услуг */}
      <div style={styles.grid}>
        {services.map((service, i) => (
          <div
            key={i}
            style={{
              ...styles.benefitCard,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.8s ease ${0.2 + i * 0.1}s, transform 0.8s ease ${0.2 + i * 0.1}s`,
            }}
          >
            <div style={styles.iconWrapper}>{service.icon}</div>
            <h3 style={styles.benefitTitle}>{service.title}</h3>
            <p style={styles.benefitText}>{service.description}</p>
            <div style={styles.details}>
              <span>⏱️ <strong>Длительность:</strong> {service.duration}</span>
              <span>💰 <strong>Стоимость:</strong> {service.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
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
          Записаться на сеанс →
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

  // Сетка услуг
  grid: {
    display: 'grid',
    gap: '2.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    padding: '0 2rem 4rem',
  },

  // Карточки (как в Home.jsx)
  benefitCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  iconWrapper: {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
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
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1.2rem',
    fontSize: '1rem',
    color: '#475569',
    textAlign: 'left',
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

// Встраиваем стили из Home.jsx (без дублирования)
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

  .benefit-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .benefit-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
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
    .benefit-title {
      font-size: 1.2rem;
    }
    .details {
      font-size: 0.95rem;
    }
    .cta-button {
      display: block;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      text-align: center;
    }
    .grid {
      padding: 0 1rem;
    }
  }
`;
styleEl.id = 'services-page-styles';
if (!document.head.querySelector('#services-page-styles')) {
  document.head.appendChild(styleEl);
}
