require('dotenv').config();
const { sequelize } = require('./models');

/**
 * Kiểm tra kết nối database và đồng bộ các bảng.
 * Chạy: node sync.js
 *
 * Tùy chọn:
 *   - alter: true   → Cập nhật bảng hiện có (thêm/sửa cột) mà không mất dữ liệu
 *   - force: true   → Xóa toàn bộ bảng rồi tạo lại (MẤT DỮ LIỆU)
 */
async function syncDatabase() {
  try {
    // 1. Kiểm tra kết nối
    await sequelize.authenticate();
    console.log('✅ Kết nối PostgreSQL thành công!');

    // 2. Đồng bộ các bảng (alter: true để cập nhật mà không mất dữ liệu)
    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ tất cả các bảng thành công!');

  } catch (error) {
    console.error('❌ Lỗi kết nối hoặc đồng bộ database:', error.message);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
