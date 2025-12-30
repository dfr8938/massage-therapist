// src/pages/Blog.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import stressImage from '/images/blog-stress.jpg';
import postureImage from '/images/blog-posture.jpg';
import choosingImage from '/images/blog-choosing.jpg';

export default function Blog() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const posts = [
    {
      id: 1,
      title: 'Как массаж помогает снимать стресс',
      excerpt:
        'Регулярный массаж снижает уровень кортизола — гормона стресса. Уже после первого сеанса вы почувствуете, как тело и разум начинают "отключаться" от тревоги.',
      date: '15 апреля 2025',
      readTime: '3 мин',
      image: stressImage,
    },
    {
      id: 2,
      title: 'Почему важно следить за осанкой',
      excerpt:
        'Плохая осанка — не только косметическая проблема. Она ведёт к болям в спине, головным болям и усталости. Массаж и упражнения помогут восстановить баланс.',
      date: '8 апреля 2025',
      readTime: '4 мин',
      image: postureImage,
    },
    {
      id: 3,
      title: 'Как выбрать массажиста: 5 советов',
      excerpt:
        'Не все массажисты одинаковы. Вот что важно проверить перед записью: сертификаты, отзывы, стиль общения и ощущения во время консультации.',
      date: '1 апреля 2025',
      readTime: '5 мин',
      image: choosingImage,
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
        <h1 style={styles.heroTitle}>Блог</h1>
        <p style={styles.heroText}>
          Полезные статьи о массаже, теле и заботе о себе.
        </p>
      </section>

      {/* Статьи */}
      <div style={styles.posts}>
        {posts.map((post, i) => (
          <article
            key={post.id}
            style={{
              ...styles.post,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.8s ease ${0.3 + i * 0.1}s, transform 0.8s ease ${0.3 + i * 0.1}s`,
            }}
            className="blog-post"
          >
            <img src={post.image} alt={post.title} style={styles.postImage} loading="lazy" />
            <div style={styles.postContent}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postExcerpt}>{post.excerpt}</p>

              <div style={styles.postMeta}>
                <span style={styles.date}>{post.date}</span>
                <span style={styles.readTime}>Чтение: {post.readTime}</span>
              </div>

              <Link to={`/blog/${post.id}`} style={styles.readMore}>
                Читать далее →
              </Link>
            </div>
          </article>
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
          Скоро — новые статьи о дыхании, сне и восстановлении после нагрузок.
        </p>
        <Link to="/" style={styles.link}>
          ← Вернуться на главную
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

  // Статьи
  posts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    padding: '0 2rem 4rem',
  },
  post: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  postImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  postContent: {
    padding: '2rem',
  },
  postTitle: {
    fontSize: '1.6rem',
    margin: '0 0 1rem 0',
    fontFamily: '"Playfair Display", serif',
    color: '#1e293b',
    lineHeight: '1.4',
  },
  postExcerpt: {
    color: '#475569',
    lineHeight: '1.7',
    fontSize: '1.05rem',
    marginBottom: '1.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  postMeta: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.95rem',
    color: '#718096',
    marginBottom: '1.2rem',
  },
  date: {
    fontWeight: '500',
  },
  readTime: {
    fontWeight: '500',
  },
  readMore: {
    display: 'inline-block',
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '1.05rem',
    borderBottom: '2px solid transparent',
    transition: 'color 0.3s ease, border-color 0.3s ease',
  },

  // CTA
  ctaText: {
    fontSize: '1.1rem',
    color: '#475569',
    marginBottom: '1.5rem',
    lineHeight: '1.7',
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1.1rem',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.3s ease',
  },
};

// === Глобальные стили (единые для всех страниц) ===
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

  .blog-post:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  }

  .blog-post a {
    transition: color 0.3s ease, border-color 0.3s ease;
  }

  .blog-post a:hover {
    color: #4338ca;
    border-bottom-color: #4338ca;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-text {
      font-size: 1.1rem;
    }
    .post-title {
      font-size: 1.5rem;
    }
    .post-excerpt {
      font-size: 1.05rem;
    }
    .post-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    .posts,
    .reviews,
    .filters,
    .benefits-grid {
      padding: 0 1rem;
    }
    .cta-text,
    .link {
      font-size: 1.05rem;
    }
  }
`;
styleEl.id = 'blog-page-styles';
if (!document.head.querySelector('#blog-page-styles')) {
  document.head.appendChild(styleEl);
}
