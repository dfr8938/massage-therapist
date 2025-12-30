// seed.js — Заполняет БД тестовыми данными
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/massage_therapist_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    // Удаление старых данных
    await pool.query('BEGIN');
    await pool.query('DELETE FROM messages');
    await pool.query('DELETE FROM appointments');
    await pool.query('DELETE FROM reviews');
    await pool.query('DELETE FROM services');
    await pool.query('DELETE FROM clients');
    await pool.query('DELETE FROM users WHERE role = $1 OR role = $2', ['client', 'admin']);

    console.log('Старые данные удалены.');

    // 1. Создание админа
    const admin = await pool.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) RETURNING id`,
      ['admin@spa.ru', '$2a$10$GCKnLZJzZJ672Y75RbO4r.pVvOfJYIMn41Wp12B8S1Y5JiL32J3kG', 'admin'] // пароль: admin123
    );
    console.log('Админ создан');

    // 2. Услуги
    const services = [
      ['Релакс-массаж', 3000, 60, 'Глубокое расслабление мышц и снятия стресса'],
      ['Спортивный массаж', 3500, 75, 'Для восстановления после тренировок'],
      ['Массаж шеи и плеч', 2000, 45, 'Снятие напряжения в зоне шеи и плеч'],
      ['Антицеллюлитный массаж', 4000, 90, 'Процедура для улучшения тонуса кожи'],
    ];

    for (const [name, price, duration, description] of services) {
      await pool.query(
        `INSERT INTO services (name, price, duration, description) 
         VALUES ($1, $2, $3, $4)`,
        [name, price, duration, description]
      );
    }
    console.log('Услуги добавлены');

    // 3. Клиенты
    const clientsData = [
      { name: 'Анна Петрова', phone: '+7 (915) 100-20-30', email: 'anna@example.com' },
      { name: 'Иван Сидоров', phone: '+7 (925) 200-30-40', email: 'ivan@example.com' },
      { name: 'Ольга Козлова', phone: '+7 (935) 300-40-50', email: 'olga@example.com' },
      { name: 'Дмитрий Фролов', phone: '+7 (945) 400-50-60', email: 'dmitry@example.com' },
      { name: 'Мария Волкова', phone: '+7 (955) 500-60-70' },
    ];

    for (const client of clientsData) {
      // Создаём пользователя
      const user = await pool.query(
        `INSERT INTO users (email, password, role) 
         VALUES ($1, $2, $3) RETURNING id`,
        [client.email || `temp_${Date.now()}${Math.random()}@temp.ru`, 'temp123456', 'client']
      );

      // Создаём клиента
      await pool.query(
        `INSERT INTO clients 
         (user_id, name, phone, visit_count, last_visit, favorite_service) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          user.rows[0].id,
          client.name,
          client.phone,
          Math.floor(Math.random() * 10) + 1,
          new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ['Релакс-массаж', 'Спортивный массаж'][Math.floor(Math.random() * 2)],
        ]
      );
    }
    console.log('Клиенты добавлены');

    // 4. Записи
    const appointments = [
      { client: 'Анна Петрова', service: 'Релакс-массаж', date: '2025-04-05', time: '14:00', status: 'Подтверждена' },
      { client: 'Иван Сидоров', service: 'Спортивный массаж', date: '2025-04-06', time: '10:00', status: 'Подтверждена' },
      { client: 'Ольга Козлова', service: 'Массаж шеи и плеч', date: '2025-04-06', time: '16:00', status: 'Завершена' },
      { client: 'Дмитрий Фролов', service: 'Антицеллюлитный массаж', date: '2025-04-07', time: '11:30', status: 'Ожидание' },
      { client: 'Мария Волкова', service: 'Релакс-массаж', date: '2025-04-08', time: '17:00', status: 'Подтверждена' },
      { client: 'Анна Петрова', service: 'Массаж шеи и плеч', date: '2025-04-09', time: '13:00', status: 'Ожидание' },
    ];

    for (const appt of appointments) {
      const client = await pool.query('SELECT id FROM clients WHERE name = $1', [appt.client]);
      const service = await pool.query('SELECT id FROM services WHERE name = $1', [appt.service]);

      await pool.query(
        `INSERT INTO appointments (client_id, service_id, date, time, status) 
         VALUES ($1, $2, $3, $4, $5)`,
        [client.rows[0].id, service.rows[0].id, appt.date, appt.time, appt.status]
      );
    }
    console.log('Записи добавлены');

    // 5. Отзывы
    const reviews = [
      { client: 'Анна Петрова', service: 'Релакс-массаж', rating: 5, text: 'Великолепный сеанс! Очень расслабилась.' },
      { client: 'Иван Сидоров', service: 'Спортивный массаж', rating: 4, text: 'Хороший массаж, но чуть сильнее — было бы идеально.' },
      { client: 'Ольга Козлова', service: 'Массаж шеи и плеч', rating: 5, text: 'Наконец-то избавилась от боли!' },
    ];

    for (const review of reviews) {
      const client = await pool.query('SELECT id FROM clients WHERE name = $1', [review.client]);
      const service = await pool.query('SELECT id FROM services WHERE name = $1', [review.service]);

      await pool.query(
        `INSERT INTO reviews (client_id, service_id, rating, text, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [client.rows[0].id, service.rows[0].id, review.rating, review.text]
      );
    }
    console.log('Отзывы добавлены');

    // 6. Сообщения
    const messages = [
      { name: 'Елена', email: 'lena@mail.ru', phone: '+7 (900) 111-22-33', message: 'Можно записаться на выходных?' },
      { name: 'Алексей', email: 'alex@bk.ru', phone: '+7 (900) 222-33-44', message: 'Скажите, пожалуйста, есть ли скидки для студентов?' },
    ];

    for (const msg of messages) {
      await pool.query(
        `INSERT INTO messages (name, email, phone, message, status, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [msg.name, msg.email, msg.phone, msg.message, 'new']
      );
    }
    console.log('Сообщения добавлены');

    await pool.query('COMMIT');
    console.log('✅ База данных успешно засеяна тестовыми данными!');
    process.exit(0);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Ошибка при заполнении базы:', err.message);
    process.exit(1);
  }
}

seed();
