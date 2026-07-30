const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JWT token.
 *
 * Quy trình:
 * 1. Lấy token từ header "Authorization: Bearer <token>"
 * 2. Xác minh token bằng JWT_SECRET
 * 3. Trích xuất store_id từ payload và gắn vào req.store_id
 * 4. Nếu token không hợp lệ hoặc hết hạn → trả về lỗi 401/403
 *
 * Sau middleware này, các route handler có thể truy cập:
 *   - req.store_id  → ID của cửa hàng đang đăng nhập
 *   - req.storeData → Toàn bộ payload đã giải mã từ token
 */
const authenticateToken = (req, res, next) => {
  // Lấy header Authorization
  const authHeader = req.headers['authorization'];
  // Tách token từ "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Truy cập bị từ chối. Không tìm thấy token xác thực.',
    });
  }

  try {
    // Xác minh và giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn store_id và toàn bộ payload vào request
    req.store_id = decoded.store_id;
    req.storeData = decoded;

    next();
  } catch (error) {
    // Token hết hạn
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
      });
    }

    // Token không hợp lệ (bị sửa đổi, sai secret, v.v.)
    return res.status(403).json({
      success: false,
      message: 'Token không hợp lệ.',
    });
  }
};

module.exports = authenticateToken;
