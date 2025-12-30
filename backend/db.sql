-- Пользователи (клиенты и админ)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(10) NOT NULL DEFAULT 'client', -- 'client' или 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  last_visit DATE
);

-- Записи
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  service VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW()
);

-- Отзывы
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Сообщения (с сайта)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_name VARCHAR(100),
  email VARCHAR(100),
  text TEXT NOT NULL,
  status VARCHAR(10) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Услуги
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  duration INTEGER, -- в минутах
  price VARCHAR(20), -- "от 2000 ₽"
  description TEXT,
  image_url TEXT
);

-- Блог
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FAQ
CREATE TABLE faq (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);
