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
      `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "barcode" VARCHAR(100);`,
      `ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "payment_method" VARCHAR(20) DEFAULT 'cash';`,
      `ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "cash_received" DECIMAL(12, 2) DEFAULT 0;`,
      `ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "change_amount" DECIMAL(12, 2) DEFAULT 0;`,
      `ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "note" TEXT;`,
      `ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "bank_id" VARCHAR(20);`,
      `ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "bank_account_no" VARCHAR(50);`,
      `ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "bank_account_name" VARCHAR(255);`,
      // Chỉ mục tăng tốc độ tra cứu mã vạch và báo cáo
      `CREATE INDEX IF NOT EXISTS "idx_product_store_barcode" ON "Product" ("store_id", "barcode");`,
      `CREATE INDEX IF NOT EXISTS "idx_order_store_created" ON "Order" ("store_id", "created_at");`,
      `CREATE INDEX IF NOT EXISTS "idx_import_store_date" ON "Import" ("store_id", "import_date");`,
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
