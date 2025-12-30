// src/components/Card.jsx
import { useEffect, useRef } from 'react';

/**
 * Карточка с поддержкой анимации, тем и вариантов отображения
 * @param {Object} props
 * @param {'default' | 'highlight' | 'dark' | 'bordered'} [props.variant='default'] - Стилевое оформление
 * @param {boolean} [props.animate=true] - Анимировать появление при монтировании
 * @param {number} [props.animationDelay=50] - Задержка анимации (мс)
 * @param {number} [props.animationDuration=600] - Длительность анимации (мс)
 * @param {React.ElementType} [props.as='div'] - HTML-тег обёртки
 * @param {string} [props.className] - Дополнительный CSS-класс
 * @param {React.ReactNode} props.children - Содержимое карточки
 * @param {React.CSSProperties} [props.style] - Инлайн-стили
 */
export default function Card({
  children,
  variant = 'default',
  animate = true,
  animationDelay = 50,
  animationDuration = 600,
  as: Component = 'div',
  className = '',
  style = {},
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!animate || !el) return;

    // Проверка предпочтений пользователя
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
      return;
    }

    // Начальное состояние
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`;
    el.style.transitionDelay = `${animationDelay}ms`;

    // Анимация появления
    const timer = setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 10);

    return () => clearTimeout(timer);
  }, [animate, animationDelay, animationDuration]);

  const baseClasses = `card variant-${variant} ${className}`.trim();

  return (
    <Component
      ref={ref}
      className={baseClasses}
      style={style}
      data-variant={variant}
    >
      {children}
    </Component>
  );
}
// Добавляем стили при первом рендере
const styleEl = document.createElement('style');
styleEl.textContent = `
  .card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
    margin: 1rem 0;
    transition: box-shadow 0.3s ease;
    box-sizing: border-box;
  }

  .card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .card.variant-highlight {
    background-color: #ebf8ff;
    border: 1px solid #bee3f8;
  }

  .card.variant-dark {
    background-color: #2d3748;
    color: #e2e8f0;
    border: 1px solid #4a5568;
  }

  .card.variant-bordered {
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
  }

  /* Адаптивность */
  @media (max-width: 480px) {
    .card {
      padding: 1.5rem;
      margin: 0.75rem 0;
    }
  }
`;
styleEl.id = 'card-styles';
if (!document.getElementById('card-styles')) {
  document.head.appendChild(styleEl);
}
