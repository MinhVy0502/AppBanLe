const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ==================================================
//  Model: Import — Phiếu nhập hàng
//  Ghi nhận từng đợt nhập hàng vào cửa hàng,
//  bao gồm sản phẩm, số lượng, giá nhập, tổng chi phí.
// ==================================================
const Import = sequelize.define('Import', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Store',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Product',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  supplier_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Ten nha cung cap (tuy chon)',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'So luong nhap',
  },
  unit_cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Gia nhap moi don vi',
  },
  total_cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Tong chi phi (quantity x unit_cost)',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chu',
  },
  import_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Ngay nhap hang',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Import',
  timestamps: false,
});

module.exports = Import;
