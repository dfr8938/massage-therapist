// src/components/Footer.jsx
import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Копирайт */}
        <p style={styles.text}>
          &copy; 2025 Екатерина — Профессиональный массаж. Все права защищены.
        </p>

        {/* Социальные сети */}
        <div style={styles.social}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            style={styles.iconWrapper}
            className="social-icon"
            aria-label="Instagram"
          >
            <FaInstagram size={24} style={styles.icon} />
          </a>
          <a
            href="https://t.me/katya_massage"
            target="_blank"
            rel="noreferrer"
            style={styles.iconWrapper}
            className="social-icon"
            aria-label="Telegram"
          >
            <FaTelegram size={24} style={styles.icon} />
          </a>
          <a
            href="https://wa.me/79991234567"
            target="_blank"
            rel="noreferrer"
            style={styles.iconWrapper}
            className="social-icon"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={24} style={styles.icon} />
          </a>
        </div>

        {/* Ссылки */}
        <div style={styles.links}>
          <Link to="/privacy" style={styles.link} className="footer-link">
            Политика конфиденциальности
          </Link>
          <Link to="/faq" style={styles.link} className="footer-link">
            Частые вопросы
          </Link>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    color: 'white',
    textAlign: 'center',
    padding: '4rem 1rem 3rem',
    borderTop: '1px solid #334155',
    marginTop: '4rem',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  text: {
    margin: '0 0 1.8rem',
    color: '#cbd5e1',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  social: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: '#334155',
    transition: 'all 0.3s ease',
  },
  icon: {
    color: 'white',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    flexWrap: 'wrap',
    fontSize: '1rem',
  },
  link: {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
};

// === Глобальные стили с ID-проверкой ===
const styleEl = document.createElement('style');
styleEl.textContent = `
  .social-icon:hover {
    transform: translateY(-4px);
    background-color: #4f46e5 !important;
    box-shadow: 0 8px 15px rgba(79, 70, 229, 0.3);
  }

  .footer-link:hover {
    color: #c7d2fe;
    text-decoration: underline;
  }

  .footer-link:hover::after {
    width: 100%;
  }

  .footer-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #c7d2fe;
    transition: width 0.3s ease;
  }

  @media (max-width: 768px) {
    .footer {
      padding: 3rem 1rem 2.5rem;
    }
    .social {
      gap: 1.5rem;
    }
    .icon-wrapper {
      width: 52px;
      height: 52px;
    }
    .links {
      flex-direction: column;
      gap: 1.2rem;
      font-size: 0.95rem;
    }
    .text {
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
`;
styleEl.id = 'footer-styles';
if (!document.head.querySelector('#footer-styles')) {
  document.head.appendChild(styleEl);
}
