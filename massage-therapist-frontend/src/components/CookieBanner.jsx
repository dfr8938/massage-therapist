// src/components/CookieBanner.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/index.jsx';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, принимал ли пользователь куки
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleMore = () => {
    // Можно открыть модалку с политикой или перейти на страницу
    window.open('/privacy', '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text} aria-live="polite">
        {t('cookie_text')}
      </p>
      <div style={styles.buttons}>
        <button
          type="button"
          onClick={handleMore}
          style={styles.linkButton}
          aria-label={t('cookie_read_more')}
        >
          {t('cookie_read_more')}
        </button>
        <button
          type="button"
          onClick={accept}
          style={styles.acceptButton}
          autoFocus
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    position: 'fixed',
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    backgroundColor: '#1a202c',
    color: 'white',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95rem',
    zIndex: 1000,
    gap: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: 1,
    transform: 'translateY(0)',
    animation: 'slideInUp 0.4s ease forwards',
    flexWrap: 'wrap',
  },

  text: {
    flex: '1 1 300px',
    margin: 0,
    lineHeight: '1.5',
  },

  buttons: {
    flex: '0 0 auto',
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  linkButton: {
    backgroundColor: 'transparent',
    color: '#90cdf4',
    border: '1px solid #90cdf4',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },

  acceptButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    whiteSpace: 'nowrap',
  },

  // Анимация появления
  '@keyframes slideInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

// Добавляем стили в head
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  [data-cookie-banner] button:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  [data-cookie-banner] button:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    [data-cookie-banner] {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
      padding: 1rem;
    }

    [data-cookie-banner] p {
      margin-bottom: 0.5rem;
    }

    [data-cookie-banner] .btn-row {
      width: 100%;
      justify-content: center;
    }
  }
`;

styleEl.setAttribute('data-cookie-banner', '');
document.head.appendChild(styleEl);
