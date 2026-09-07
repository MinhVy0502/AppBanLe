const { sequelize } = require('../models');

/**
 * Khởi tạo kết nối cơ sở dữ liệu và tự động chạy migrations.
 */
async function initDatabase() {
  try {
    // 1. Kiểm tra kết nối PostgreSQL
    await sequelize.authenticate();
    console.log('✅ Kết nối PostgreSQL thành công!');

    // 2. Đồng bộ các bảng
    const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
    await sequelize.sync(syncOptions);

    // 3. Tự động kiểm tra và thêm các cột còn thiếu trên Cloud Database (Neon / Render / Supabase)
    const migrations = [
      `ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "notes" TEXT;`,
      `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "allow_retail" BOOLEAN DEFAULT true;`,
      `ALTER TABLE "ProductUnit" ADD COLUMN IF NOT EXISTS "is_default_import" BOOLEAN DEFAULT false;`,
      `ALTER TABLE "Batch" ADD COLUMN IF NOT EXISTS "manufacturing_date" DATE;`,
      `ALTER TABLE "Import" ADD COLUMN IF NOT EXISTS "supplier_name" VARCHAR(255);`,
      `ALTER TABLE "Import" ADD COLUMN IF NOT EXISTS "base_quantity" INTEGER DEFAULT 0;`,
      `ALTER TABLE "Import" ADD COLUMN IF NOT EXISTS "unit_cost" DECIMAL(12, 2) DEFAULT 0;`,
      `ALTER TABLE "Import" ADD COLUMN IF NOT EXISTS "note" TEXT;`,
    ];

    for (const sql of migrations) {
      try {
        await sequelize.query(sql);
      } catch (err) {
        // Bỏ qua lỗi nếu bảng chưa tồn tại lúc mới tạo
      }
    }

    console.log('✅ Đồng bộ cấu trúc dữ liệu thành công!');
    return true;
  } catch (error) {
    console.error('❌ Lỗi kết nối hoặc đồng bộ database:', error.message);
    throw error;
  }
}

module.exports = initDatabase;
