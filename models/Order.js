const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
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
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Customer',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Khách hàng (nếu có)',
  },
  total_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total_cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Tổng giá vốn',
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Danh sách sản phẩm: [{ product_id, product_name, price, cost_price, quantity }]',
  },
  is_debt: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Đơn mua chịu (nợ)',
  },
  debt_paid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Nợ đã thanh toán chưa',
  },
  payment_method: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'cash',
    comment: 'Phương thức: cash (tiền mặt), transfer (chuyển khoản QR), debt (ghi nợ)',
  },
  cash_received: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Số tiền khách đưa',
  },
  change_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Tiền thối lại khách',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú hóa đơn',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Order',
  timestamps: false,
});

module.exports = Order;
