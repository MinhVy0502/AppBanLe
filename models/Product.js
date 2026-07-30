const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
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
  shelf_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cho phép NULL nếu sản phẩm chưa được xếp lên kệ
    references: {
      model: 'Shelf',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // Khi xóa kệ, sản phẩm vẫn tồn tại (shelf_id = NULL)
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  unit_type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'le',
    comment: 'Quy cách đóng gói: le (Lẻ), loc (Lốc), thung (Thùng)',
  },
  units_per_pack: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Số đơn vị lẻ trong 1 gói. VD: Lốc 6 → 6, Thùng 24 → 24',
  },
}, {
  tableName: 'Product',
  timestamps: false,
});

module.exports = Product;
