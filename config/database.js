const { Sequelize } = require('sequelize');

// ============================================================
//  CẤU HÌNH KẾT NỐI DATABASE — PostgreSQL
//
//  Sử dụng PostgreSQL thông qua pgAdmin.
//  Cấu hình kết nối lấy từ file .env
// ============================================================

const sequelize = new Sequelize(
  process.env.DB_NAME || 'appbanle_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
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
  }
);

module.exports = sequelize;
