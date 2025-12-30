// models/Message.js
class Message {
  static async create(name, phone, message) {
    const result = await db.query(
      'INSERT INTO messages (name, phone, message) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, message]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    return result.rows;
  }
}

module.exports = Message;
