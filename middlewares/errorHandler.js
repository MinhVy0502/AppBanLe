/**
 * Global Error Handling Middleware
 * Chuẩn hóa toàn bộ phản hồi lỗi của hệ thống
 */
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  // 1. Lỗi Sequelize Validation
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: messages || 'Dữ liệu không hợp lệ.',
    });
  }

  // 2. Lỗi trùng lặp dữ liệu (Unique Constraint)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu đã tồn tại trong hệ thống (trùng lặp).',
    });
  }

  // 3. Lỗi xác thực JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Phiên đăng nhập đã hết hạn.' : 'Token không hợp lệ.',
    });
  }

  // 4. Lỗi có gán status tùy chỉnh
  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500
    ? 'Lỗi hệ thống. Vui lòng thử lại sau.'
    : (err.message || 'Yêu cầu không thể thực hiện.');

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
