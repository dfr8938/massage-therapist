// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Применяем аутентификацию и проверку роли
router.use(auth, adminOnly);

// 📊 GET /api/admin/stats — Статистика
router.get('/stats', async (req, res) => {
  try {
    const [clients, messages, confirmed, ratings] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM clients'),
      db.query('SELECT COUNT(*) as count FROM messages WHERE status = $1', ['new']),
      db.query('SELECT COUNT(*) as count FROM appointments WHERE status = $1', ['Подтверждена']),
      db.query('SELECT AVG(rating) as avg FROM reviews'),
    ]);

    res.json({
      clients: parseInt(clients.rows[0].count),
      messages: parseInt(messages.rows[0].count),
      confirmedAppointments: parseInt(confirmed.rows[0].count),
      averageRating: parseFloat(ratings.rows[0].avg) || 0,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке статистики' });
  }
});

// 🛠 УСЛУГИ

// GET /api/admin/services — Все услуги
router.get('/services', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Services fetch error:', err);
    res.status(500).json({ error: 'Ошибка загрузки услуг' });
  }
});

// POST /api/admin/services — Добавить услугу
router.post('/services', async (req, res) => {
  const { name, price, duration, description } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ error: 'Название, цена и длительность обязательны' });
  }

  try {
    const result = await db.query(
      `INSERT INTO services (name, price, duration, description) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, price, duration, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add service error:', err);
    res.status(500).json({ error: 'Не удалось добавить услугу' });
  }
});

// PUT /api/admin/services/:id — Редактировать услугу
router.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, duration, description } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ error: 'Название, цена и длительность обязательны' });
  }

  try {
    const result = await db.query(
      `UPDATE services 
       SET name = $1, price = $2, duration = $3, description = $4 
       WHERE id = $5 RETURNING *`,
      [name, price, duration, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ error: 'Не удалось обновить услугу' });
  }
});

// 🧑 КЛИЕНТЫ

// GET /api/admin/clients — Все клиенты
router.get('/clients', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, u.email 
      FROM clients c 
      JOIN users u ON c.user_id = u.id 
      ORDER BY c.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Clients fetch error:', err);
    res.status(500).json({ error: 'Ошибка загрузки клиентов' });
  }
});

// POST /api/admin/clients — Добавить клиента
router.post('/clients', async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  try {
    let userId;
    if (email) {
      const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
        userId = userCheck.rows[0].id;
      } else {
        const newUser = await db.query(
          `INSERT INTO users (email, password, role) 
           VALUES ($1, 'temp123456', 'client') RETURNING id`,
          [email]
        );
        userId = newUser.rows[0].id;
      }
    } else {
      const tempEmail = `client_${Date.now()}@temp.ru`;
      const newUser = await db.query(
        `INSERT INTO users (email, password, role) 
         VALUES ($1, 'temp123456', 'client') RETURNING id`,
        [tempEmail]
      );
      userId = newUser.rows[0].id;
    }

    const result = await db.query(
      `INSERT INTO clients (user_id, name, phone, visit_count, last_visit, favorite_service) 
       VALUES ($1, $2, $3, 0, NULL, NULL) RETURNING *`,
      [userId, name, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add client error:', err);
    res.status(500).json({ error: 'Не удалось добавить клиента' });
  }
});

// PUT /api/admin/clients/:id — Редактировать клиента
router.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  try {
    const clientCheck = await db.query(`SELECT c.user_id FROM clients c WHERE c.id = $1`, [id]);
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    const userId = clientCheck.rows[0].user_id;
    if (email) {
      await db.query('UPDATE users SET email = $1 WHERE id = $2', [email, userId]);
    }

    const result = await db.query(
      `UPDATE clients 
       SET name = $1, phone = $2 
       WHERE id = $3 RETURNING *`,
      [name, phone, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({ error: 'Не удалось обновить клиента' });
  }
});

// DELETE /api/admin/clients/:id — Удалить клиента
router.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING user_id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    const userId = result.rows[0].user_id;
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'Клиент успешно удалён' });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ error: 'Не удалось удалить клиента' });
  }
});

// 📥 GET /api/admin/messages — Новые сообщения
router.get('/messages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await db.query(`
      SELECT * FROM messages 
      WHERE status = 'new' 
      ORDER BY created_at DESC 
      LIMIT $1`, [limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.status(500).json({ error: 'Ошибка загрузки сообщений' });
  }
});

// 📅 GET /api/admin/appointments — Последние записи
router.get('/appointments', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await db.query(`
      SELECT a.id, a.date, a.time, a.status,
             c.name as client_name,
             s.name as service_name
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.date DESC, a.time DESC
      LIMIT $1`, [limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Appointments fetch error:', err);
    res.status(500).json({ error: 'Ошибка загрузки записей' });
  }
});

module.exports = router;
