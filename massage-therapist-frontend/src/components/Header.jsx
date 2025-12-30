/**
 * @file Header.jsx
 * @description Компонент шапки сайта с навигацией, авторизацией и адаптивным меню.
 * Автоматически скрывается при прокрутке вниз. Поддерживает вход, выход, переход в кабинет.
 * @author GigaCode (для вашего SPA-сайта массажиста)
 * @version 1.1
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthModal from './AuthModal.jsx';
import { FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useState, useEffect } from 'react';

/**
 * Основной компонент шапки сайта
 * @returns {JSX.Element} Отрисовка header с навигацией и кнопками авторизации
 */
export default function Header() {
  const { currentUser, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [lastScrollY, setLastScrollY] = useState(0);

  // Скрываем/показываем хедер при скролле
  useEffect(() => {
    /**
     * Обработчик прокрутки страницы
     * @returns {void}
     */
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false); // Скрываем при прокрутке вниз
      } else {
        setIsVisible(true); // Показываем при прокрутке вверх
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Анимация появления логотипа при загрузке
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /**
   * Закрывает мобильное меню
   * @returns {void}
   */
  const closeMenu = () => setIsMenuOpen(false);

  /**
   * Проверяет, активен ли текущий маршрут
   * @param {string} path - Путь для проверки
   * @returns {boolean} true, если маршрут активен
   */
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        style={{
          ...styles.header,
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div style={styles.container}>
          {/* Логотип */}
          <Link
            to="/"
            style={{
              ...styles.logo,
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
            onClick={closeMenu}
          >
            Массаж с Екатериной
          </Link>

          {/* Бургер-меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={styles.burger}
            aria-label="Меню"
          >
            <span
              style={{
                ...burgerStyles.line,
                transform: isMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'rotate(0)',
                opacity: isMenuOpen ? 0.8 : 1,
              }}
            />
            <span
              style={{
                ...burgerStyles.line,
                opacity: isMenuOpen ? 0 : 1,
                transform: isMenuOpen ? 'translateX(10px)' : 'translateX(0)',
              }}
            />
            <span
              style={{
                ...burgerStyles.line,
                transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -5px)' : 'rotate(0)',
                opacity: isMenuOpen ? 0.8 : 1,
              }}
            />
          </button>

          {/* Основная навигация */}
          <nav
            style={{
              ...styles.nav,
              ...(window.innerWidth < 768 ? { display: isMenuOpen ? 'flex' : 'none' } : {}),
            }}
          >
            <HeaderLink to="/" onClick={closeMenu} isActive={isActive('/')}>
              Главная
            </HeaderLink>
            <HeaderLink to="/services" onClick={closeMenu} isActive={isActive('/services')}>
              Услуги
            </HeaderLink>
            <HeaderLink to="/reviews" onClick={closeMenu} isActive={isActive('/reviews')}>
              Отзывы
            </HeaderLink>
            <HeaderLink to="/blog" onClick={closeMenu} isActive={isActive('/blog')}>
              Блог
            </HeaderLink>
            <HeaderLink to="/about" onClick={closeMenu} isActive={isActive('/about')}>
              Обо мне
            </HeaderLink>
            <HeaderLink to="/contact" onClick={closeMenu} isActive={isActive('/contact')}>
              Контакты
            </HeaderLink>
          </nav>

          {/* Правая часть: авторизация / кабинет */}
          <div style={styles.right}>
            {currentUser ? (
              <>
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/client-dashboard'}
                  style={styles.dashboardButton}
                  onClick={closeMenu}
                >
                  <FiUser size={18} style={{ marginRight: '0.5rem' }} />
                  <span>Кабинет</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  style={styles.logoutButton}
                >
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  closeMenu();
                }}
                style={styles.loginButton}
              >
                <FiLogIn size={18} style={{ marginRight: '0.5rem' }} />
                Войти
              </button>
            )}
          </div>
        </div>

        {/* Подложка при открытом меню */}
        {isMenuOpen && window.innerWidth < 768 && (
          <div style={styles.overlay} onClick={closeMenu} />
        )}
      </header>

      {/* Модальное окно авторизации */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
}

/**
 * Компонент ссылки в навигации
 * @param {Object} props
 * @param {string} props.to - Маршрут
 * @param {Function} props.onClick - Обработчик клика
 * @param {boolean} props.isActive - Активен ли маршрут
 * @param {React.ReactNode} props.children - Текст ссылки
 * @returns {JSX.Element}
 */
function HeaderLink({ to, children, onClick, isActive }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        ...styles.link,
        ...(isActive ? styles.linkActive : {}),
      }}
      className={isActive ? 'active-link' : 'header-link'}
    >
      {children}
    </Link>
  );
}

// === СТИЛИ ===
/** @type {Object<string, React.CSSProperties>} */
const styles = {
  header: {
    backgroundColor: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #e2e8f0',
    transition: 'transform 0.3s ease-in-out',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e3a8a',
    textDecoration: 'none',
    fontFamily: '"Playfair Display", serif',
  },
  nav: {
    display: 'flex',
    gap: '2.5rem',
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    position: 'relative',
    padding: '0.5rem 0',
    transition: 'color 0.2s ease',
  },
  linkActive: {
    color: '#4f46e5',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  dashboardButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#e53e3e',
    cursor: 'pointer',
    padding: '0.6rem',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  burger: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    position: 'relative',
    width: '36px',
    height: '36px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
};

/** @type {Object<string, React.CSSProperties>} */
const burgerStyles = {
  line: {
    position: 'absolute',
    height: '3px',
    width: '24px',
    backgroundColor: '#1e293b',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
};

// === Глобальные стили с уникальным ID ===
const styleEl = document.createElement('style');
styleEl.textContent = `
  .header-link::after,
  .active-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #4f46e5;
    transition: width 0.3s ease;
  }

  .header-link:hover::after,
  .active-link::after {
    width: 100%;
  }

  .login-button:hover,
  .dashboard-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
  }

  .logout-button:hover {
    background-color: #fee2e2;
    color: #c53030;
  }

  @media (max-width: 768px) {
    .burger {
      display: block;
    }

    .nav {
      position: fixed;
      top: 0;
      right: 0;
      width: 80%;
      max-width: 320px;
      height: 100vh;
      background-color: white;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 8rem;
      z-index: 1000;
      box-shadow: -6px 0 15px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease;
      transform: translateX(100%);
    }

    .nav[style*='display: flex'] {
      transform: translateX(0);
    }

    .container {
      padding: 1rem;
    }

    .right {
      display: none;
    }

    .overlay {
      display: block;
    }
  }
`;
styleEl.id = 'header-styles';
if (!document.head.querySelector('#header-styles')) {
  document.head.appendChild(styleEl);
}
