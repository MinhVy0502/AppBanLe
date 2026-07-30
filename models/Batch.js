const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ==================================================
//  Model: Batch — Lô hàng (theo dõi HSD)
//  Mỗi sản phẩm có thể có nhiều lô hàng khác nhau,
//  mỗi lô có mã lô, ngày sản xuất, hạn sử dụng, số lượng.
// ==================================================
const Batch = sequelize.define('Batch', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  batch_code: {
    type: DataTypes.STRING(100),
    allowNull: true, // Có thể không có mã lô
    comment: 'Mã lô hàng (VD: LOT-2025-001)',
  },
  manufacturing_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Ngày sản xuất',
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Hạn sử dụng (bắt buộc)',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Số lượng trong lô này',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Batch',
  timestamps: false,
});

module.exports = Batch;
