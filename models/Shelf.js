const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shelf = sequelize.define('Shelf', {
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
  shelf_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'Shelf',
  timestamps: false,
});

module.exports = Shelf;
