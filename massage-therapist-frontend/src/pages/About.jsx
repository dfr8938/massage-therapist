// src/pages/About.jsx
import { Link } from 'react-router-dom';
import {
  FaQuoteLeft,
  FaStar,
  FaHeart,
  FaGraduationCap,
  FaPaperPlane,
} from 'react-icons/fa';
import katyaImage from '/images/katya.jpg';
import { useState, useEffect } from 'react';

export default function About() {
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
        <h1 style={styles.heroTitle}>Обо мне</h1>
        <p style={styles.heroText}>
          Профессиональный массаж с заботой о теле и душе.
        </p>
      </section>

      {/* Контент */}
      <div style={styles.content}>
        {/* Фото и вступление */}
        <div
          style={{
            ...styles.intro,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <img
            src={katyaImage}
            alt="Екатерина — массажист"
            style={styles.avatar}
            loading="lazy"
          />
          <p style={styles.introText}>
            Меня зовут <strong>Екатерина</strong> — я профессиональный массажист с 8-летним опытом.
            Для меня массаж — это не просто техника, а способ помочь телу и душе обрести баланс.
          </p>
        </div>

        {/* Философия */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <h3 style={styles.sectionTitle}>
            <FaHeart style={styles.icon} /> Моя философия
          </h3>
          <p style={styles.text}>
            Я верю, что каждый человек уникален. Именно поэтому каждый сеанс я строю индивидуально —
            с учётом вашего состояния, целей и ощущений. Главное — не навязывать шаблоны, а слушать тело.
          </p>
        </section>

        {/* Образование */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
          }}
        >
          <h3 style={styles.sectionTitle}>
            <FaGraduationCap style={styles.icon} /> Образование и опыт
          </h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Выпускница школы телесных практик «Созвездие» (2017)</li>
            <li style={styles.listItem}>Сертифицированный специалист по классическому и шведскому массажу</li>
            <li style={styles.listItem}>Прошла курсы по глубокотканным техникам и работе с осанкой</li>
            <li style={styles.listItem}>Регулярно участвую в мастер-классах и повышаю квалификацию</li>
          </ul>
        </section>

        {/* Что вы получите */}
        <section
          style={{
            ...styles.section,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
          }}
        >
          <h3 style={styles.sectionTitle}>
            <FaStar style={styles.icon} /> Что вы получите на сеансе
          </h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Глубокое расслабление мышц и снятие хронического напряжения</li>
            <li style={styles.listItem}>Улучшение осанки и подвижности суставов</li>
            <li style={styles.listItem}>Повышение общего тонуса и качества сна</li>
            <li style={styles.listItem}>Чувство лёгкости и внутреннего покоя</li>
          </ul>
        </section>

        {/* Цитата */}
        <div
          style={{
            ...styles.quote,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
          }}
        >
          <FaQuoteLeft style={styles.quoteIcon} />
          <p style={styles.quoteText}>
            «Массаж — это диалог с телом. И я — его переводчик»
          </p>
          <p style={styles.quoteAuthor}>— Екатерина</p>
        </div>

        {/* CTA */}
        <div
          style={{
            ...styles.cta,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s',
          }}
        >
          <Link to="/services" style={styles.primaryButton}>
            Посмотреть услуги
          </Link>
          <Link to="/contact" style={styles.secondaryButton}>
            <FaPaperPlane style={styles.buttonIcon} /> Связаться для записи
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

  // Вступление
  intro: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.8rem',
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  avatar: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    border: '4px solid #4f46e5',
    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)',
    transition: 'transform 0.3s ease',
  },
  introText: {
    fontSize: '1.15rem',
    color: '#475569',
    lineHeight: '1.8',
    maxWidth: '700px',
  },

  // Секции
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#1e293b',
    fontFamily: '"Playfair Display", serif',
    marginBottom: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  icon: {
    color: '#4f46e5',
  },
  text: {
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.8',
  },
  list: {
    paddingLeft: '1.5rem',
    lineHeight: '2.1',
    color: '#475569',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  listItem: {
    position: 'relative',
    paddingLeft: '1.8rem',
    fontSize: '1.1rem',
    color: '#475569',
    marginBottom: '0.75rem',
  },

  // Цитата
  quote: {
    textAlign: 'center',
    padding: '2.5rem 2rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '16px',
    borderLeft: '6px solid #4f46e5',
    margin: '4rem 0 3.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  quoteIcon: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    color: '#bfdbfe',
    fontSize: '2.5rem',
  },
  quoteText: {
    fontSize: '1.4rem',
    fontStyle: 'italic',
    color: '#1e40af',
    margin: '0 0 0.8rem 0',
    position: 'relative',
    zIndex: 2,
  },
  quoteAuthor: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '1.1rem',
    margin: 0,
  },

  // Кнопки
  cta: {
    textAlign: 'center',
    marginTop: '3.5rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.95rem 2.4rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.15rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
    transition: 'all 0.2s ease',
    gap: '0.5rem',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    padding: '0.95rem 2.4rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.15rem',
    border: '2px solid #4f46e5',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
    transition: 'all 0.2s ease',
    gap: '0.5rem',
  },
  buttonIcon: {
    marginRight: '0.5rem',
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

  /* Маркеры списка */
  ${styles.listItem}::before {
    content: "•";
    color: #4f46e5;
    font-weight: bold;
    position: absolute;
    left: 0;
    top: 0;
  }

  /* Ховер для аватара */
  .avatar:hover {
    transform: scale(1.05);
  }

  /* Ховер для кнопок */
  .primary-button:hover,
  .secondary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-text {
      font-size: 1.1rem;
    }
    .intro-text,
    .list-item,
    .text {
      font-size: 1.1rem;
    }
    .quote-text {
      font-size: 1.25rem;
    }
    .cta {
      flex-direction: column;
      gap: 1rem;
    }
    .primary-button,
    .secondary-button {
      width: 100%;
      max-width: 320px;
      justify-content: center;
    }
  }
`;
styleEl.id = 'about-page-styles';
if (!document.head.querySelector('#about-page-styles')) {
  document.head.appendChild(styleEl);
}
