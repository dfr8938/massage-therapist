// src/pages/FAQ.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function FAQ() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const faqs = [
    {
      q: 'Сколько длится сеанс массажа?',
      a: 'Стандартный сеанс длится 60 минут. Также доступны сессии по 75 и 90 минут — особенно рекомендую для глубокой проработки или комплексного восстановления.',
    },
    {
      q: 'Что взять с собой на сеанс?',
      a: 'Всё необходимое — масло, полотенца, халат — у меня есть. Вы можете взять сменную одежду, если хотите, но это не обязательно.',
    },
    {
      q: 'Болезненный ли массаж?',
      a: 'Массаж может быть интенсивным, но не должен быть болезненным. Я всегда работаю в комфортном для вас ритме. Главное — говорить о своих ощущениях в процессе.',
    },
    {
      q: 'Как часто можно делать массаж?',
      a: 'Это зависит от целей. Для расслабления — раз в 1–2 недели. Для проработки зажимов или восстановления — курс из 5–10 сеансов с интервалом 2–3 раза в неделю.',
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
        <h1 style={styles.heroTitle}>Вопросы и ответы</h1>
        <p style={styles.heroText}>
          Часто задаваемые вопросы о массаже, записи и подготовке к сеансу.
        </p>
      </section>

      {/* Вопросы */}
      <div style={styles.faqs}>
        {faqs.map((item, i) => (
          <div
            key={i}
            style={{
              ...styles.faqItem,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.8s ease ${0.3 + i * 0.1}s, transform 0.8s ease ${0.3 + i * 0.1}s`,
            }}
            className="faq-item"
          >
            <h3 style={styles.question}>{item.q}</h3>
            <p style={styles.answer}>{item.a}</p>
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
        <p style={styles.ctaText}>
          Не нашли ответ? Свяжитесь со мной — с радостью отвечу.
        </p>
        <Link to="/contact" style={styles.ctaButton}>
          Написать
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

  // Вопросы
  faqs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem',
    padding: '0 2rem 4rem',
  },
  faqItem: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  question: {
    fontSize: '1.4rem',
    color: '#1e293b',
    fontFamily: '"Playfair Display", serif',
    marginBottom: '1rem',
    fontWeight: '600',
    lineHeight: '1.4',
  },
  answer: {
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.7',
  },

  // CTA
  ctaText: {
    fontSize: '1.1rem',
    color: '#475569',
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

  .faq-item:hover {
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
    .question {
      font-size: 1.3rem;
    }
    .answer {
      font-size: 1.05rem;
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
styleEl.id = 'faq-page-styles';
if (!document.head.querySelector('#faq-page-styles')) {
  document.head.appendChild(styleEl);
}
