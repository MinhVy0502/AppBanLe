const { Sequelize } = require('sequelize');

// ============================================================
//  CẤU HÌNH KẾT NỐI DATABASE — PostgreSQL
//
//  Hỗ trợ 2 chế độ:
//  1. DATABASE_URL (cho cloud hosting: Render, Railway, ...)
//  2. Các biến riêng lẻ DB_NAME, DB_USER, ... (cho local dev)
// ============================================================

const isProduction = process.env.NODE_ENV === 'production';

const commonOptions = {
  dialect: 'postgres',
  logging: false,
  timezone: '+07:00',
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

let sequelize;

if (process.env.DATABASE_URL) {
  // ===== Chế độ Cloud (Render, Railway, ...) =====
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...commonOptions,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // ===== Chế độ Local Development =====
  sequelize = new Sequelize(
    process.env.DB_NAME || 'appbanle_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '',
    {
      ...commonOptions,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
    }
  );
}

module.exports = sequelize;
