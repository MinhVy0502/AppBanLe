const sequelize = require('../config/database');
const Store = require('./Store');
const Shelf = require('./Shelf');
const Product = require('./Product');
const Order = require('./Order');
const Batch = require('./Batch');

// ===========================
//  Định nghĩa quan hệ (Associations)
// ===========================

// --- Store 1:N Shelf ---
Store.hasMany(Shelf, { foreignKey: 'store_id', as: 'shelves' });
Shelf.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// --- Store 1:N Product ---
Store.hasMany(Product, { foreignKey: 'store_id', as: 'products' });
Product.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// --- Shelf 1:N Product (shelf_id cho phép NULL) ---
Shelf.hasMany(Product, { foreignKey: 'shelf_id', as: 'products' });
Product.belongsTo(Shelf, { foreignKey: 'shelf_id', as: 'shelf' });

// --- Store 1:N Order ---
Store.hasMany(Order, { foreignKey: 'store_id', as: 'orders' });
Order.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// --- Store 1:N Batch ---
Store.hasMany(Batch, { foreignKey: 'store_id', as: 'batches' });
Batch.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// --- Product 1:N Batch (xóa product → xóa batch) ---
Product.hasMany(Batch, { foreignKey: 'product_id', as: 'batches', onDelete: 'CASCADE' });
Batch.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  Store,
  Shelf,
  Product,
  Order,
  Batch,
};
