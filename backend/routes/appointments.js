// routes/appointments.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const db = require('../config/db');

// GET /api/appointments — Получить мои записи
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, service, date, time, status, created_at
       FROM appointments
       WHERE user_id = $1
       ORDER BY date DESC, time DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки записей' });
  }
});

// POST /api/appointments — Записаться на приём
router.post(
  '/',
  auth,
  [
    check('service', 'Услуга обязательна').notEmpty(),
    check('date', 'Дата обязательна').isISO8601().toDate(),
    check('time', 'Время обязательно').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { service, date, time } = req.body;

    try {
      // Проверка: нет ли уже записи на это время
      const conflict = await db.query(
        `SELECT id FROM appointments
         WHERE date = $1 AND time = $2 AND status IN ('pending', 'confirmed')`,
        [date, time]
      );

      if (conflict.rows.length > 0) {
        return res.status(409).json({ error: 'Это время уже занято. Выберите другое.' });
      }

      const result = await db.query(
        `INSERT INTO appointments (user_id, service, date, time, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING id, service, date, time, status`,
        [req.userId, service, date, time]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при создании записи' });
    }
  }
);

// DELETE /api/appointments/:id — Отменить запись (опционально)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND status IN ('pending', 'confirmed')
       RETURNING id`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена или уже завершена/отменена' });
    }

    res.json({ message: 'Запись успешно отменена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при отмене записи' });
  }
});

module.exports = router;
