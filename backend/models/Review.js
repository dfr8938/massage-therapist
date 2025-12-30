// models/Review.js
class Review {
  static async findByClientId(userId) {
    const result = await db.query(`
      SELECT r.id, r.text, r.rating, r.created_at
      FROM reviews r
      JOIN clients c ON r.client_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(clientId, text, rating) {
    const result = await db.query(`
      INSERT INTO reviews (client_id, text, rating)
      VALUES ($1, $2, $3)
      RETURNING id, client_id, text, rating, created_at
    `, [clientId, text, rating]);

    return result.rows[0];
  }

  static async update(id, { text, rating }) {
    await db.query(`
      UPDATE reviews SET text = $1, rating = $2, created_at = NOW()
      WHERE id = $3
    `, [text, rating, id]);
  }
}

module.exports = Review;
