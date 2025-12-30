// middleware/admin.js

/**
 * Middleware: проверяет, что пользователь — администратор
 */
const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      error: 'Доступ запрещён. Требуются права администратора',
    });
  }
  next();
};

module.exports = adminOnly;
