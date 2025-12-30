class Client {
  static async create(userId, name, phone) {
    const result = await db.query(
      'INSERT INTO clients (user_id, name, phone) VALUES ($1, $2, $3) RETURNING id',
      [userId, name, phone]
    );
    return result.rows[0].id;
  }

  static async findByUserId(userId) {
    const result = await db.query('SELECT * FROM clients WHERE user_id = $1', [userId]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    await db.query(
      `UPDATE clients SET ${setClause} WHERE id = $1`,
      [id, ...values]
    );

    return this.findById(id);
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = Client;
