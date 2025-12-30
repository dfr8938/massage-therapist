// config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Загружаем .env в development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Конфигурация подключения
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Важно для Heroku, Render и др.
  },
  // Настройки пула
  max: 20, // Максимум 20 соединений
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  maxUses: 7500, // Пересоздать соединение после 7500 запросов (для стабильности)
});

// Опционально: логирование подключений
pool.on('connect', (client) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('🗄️ База данных: подключение установлено');
  }
});

pool.on('remove', (client) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('🗄️ База данных: подключение закрыто');
  }
});

// Экспортируем пул и методы для прямого использования
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  end: () => pool.end(),
  pool, // Полный доступ к пулу, если нужно
};

/**
 * Пример использования:
 *
 * const db = require('./config/db');
 *
 * // Простой запрос
 * const res = await db.query('SELECT NOW()');
 *
 * // Работа с клиентом (транзакции)
 * const client = await db.getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query('INSERT INTO...');
 *   await client.query('COMMIT');
 * } catch (e) {
 *   await client.query('ROLLBACK');
 *   throw e;
 * } finally {
 *   client.release();
 * }
 */
