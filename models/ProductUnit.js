const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ==================================================
//  Model: ProductUnit — Quy cách đóng gói & Đơn vị tính
//  Cho phép 1 sản phẩm có nhiều đơn vị bán/nhập:
//  VD: Sản phẩm Bia Tiger:
//      - Đơn vị cơ sở: Lon (trong Product: unit_type = 'lon')
//      - Quy cách 1: Lốc (conversion_rate = 6, price = 55.000)
//      - Quy cách 2: Thùng (conversion_rate = 24, price = 210.000, cost_price = 216.000)
// ==================================================
const ProductUnit = sequelize.define('ProductUnit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  unit_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Tên đơn vị đóng gói: Thùng, Lốc, Dây, Cây, Hộp, Bịch, Vỉ, Bao, Két,...',
  },
  conversion_rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Số lượng đơn vị lẻ trong 1 đơn vị đóng gói (VD: 1 Thùng = 24 lon -> 24)',
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Giá bán cho đơn vị đóng gói này',
  },
  cost_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Giá nhập đề xuất cho đơn vị đóng gói này',
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Mã vạch riêng của thùng/lốc/hộp (nếu có)',
  },
  is_default_import: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Đánh dấu là đơn vị thường dùng để nhập hàng (VD: thường nhập theo Thùng)',
  },
}, {
  tableName: 'ProductUnit',
  timestamps: false,
});

module.exports = ProductUnit;
