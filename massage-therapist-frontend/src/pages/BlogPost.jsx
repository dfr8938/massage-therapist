// src/pages/BlogPost.jsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import stressImage from '/images/blog-stress.jpg';
import postureImage from '/images/blog-posture.jpg';
import choosingImage from '/images/blog-choosing.jpg';

export default function BlogPost() {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const posts = {
    '1': {
      title: 'Как массаж помогает снимать стресс',
      image: stressImage,
      content: `
        <p>В современном ритме жизни стресс стал частью повседневности. Он проявляется в виде напряжённых мышц, бессонницы, раздражительности и усталости.</p>
        <p>Массаж — один из самых естественных и эффективных способов борьбы со стрессом. Он напрямую влияет на нервную систему, помогая перейти из состояния "борьбы или бегства" в режим отдыха и восстановления.</p>
        <h3>Физиология расслабления</h3>
        <p>Во время массажа снижается уровень кортизола — гормона стресса. Одновременно растёт уровень серотонина и дофамина — "гормонов счастья". Уже после 15 минут прикосновений начинается процесс восстановления.</p>
        <h3>Дыхание и мышцы</h3>
        <p>Когда мы нервничаем, дыхание становится поверхностным, плечи поднимаются, шея и верхняя часть спины напрягаются. Массаж мягко "разрывает" этот цикл, возвращая телу естественное дыхание и расслабление.</p>
        <h3>Регулярность — ключ к результату</h3>
        <p>Один сеанс — это кратковременное облегчение. Но если делать массаж раз в 1–2 недели, тело начинает "помнить" состояние покоя. Вы становитесь устойчивее к стрессу, спите лучше, чувствуете себя легче.</p>
        <p>Позвольте себе паузу. Иногда лучшее, что вы можете сделать для продуктивности — это остановиться и позволить себе расслабиться.</p>
      `,
      date: '15 апреля 2025',
      readTime: '3 мин',
    },
    '2': {
      title: 'Почему важно следить за осанкой',
      image: postureImage,
      content: `
        <p>Плохая осанка — не просто вопрос внешности. Это сигнал тела о дисбалансе. Со временем она приводит к болям в спине, шее, головным болям и даже проблемам с дыханием.</p>
        <h3>Как формируется осанка</h3>
        <p>Мы не рождаемся с искривлённым позвоночником. Осанка искажается годами: из-за длительного сидения, неправильной обуви, стресса, отсутствия движения.</p>
        <p>Тело адаптируется к вашим привычкам. Если вы сидите сгорбившись — мышцы плеч и спины "запоминают" это положение. Даже в вертикальном положении тело продолжает тянуться вперёд.</p>
        <h3>Массаж и осанка</h3>
        <p>Массаж не исправляет осанку мгновенно, но он снимает мышечное напряжение, которое мешает телу "выпрямиться". После сеанса вы чувствуете, как спина "раскрывается", дыхание становится глубже.</p>
        <p>В сочетании с упражнениями и осознанностью — массаж становится важной частью восстановления баланса.</p>
        <h3>Что можно делать уже сегодня</h3>
        <ul>
          <li>Каждый час вставайте и делайте лёгкую растяжку</li>
          <li>Следите за положением экрана — он должен быть на уровне глаз</li>
          <li>Спите на удобной подушке</li>
          <li>Запишитесь на сеанс — чтобы "сбросить" напряжение</li>
        </ul>
      `,
      date: '8 апреля 2025',
      readTime: '4 мин',
    },
    '3': {
      title: 'Как выбрать массажиста: 5 советов',
      image: choosingImage,
      content: `
        <p>Массаж — это доверие. Вы позволяете человеку прикоснуться к своему телу, поэтому важно чувствовать комфорт и безопасность.</p>
        <h3>1. Проверьте образование и сертификаты</h3>
        <p>Профессиональный массажист — это не тот, кто "просто умеет разминать", а специалист с обучением. Спросите о курсах, сертификатах, опыте.</p>
        <h3>2. Читайте отзывы</h3>
        <p>Ищите не только оценки, но и текстовые отзывы. Обратите внимание, как люди описывают ощущения: "расслабился", "сняли боль", "не было дискомфорта".</p>
        <h3>3. Обратите внимание на общение</h3>
        <p>Хороший массажист спрашивает о состоянии тела, слушает, адаптируется. Если чувствуете давление или игнор — это тревожный знак.</p>
        <h3>4. Пробный сеанс</h3>
        <p>Многие мастера предлагают короткую консультацию или сеанс 30 минут. Это отличный способ понять, подходит ли вам подход.</p>
        <h3>5. Доверяйте ощущениям</h3>
        <p>Если после сеанса вы чувствуете боль, усталость или дискомфорт — что-то пошло не так. Хороший массаж может быть интенсивным, но не болезненным.</p>
        <p>Выбирайте мастера, с которым чувствуете покой.</p>
      `,
      date: '1 апреля 2025',
      readTime: '5 мин',
    },
  };

  const post = posts[id];

  if (!post) {
    return (
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Статья не найдена</h1>
          <p style={styles.heroText}>Такой страницы не существует.</p>
        </div>
        <div style={styles.notFound}>
          <Link to="/blog" style={styles.backLink}>
            ← Вернуться в блог
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Читайте статью: "${post.title}"`);

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
        <h1 style={styles.heroTitle}>{post.title}</h1>
        <div style={styles.heroMeta}>
          <span style={styles.heroMetaItem}>{post.date}</span>
          <span style={styles.heroMetaItem}>Чтение: {post.readTime}</span>
        </div>
      </section>

      {/* Контент статьи */}
      <article
        style={{
          ...styles.article,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
        }}
      >
        {/* Кнопка "Вернуться в блог" */}
        <Link to="/blog" style={styles.backButton}>
          ← Вернуться в блог
        </Link>

        <img
          src={post.image}
          alt={post.title}
          style={styles.featuredImage}
          loading="lazy"
        />

        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Блок "Поделиться" */}
        <div style={styles.share}>
          <p style={styles.shareText}>Поделиться:</p>
          <a
            href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            style={styles.telegramButton}
          >
            Telegram
          </a>
        </div>
      </article>

      {/* CTA */}
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}
      >
        <Link to="/contact" style={styles.ctaButton}>
          Записаться на сеанс
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
  heroMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    fontSize: '1.1rem',
    color: '#475569',
  },
  heroMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  // Статья
  article: {
    backgroundColor: 'white',
    padding: '0 2rem 4rem',
  },

  // Кнопка возврата
  backButton: {
    display: 'inline-block',
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1.1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.3s ease',
  },

  featuredImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '16px',
    margin: '0 0 2.5rem 0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  content: {
    color: '#475569',
    lineHeight: '1.8',
    fontSize: '1.05rem',
  },
  share: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '3rem',
    padding: '1.5rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
  },
  shareText: {
    margin: 0,
    fontWeight: '600',
    color: '#1e40af',
    fontSize: '1.05rem',
  },
  telegramButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#0088cc',
    color: 'white',
    padding: '0.65rem 1.4rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
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

  // 404
  notFound: {
    textAlign: 'center',
    padding: '4rem 1.5rem',
  },
  backLink: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1.1rem',
    borderBottom: '2px solid transparent',
    transition: 'border-color 0.3s ease',
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

  /* Заголовки в контенте */
  ${styles.content} h3 {
    color: #4f46e5;
    font-family: "Playfair Display", serif;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  ${styles.content} ul {
    padding-left: 1.5rem;
    margin: 1.2rem 0;
    color: #475569;
  }

  ${styles.content} li {
    margin-bottom: 0.6rem;
    line-height: 1.7;
  }

  /* Hover */
  .back-button:hover,
  .back-link:hover,
  .telegram-button:hover {
    border-bottom-color: #4f46e5;
  }

  .telegram-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-meta {
      flex-direction: column;
      gap: 0.75rem;
      font-size: 1rem;
    }
    .back-button {
      display: block;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .featured-image {
      height: 220px;
      border-radius: 12px;
    }
    .share {
      flex-direction: column;
    }
    .telegram-button {
      width: 100%;
      justify-content: center;
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
styleEl.id = 'blog-post-styles';
if (!document.head.querySelector('#blog-post-styles')) {
  document.head.appendChild(styleEl);
}
