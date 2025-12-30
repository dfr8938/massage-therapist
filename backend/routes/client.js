const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Client = require('../models/Client');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

router.use(auth);

// Профиль клиента
router.get('/profile', async (req, res) => {
  try {
    const client = await Client.findByUserId(req.userId);
    if (!client) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.put('/profile', async (req, res) => {
  const { firstName, lastName, phone, email, ...rest } = req.body;
  try {
    const client = await Client.findByUserId(req.userId);
    if (!client) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    await Client.update(client.id, { name: `${firstName} ${lastName}`.trim(), ...rest });
    res.json(await Client.findByUserId(req.userId));
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// Записи
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.findByClientId(req.userId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки записей' });
  }
});

// Отзывы
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.findByClientId(req.userId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки отзывов' });
  }
});

router.post('/reviews', async (req, res) => {
  const { text, rating } = req.body;
  try {
    const client = await Client.findByUserId(req.userId);
    const review = await Review.create(client.id, text, rating);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка отправки отзыва' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { text, rating } = req.body;
  try {
    const review = await Review.findById(id);
    if (review.client_id !== (await Client.findByUserId(req.userId)).id) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    await Review.update(id, { text, rating });
    res.json(await Review.findById(id));
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления отзыва' });
  }
});

module.exports = router;
