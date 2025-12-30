// routes/services.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/services — Получить все услуги
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, duration, price, description, image_url
       FROM services
       ORDER BY id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки услуг' });
  }
});

// 👇 Эти маршруты — пока закомментированы. Раскомментируй, если нужен CRUD для админа.

/*
// POST /api/services (только админ)
router.post('/', auth, adminOnly, async (req, res) => { ... });

// PUT /api/services/:id (только админ)
router.put('/:id', auth, adminOnly, async (req, res) => { ... });

// DELETE /api/services/:id (только админ)
router.delete('/:id', auth, adminOnly, async (req, res) => { ... });
*/

module.exports = router;
