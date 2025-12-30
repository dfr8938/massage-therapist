// src/pages/Contact.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // === Обработчики ввода ===
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[а-яА-ЯёЁa-zA-Z\s\-]*$/.test(value)) {
      setForm({ ...form, name: value });
      if (!value.trim()) {
        setErrors({ ...errors, name: "Введите имя" });
      } else if (value.trim().length < 2) {
        setErrors({ ...errors, name: "Слишком короткое имя" });
      } else {
        setErrors({ ...errors, name: "" });
      }
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = value.slice(0, 11);
      let formatted = "+7";
      if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
      if (value.length >= 4) formatted += `) ${value.slice(4, 7)}`;
      if (value.length >= 7) formatted += `-${value.slice(7, 9)}`;
      if (value.length >= 9) formatted += `-${value.slice(9, 11)}`;
      setForm({ ...form, phone: formatted });
    } else {
      setForm({ ...form, phone: "" });
    }
    setErrors({ ...errors, phone: "" });
  };

  const handleMessageChange = (e) => {
    let value = e.target.value;
    value = value.replace(/<[^>]*>/g, "");
    const sanitized = value
      .replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s\.\,\!\?\;\:\-\(\)\"\'\«\»«»]/g, "")
      .slice(0, 1000);

    setForm({ ...form, message: sanitized });

    if (!sanitized.trim()) {
      setErrors({ ...errors, message: "Введите сообщение" });
    } else if (sanitized.trim().length < 10) {
      setErrors({ ...errors, message: "Минимум 10 символов" });
    } else {
      setErrors({ ...errors, message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Введите имя";
    else if (form.name.trim().length < 2)
      newErrors.name = "Слишком короткое имя";

    if (!form.phone || !/\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/.test(form.phone))
      newErrors.phone = "Введите корректный телефон";

    if (!form.message.trim()) newErrors.message = "Введите сообщение";
    else if (form.message.trim().length < 10)
      newErrors.message = "Минимум 10 символов";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setForm({ name: "", phone: "", message: "" });
        showToast("Сообщение отправлено! Скоро свяжемся.", "success");
        setErrors({});
      } else {
        showToast(data.error || "Ошибка отправки. Попробуйте позже.", "error");
      }
    } catch (err) {
      showToast("Сервер недоступен. Попробуйте позже.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={styles.container}>
      {/* Toast */}
      {toast && (
        <div
          className={
            toast.type === "success"
              ? "toast toast-success"
              : "toast toast-error"
          }
        >
          {toast.type === "success" ? (
            <FaCheckCircle style={styles.toastIcon} />
          ) : (
            <FaTimesCircle style={styles.toastIcon} />
          )}
          {toast.message}
        </div>
      )}

      {/* Hero Section */}
      <section
        style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <h1 style={styles.heroTitle}>Контакты</h1>
        <p style={styles.heroText}>
          Свяжитесь с Екатериной любым удобным способом
        </p>
      </section>

      {/* Сетка: контакты + форма */}
      <div style={styles.grid}>
        {/* Контакты */}
        <div
          style={{
            ...styles.contactSection,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          <h2 style={styles.sectionTitle}>
            <FaMapMarkerAlt style={{ marginRight: "0.5rem" }} /> Информация
          </h2>

          <div style={styles.infoItem}>
            <FaMapMarkerAlt style={styles.icon} />
            <div>
              <strong>Адрес</strong>
              <p>г. Москва, ул. Новослободская, д. 5, стр. 2</p>
            </div>
          </div>

          <div style={styles.infoItem}>
            <FaPhone style={styles.icon} />
            <div>
              <strong>Телефон</strong>
              <p>
                <a href="tel:+79255616201" style={styles.link}>
                  +7 (925) 561-62-01
                </a>
              </p>
            </div>
          </div>

          <div style={styles.infoItem}>
            <FaEnvelope style={styles.icon} />
            <div>
              <strong>Email</strong>
              <p>
                <a href="mailto:gorelovaee01@gmail.com" style={styles.link}>
                  gorelovaee01@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div style={styles.infoItem}>
            <FaClock style={styles.icon} />
            <div>
              <strong>Часы работы</strong>
              <p>
                Пн–Пт: 10:00–21:00
                <br />
                Сб–Вс: 11:00–20:00
              </p>
            </div>
          </div>

          <div style={styles.social}>
            <a
              href="https://wa.me/79255616201"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon whatsapp"
              style={styles.socialIcon}
            >
              <FaWhatsapp size="2rem" />
            </a>
            <a
              href="https://t.me/katya_massage"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon telegram"
              style={styles.socialIcon}
            >
              <FaTelegram size="2rem" />
            </a>
            <a
              href="https://instagram.com/katya_massage_msk"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
              style={styles.socialIcon}
            >
              <FaInstagram size="2rem" />
            </a>
          </div>
        </div>

        {/* Форма */}
        <div
          style={{
            ...styles.formSection,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          <h2 style={styles.sectionTitle}>Напишите Екатерине</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Ваше имя *</label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Анна"
                required
                style={
                  errors.name
                    ? { ...styles.input, borderColor: "#e53e3e" }
                    : styles.input
                }
              />
              {errors.name && <span style={styles.error}>{errors.name}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Телефон *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="+7 (999) 999-99-99"
                required
                style={
                  errors.phone
                    ? { ...styles.input, borderColor: "#e53e3e" }
                    : styles.input
                }
              />
              {errors.phone && <span style={styles.error}>{errors.phone}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Сообщение *</label>
              <textarea
                value={form.message}
                onChange={handleMessageChange}
                placeholder="Здравствуйте, Екатерина! Хотела бы записаться на массаж..."
                rows="5"
                required
                style={
                  errors.message
                    ? { ...styles.textarea, borderColor: "#e53e3e" }
                    : styles.textarea
                }
                maxLength="1000"
              />
              {errors.message && (
                <span style={styles.error}>{errors.message}</span>
              )}
              <div style={styles.counter}>{form.message.trim().length}/10</div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Отправляется..." : "Отправить"}
              <FaArrowRight style={{ marginLeft: "0.5rem" }} />
            </button>
          </form>
        </div>
      </div>

      {/* Карта */}
      <div
        style={{
          ...styles.mapContainer,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
        }}
      >
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Afe1be3cbe84dafbf79c66ace31da576ebcb8c099ef80766db52bbfee9a39d1cd&amp;source=constructor"
          width="100%"
          height="400"
          frameBorder="0"
          style={styles.map}
          title="Карта салона"
        ></iframe>
      </div>

      {/* CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
        }}
      >
        <Link to="/" style={styles.ctaButton}>
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "0",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Inter, -apple-system, sans-serif",
    lineHeight: 1.6,
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },

  // Hero
  hero: {
    textAlign: "center",
    padding: "6rem 1.5rem 5rem",
    background: "linear-gradient(135deg, #f0f5ff 0%, #eef2ff 100%)",
    color: "#1e293b",
    margin: "0 0 4rem 0",
    borderRadius: "0 0 20px 20px",
  },
  heroTitle: {
    fontSize: "3rem",
    margin: "0 0 1rem 0",
    fontWeight: "700",
    color: "#1e3a8a",
    fontFamily: '"Playfair Display", serif',
  },
  heroText: {
    fontSize: "1.25rem",
    color: "#475569",
    maxWidth: "700px",
    margin: "0 auto 2rem",
    lineHeight: "1.7",
  },

  // Сетка
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    padding: "0 2rem 4rem",
  },

  // Контакты
  contactSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.6rem",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: '"Playfair Display", serif',
  },
  infoItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
    padding: "0.75rem 1.5rem",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  icon: {
    color: "#4f46e5",
    marginTop: "0.3rem",
    fontSize: "1.2rem",
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500",
  },
  social: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "2rem",
  },
  socialIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "white",
    border: "2px solid #e2e8f0",
    color: "#1e293b",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },

  // Форма
  formSection: {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.95rem",
    color: "#334155",
    fontWeight: "500",
  },
  input: {
    padding: "0.875rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease",
  },
  textarea: {
    padding: "0.875rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "120px",
    transition: "all 0.2s ease",
  },
  error: {
    fontSize: "0.875rem",
    color: "#e53e3e",
    marginTop: "0.25rem",
  },
  counter: {
    fontSize: "0.875rem",
    color: "#48bb78",
    textAlign: "right",
    marginTop: "-0.5rem",
  },
  submitBtn: {
    padding: "0.875rem 1.75rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1.05rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
  },

  // Карта
  mapContainer: {
    marginTop: "4rem",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  map: {
    borderRadius: "16px",
    border: "none",
  },

  // CTA
  ctaButton: {
    backgroundColor: "#f8fafc",
    color: "#4f46e5",
    padding: "1rem 2.5rem",
    borderRadius: "12px",
    border: "2px solid #4f46e5",
    fontWeight: "600",
    fontSize: "1.2rem",
    display: "inline-block",
    textDecoration: "none",
    transition: "all 0.2s ease",
  },

  // Toast
  toastIcon: {
    marginRight: "0.5rem",
  },
};

// === Глобальные стили ===
const styleEl = document.createElement("style");
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

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }

  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 3000;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideIn 0.4s ease;
    max-width: 320px;
    word-wrap: break-word;
  }

  .toast-success {
    background-color: #48bb78;
  }

  .toast-error {
    background-color: #e53e3e;
  }

  .social-icon:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .social-icon.whatsapp:hover {
    background-color: #25D366;
    color: white;
    border-color: #25D366;
  }

  .social-icon.telegram:hover {
    background-color: #0088cc;
    color: white;
    border-color: #0088cc;
  }

  .social-icon.instagram:hover {
    background-color: #E1306C;
    color: white;
    border-color: #E1306C;
  }

  input:focus, textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    outline: none;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-text {
      font-size: 1.1rem;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding: 0 1.5rem;
    }
    .section-title {
      font-size: 1.5rem;
    }
    .info-item,
    .form-section {
      padding: 1.5rem;
    }
    .submit-btn {
      width: 100%;
      justify-content: center;
    }
    .toast {
      right: 10px;
      left: 10px;
      max-width: none;
      text-align: center;
    }
    .map-container {
      margin-top: 3rem;
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
styleEl.id = "contact-page-styles";
if (!document.head.querySelector("#contact-page-styles")) {
  document.head.appendChild(styleEl);
}
