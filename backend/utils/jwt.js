// utils/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Создаёт JWT токен
 * @param {number} id - ID пользователя
 * @param {string} role - Роль: 'client' или 'admin'
 * @returns {string} - Подписанный токен
 */
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Токен живёт 7 дней
  });
};

/**
 * Проверяет и расшифровывает токен
 * @param {string} token - JWT токен
 * @returns {object|null} - Расшифрованные данные или null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { signToken, verifyToken };
