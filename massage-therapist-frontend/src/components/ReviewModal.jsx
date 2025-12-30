// src/components/ReviewModal.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/index.jsx';

export default function ReviewModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [review, setReview] = useState({ name: '', text: '' });
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Фокус при открытии
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (firstInputRef.current) firstInputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Управление фокусом (экранная клавиатура)
  useEffect(() => {
    if (!isOpen) return;

    const focusableEls = modalRef.current?.querySelectorAll(
      'input, textarea, button'
    );
    const first = focusableEls?.[0];
    const last = focusableEls?.[focusableEls.length - 1];

    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', trapFocus);
    return () => window.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!review.name.trim() || !review.text.trim()) {
      alert(t('fill_all'));
      return;
    }
    alert(`${t('thank_you')}, ${review.name}!`);
    setReview({ name: '', text: '' });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div ref={modalRef} style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
        <h3 id="review-modal-title" style={styles.modalTitle}>
          {t('leaveReview')}
        </h3>

        <input
          ref={firstInputRef}
          type="text"
          placeholder={t('your_name')}
          value={review.name}
          onChange={(e) => setReview({ ...review, name: e.target.value })}
          style={styles.input}
          aria-label={t('your_name')}
        />

        <textarea
          placeholder={t('your_review')}
          value={review.text}
          onChange={(e) => setReview({ ...review, text: e.target.value })}
          rows="4"
          style={styles.textarea}
          aria-label={t('your_review')}
        />

        <div style={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            style={styles.cancel}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!review.name.trim() || !review.text.trim()}
            style={
              !review.name.trim() || !review.text.trim()
                ? { ...styles.submit, ...styles.submitDisabled }
                : styles.submit
            }
          >
            {t('submit')}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    animation: 'fade-in 0.3s ease-out',
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
    position: 'relative',
    animation: 'slide-up 0.3s ease-out',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.2rem',
    color: '#1a202c',
    textAlign: 'center',
    fontFamily: '"Playfair Display", serif',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '1rem',
    marginBottom: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '100px',
  },
  inputFocus: {
    borderColor: '#4299e1',
    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap',
  },
  cancel: {
    padding: '0.65rem 1.2rem',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    backgroundColor: '#f7fafc',
    color: '#4a5568',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submit: {
    padding: '0.65rem 1.2rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
    opacity: 0.8,
  },
};

// Встраиваем анимации в DOM
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  [data-review-modal] input:focus,
  [data-review-modal] textarea:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    outline: none;
  }

  [data-review-modal] button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  [data-review-modal] button:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    [data-review-modal] .actions {
      flex-direction: column-reverse;
      align-items: stretch;
    }

    [data-review-modal] button {
      width: 100%;
      justify-content: center;
    }

    [data-review-modal] .modal {
      padding: 1.5rem;
      margin: 1rem;
    }
  }
`;

styleEl.setAttribute('data-review-modal', '');
document.head.appendChild(styleEl);
