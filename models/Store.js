const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  store_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  bank_id: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Mã ngân hàng VietQR (VD: MB, VCB, ICB, ACB, TCB, VPB, TPB, STB...)',
  },
  bank_account_no: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Số tài khoản ngân hàng thụ hưởng',
  },
  bank_account_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Tên chủ tài khoản (in hoa không dấu)',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Store',
  timestamps: false,
});

module.exports = Store;
