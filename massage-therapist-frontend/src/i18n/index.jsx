// src/i18n/index.jsx
import { createContext, useContext, useState } from 'react';

const translations = {
  ru: {
    home: 'Главная',
    services: 'Услуги',
    reviews: 'Отзывы',
    blog: 'Блог',
    contact: 'Контакты',
    about: 'Обо мне',
    send: 'Отправить',
    fill_all: 'Заполните все поля',
    your_name: 'Ваше имя',
    back: 'Назад',
  },
  en: {
    home: 'Home',
    services: 'Services',
    reviews: 'Reviews',
    blog: 'Blog',
    contact: 'Contact',
    about: 'About',
    send: 'Send',
    fill_all: 'Please fill all fields',
    your_name: 'Your name',
    back: 'Back',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru');

  const toggleLang = () => {
    setLang(prev => (prev === 'ru' ? 'en' : 'ru'));
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
