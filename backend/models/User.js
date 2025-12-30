class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT u.id, u.email, u.role, c.name, c.phone, c.visit_count, c.last_visit, c.favorite_service 
       FROM users u
       LEFT JOIN clients c ON u.client_id = c.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(email, password, role) {
    const result = await db.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
      [email, password, role]
    );
    return result.rows[0].id;
  }

  static async updateClientRef(userId, clientId) {
    await db.query('UPDATE users SET client_id = $1 WHERE id = $2', [clientId, userId]);
  }
}

module.exports = User;
