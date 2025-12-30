// models/Appointment.js
class Appointment {
  static async findByClientId(userId) {
    const result = await db.query(`
      SELECT a.id, a.service_name, a.date, a.time, a.status
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.id = $1
      ORDER BY a.date DESC, a.time ASC
    `, [userId]);

    return result.rows;
  }

  static async create(clientId, service, date, time) {
    const result = await db.query(`
      INSERT INTO appointments (client_id, service_name, date, time)
      VALUES ($1, $2, $3, $4)
      RETURNING id, service_name, date, time, status
    `, [clientId, service, date, time]);

    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    await db.query(
      `UPDATE appointments SET ${setClause} WHERE id = $1`,
      [id, ...values]
    );
  }
}

module.exports = Appointment;
