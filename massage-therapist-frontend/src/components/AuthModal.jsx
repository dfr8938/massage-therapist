/**
 * @file AuthModal.jsx
 * @description Модальное окно для авторизации: вход, регистрация, восстановление пароля.
 * Поддерживает валидацию, форматирование телефона и плавные переходы.
 * @author GigaCode
 * @version 1.1
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

/**
 * Модальное окно для авторизации
 * @param {Object} props
 * @param {Function} props.onClose - Закрывает модальное окно
 * @returns {JSX.Element} Отрисовка модалки с формами
 */
export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  /** @type {['login' | 'register' | 'reset', Function]} */
  const [activeForm, setActiveForm] = useState('login');

  /** @type {[boolean, Function]} */
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === Данные форм ===
  /** @type {[{ email: string, password: string }, Function]} */
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  /** @type {[{ name: string, email: string, phone: string, password: string, confirmPassword: string }, Function]} */
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  /** @type {[{ email: string }, Function]} */
  const [resetData, setResetData] = useState({ email: '' });

  /** @type {[string, Function]} */
  const [error, setError] = useState('');

  // === Валидация пароля и email ===
  /** @type {[{ length: boolean, hasDigit: boolean, hasLetter: boolean }, Function]} */
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    hasDigit: false,
    hasLetter: false,
  });

  /** @type {[boolean, Function]} */
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  /** @type {[boolean, Function]} */
  const [emailValid, setEmailValid] = useState(true);

  /**
   * Сброс ошибки
   * @returns {void}
   */
  const resetError = () => setError('');

  // === ФОРМАТИРОВАНИЕ ТЕЛЕФОНА ===
  /**
   * Форматирует строку в +7 (XXX) XXX-XX-XX
   * @param {string} value - Вводимый номер
   * @returns {string} Отформатированный номер
   */
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    let number = digits;
    if (number[0] === '8' && number.length > 1) number = number.substring(1);
    if (number[0] === '7' && number.length > 1) number = number.substring(1);
    number = number.slice(0, 10);
    if (number.length < 3) return `+7 (${number}`;
    if (number.length < 6) return `+7 (${number.slice(0, 3)}) ${number.slice(3)}`;
    if (number.length < 9) return `+7 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    return `+7 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 8)}-${number.slice(8)}`;
  };

  /**
   * Обработчик изменения телефона
   * @param {React.ChangeEvent<HTMLInputElement>} e - Событие ввода
   * @returns {void}
   */
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const formatted = formatPhone(raw);
    setRegisterData({ ...registerData, phone: formatted });
  };

  // === ВАЛИДАЦИЯ ===
  /**
   * Проверяет пароль по критериям
   * @param {string} password - Пароль
   * @returns {void}
   */
  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 6,
      hasDigit: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
    };
    setPasswordChecks(checks);
  };

  /**
   * Проверяет совпадение паролей
   * @param {string} password
   * @param {string} confirm
   * @returns {void}
   */
  const checkPasswordsMatch = (password, confirm) => {
    setPasswordsMatch(password === confirm && confirm.length > 0);
  };

  /**
   * Валидирует email
   * @param {string} email
   * @returns {void}
   */
  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(isValid || email === '');
  };

  /**
   * Обработчик изменения полей формы входа
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @returns {void}
   */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (name === 'email') validateEmail(value);
  };

  /**
   * Обработчик изменения полей регистрации
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @returns {void}
   */
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') return;
    setRegisterData({ ...registerData, [name]: value });
    if (name === 'email') validateEmail(value);
    if (name === 'password') {
      validatePassword(value);
      checkPasswordsMatch(value, registerData.confirmPassword);
    }
    if (name === 'confirmPassword') {
      checkPasswordsMatch(registerData.password, value);
    }
  };

  /**
   * Обработчик изменения email при сбросе пароля
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @returns {void}
   */
  const handleResetChange = (e) => {
    const { value } = e.target;
    setResetData({ email: value });
    validateEmail(value);
  };

  // === ОТПРАВКА ФОРМ ===
  /**
   * Обработчик формы входа
   * @param {React.FormEvent} e
   * @returns {Promise<void>}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailValid) {
      setError('Введите корректный email');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Сервер недоступен');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Обработчик формы регистрации
   * @param {React.FormEvent} e
   * @returns {Promise<void>}
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, phone, password, confirmPassword } = registerData;
    if (!name.trim()) {
      setError('Введите имя');
      return;
    }
    if (!emailValid) {
      setError('Введите корректный email');
      return;
    }
    if (!passwordChecks.length || !passwordChecks.hasDigit || !passwordChecks.hasLetter) {
      setError('Пароль должен быть не менее 6 символов, с цифрой и буквой');
      return;
    }
    if (!passwordsMatch) {
      setError('Пароли не совпадают');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').replace(/^7/, '') || '';
      const result = await register(name, email, password, cleanPhone);
      if (result.success) {
        setError('Регистрация успешна! Войдите в систему.');
        setTimeout(() => {
          setActiveForm('login');
          setLoginData({ email, password: '' });
          setError('');
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Обработчик восстановления пароля
   * @param {React.FormEvent} e
   * @returns {Promise<void>}
   */
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailValid || !resetData.email) {
      setError('Введите корректный email');
      return;
    }
    setIsSubmitting(true);
    try {
      setError('На ваш email отправлена ссылка для восстановления (имитация).');
      setTimeout(() => {
        setActiveForm('login');
        setLoginData({ email: resetData.email, password: '' });
        setError('');
      }, 2000);
    } catch (err) {
      setError('Не удалось отправить письмо');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{
          ...styles.modal,
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={styles.title}>
          {activeForm === 'login'
            ? 'Вход в систему'
            : activeForm === 'register'
            ? 'Регистрация'
            : 'Восстановление пароля'}
        </h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.scrollContainer}>
          {/* Форма: Вход */}
          {activeForm === 'login' && (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  name="email"
                  placeholder="ваш@email.com"
                  style={emailValid || loginData.email === '' ? styles.input : styles.inputError}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Пароль</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  name="password"
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Входим...' : 'Войти'}
              </button>

              <div style={styles.links}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm('reset');
                    resetError();
                  }}
                  style={styles.link}
                >
                  Забыли пароль?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm('register');
                    resetError();
                  }}
                  style={styles.link}
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </div>

              <button type="button" onClick={onClose} style={styles.cancel}>
                Отмена
              </button>
            </form>
          )}

          {/* Форма: Регистрация */}
          {activeForm === 'register' && (
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Имя</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  placeholder="Ваше имя"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  name="email"
                  placeholder="ваш@email.com"
                  style={emailValid || registerData.email === '' ? styles.input : styles.inputError}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Телефон (опц.)</label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 999-99-99"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Пароль</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  name="password"
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.hints}>
                <div style={styles.hintItem(passwordChecks.length)}>≥ 6 символов</div>
                <div style={styles.hintItem(passwordChecks.hasLetter)}>Содержит букву</div>
                <div style={styles.hintItem(passwordChecks.hasDigit)}>Содержит цифру</div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Подтвердите пароль</label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  name="confirmPassword"
                  placeholder="••••••••"
                  style={passwordsMatch || registerData.confirmPassword === '' ? styles.input : styles.inputError}
                  required
                />
              </div>

              {registerData.confirmPassword && (
                <div style={styles.hintMatch(passwordsMatch)}>
                  {passwordsMatch ? 'Пароли совпадают' : 'Пароли не совпадают'}
                </div>
              )}

              <button type="submit" style={styles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
              </button>

              <div style={styles.links}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm('login');
                    resetError();
                  }}
                  style={styles.link}
                >
                  Уже есть аккаунт? Войти
                </button>
              </div>

              <button type="button" onClick={onClose} style={styles.cancel}>
                Отмена
              </button>
            </form>
          )}

          {/* Форма: Восстановление */}
          {activeForm === 'reset' && (
            <form onSubmit={handleReset} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  placeholder="ваш@email.com"
                  style={emailValid || resetData.email === '' ? styles.input : styles.inputError}
                  required
                />
              </div>

              <p style={styles.hint}>
                Мы отправим ссылку для сброса пароля на указанный email.
              </p>

              <button type="submit" style={styles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Отправляем...' : 'Отправить'}
              </button>

              <div style={styles.links}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm('login');
                    resetError();
                  }}
                  style={styles.link}
                >
                  Назад ко входу
                </button>
              </div>

              <button type="button" onClick={onClose} style={styles.cancel}>
                Отмена
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// === СТИЛИ ===
/** @type {Record<string, React.CSSProperties>} */
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    width: '90%',
    maxWidth: '440px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1e3a8a',
    fontFamily: '"Playfair Display", serif',
    textAlign: 'center',
    marginBottom: '1.5rem',
    marginTop: 0,
  },
  error: {
    padding: '1rem',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: '0.95rem',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '1.5rem',
    border: '1px solid #fecaca',
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: 'calc(90vh - 180px)',
    paddingRight: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
  },
  input: {
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  inputError: {
    padding: '0.875rem',
    border: '2px solid #e53e3e',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  button: {
    padding: '0.95rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  cancel: {
    padding: '0.95rem',
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontSize: '0.95rem',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
    textDecoration: 'none',
    fontWeight: '500',
  },
  hint: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontStyle: 'italic',
    margin: '0.5rem 0 1rem',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  hints: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#64748b',
  },
  hintItem: (passed) => ({
    color: passed ? '#16a34a' : '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    fontWeight: passed ? '500' : '400',
  }),
  hintMatch: (passed) => ({
    fontSize: '0.85rem',
    color: passed ? '#16a34a' : '#b91c1c',
    marginTop: '0.25rem',
    textAlign: 'left',
  }),
};

// === Глобальные стили ===
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

  input:focus, textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
  }

  .link:hover {
    color: #4338ca;
    text-decoration: underline;
  }

  /* Скроллбар */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;
styleEl.id = 'auth-modal-styles';
if (!document.head.querySelector('#auth-modal-styles')) {
  document.head.appendChild(styleEl);
}
