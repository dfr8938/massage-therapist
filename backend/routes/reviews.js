// routes/reviews.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/reviews — Получить все публичные отзывы
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         r.id,
         r.text,
         r.rating,
         r.created_at,
         COALESCE(LEFT(u.name, 1) || '.', 'Клиент') AS author_short,
         CASE 
           WHEN u.name IS NOT NULL THEN LEFT(u.name, 1) || '***'
           ELSE 'Клиент'
         END AS author
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.rating >= 4  -- Можно вернуть только положительные
       ORDER BY r.created_at DESC
       LIMIT 20`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки отзывов' });
  }
});

// Опционально: получить N последних отзывов (для главной)
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await db.query(
      `SELECT 
         text, rating, 
         COALESCE(LEFT(u.name, 1) || '***', 'Клиент') AS author,
         TO_CHAR(created_at, 'DD.MM.YY') AS date_str
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.rating >= 4
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки последних отзывов' });
  }
});

module.exports = router;
