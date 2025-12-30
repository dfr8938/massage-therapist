// routes/blog.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/blog — Все статьи блога
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, slug, image_url,
              TO_CHAR(created_at, 'DD.MM.YY') AS date,
              LEFT(content, 200) || '...' AS excerpt
       FROM blog_posts
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки статей' });
  }
});

// GET /api/blog/:slug — Статья по slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await db.query(
      `SELECT id, title, content, image_url,
              TO_CHAR(created_at, 'DD.MM.YY') AS date
       FROM blog_posts
       WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки статьи' });
  }
});

// GET /api/blog/faq — Частые вопросы
router.get('/faq', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, question, answer
       FROM faq
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки FAQ' });
  }
});

module.exports = router;
