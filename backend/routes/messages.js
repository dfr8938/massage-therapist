// routes/messages.js
const express = require('express');
const router = express.Router();

// Получить все сообщения (доступно только админу, но пока без auth)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки сообщений' });
  }
});

// Создать новое сообщение
router.post('/', async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const result = await db.query(
      'INSERT INTO messages (name, phone, message) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось сохранить сообщение' });
  }
});

module.exports = router;
