// src/pages/Reviews.jsx
import { useState, useEffect } from 'react';

export default function Reviews() {
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date'); // 'date', 'name'
  const [filter, setFilter] = useState('all'); // '7d', '30d', 'all'

  // Имитация загрузки отзывов
  useEffect(() => {
    setIsVisible(true);

    const mockReviews = [
      {
        id: 1,
        name: 'Анна',
        text: 'Екатерина — настоящий мастер. После сеанса почувствовала, как будто сбросила с плеч 10 кг напряжения. Очень рекомендую!',
        date: '2025-04-10',
        formattedDate: '10 апреля 2025',
        rating: 5,
      },
      {
        id: 2,
        name: 'Дмитрий',
        text: 'Прошёл курс из 5 сеансов. Осанка улучшилась, пропала боль в шее. Методика действительно работает.',
        date: '2025-04-03',
        formattedDate: '3 апреля 2025',
        rating: 5,
      },
      {
        id: 3,
        name: 'Ольга',
        text: 'Атмосфера — как дома. Мягкие руки, забота, никакой спешки. Такого расслабления я давно не испытывала.',
        date: '2025-03-28',
        formattedDate: '28 марта 2025',
        rating: 5,
      },
      {
        id: 4,
        name: 'Марина',
        text: 'Очень чуткий и внимательный массажист. Учитывает все пожелания. Приду ещё!',
        date: '2025-03-15',
        formattedDate: '15 марта 2025',
        rating: 4,
      },
    ];
    setReviews(mockReviews);
  }, []);

  // Фильтрация и сортировка
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      // Поиск по имени
      if (search && !review.name.toLowerCase().includes(search.toLowerCase())) return false;

      // Фильтр по дате
      const today = new Date();
      const reviewDate = new Date(review.date);
      const diffTime = today - reviewDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filter === '7d' && diffDays > 7) return false;
      if (filter === '30d' && diffDays > 30) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'date') return new Date(b.date) - new Date(a.date);
      return 0;
    });

  // Рендер звёзд
  const renderStars = (rating) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={star <= rating ? styles.starActive : styles.starInactive}>
            ★
          </span>
        ))}
      </div>
    );
  };

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
        <h1 style={styles.heroTitle}>Отзывы клиентов</h1>
        <p style={styles.heroText}>
          Что говорят мои клиенты — лучшее подтверждение качества.
        </p>
      </section>

      {/* Фильтры */}
      <div
        style={{
          ...styles.filters,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}
      >
        <div style={styles.searchGroup}>
          <label style={styles.label}>Поиск по имени:</label>
          <input
            type="text"
            placeholder="Введите имя..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Период:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.select}>
            <option value="all">Всё время</option>
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
          </select>
        </div>

        <div style={styles.sortGroup}>
          <label style={styles.label}>Сортировать:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
            <option value="date">По дате</option>
            <option value="name">По имени</option>
          </select>
        </div>
      </div>

      {/* Отзывы */}
      <div style={styles.reviews}>
        {filteredAndSortedReviews.length === 0 ? (
          <p style={styles.noReviews}>Нет отзывов, подходящих под выбранные фильтры.</p>
        ) : (
          filteredAndSortedReviews.map((review, i) => (
            <div
              key={review.id}
              style={{
                ...styles.reviewCard,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.8s ease ${0.3 + i * 0.1}s, transform 0.8s ease ${0.3 + i * 0.1}s`,
              }}
            >
              {renderStars(review.rating)}
              <p style={styles.reviewText}>"{review.text}"</p>
              <div style={styles.reviewMeta}>
                <strong>{review.name}</strong>
                <span style={styles.date}>{review.formattedDate}</span>
              </div>
            </div>
          ))
        )}
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
        <a href="/contact" style={styles.ctaButton}>
          Записаться на сеанс →
        </a>
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

  // Фильтры
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
    padding: '0 2rem 3rem',
  },
  searchGroup: { flex: '1 1 200px' },
  filterGroup: { flex: '1 1 200px' },
  sortGroup: { flex: '1 1 200px' },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    color: '#334155',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },

  // Отзывы
  reviews: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '0 2rem 4rem',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  reviewText: {
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.7',
    fontStyle: 'italic',
    marginBottom: '1rem',
  },
  reviewMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    color: '#1e293b',
  },
  date: {
    color: '#64748b',
    fontWeight: '400',
  },
  noReviews: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '2rem',
    fontSize: '1.05rem',
  },

  // Звёзды
  stars: {
    marginBottom: '0.75rem',
    fontSize: '1.2rem',
  },
  starActive: {
    color: '#fbbf24',
    textShadow: '0 0 2px rgba(0,0,0,0.2)',
  },
  starInactive: {
    color: '#e2e8f0',
  },

  // CTA
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

// === Общие стили (как в Home.jsx) ===
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

  input:focus,
  select:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  .review-card:hover {
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
    .filters,
    .reviews {
      padding: 0 1rem;
    }
    .filters {
      flex-direction: column;
      gap: 1rem;
    }
    .review-text {
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
styleEl.id = 'reviews-page-styles';
if (!document.head.querySelector('#reviews-page-styles')) {
  document.head.appendChild(styleEl);
}
