const sequelize = require('../config/database');
const Store = require('./Store');
const Shelf = require('./Shelf');
const Product = require('./Product');
const Order = require('./Order');
const Batch = require('./Batch');
const Customer = require('./Customer');
const Import = require('./Import');

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

// --- Store 1:N Customer ---
Store.hasMany(Customer, { foreignKey: 'store_id', as: 'customers' });
Customer.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// --- Customer 1:N Order (customer_id cho phép NULL) ---
Customer.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// --- Store 1:N Import ---
Store.hasMany(Import, { foreignKey: 'store_id', as: 'imports' });
Import.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// --- Product 1:N Import ---
Product.hasMany(Import, { foreignKey: 'product_id', as: 'imports', onDelete: 'CASCADE' });
Import.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  Store,
  Shelf,
  Product,
  Order,
  Batch,
  Customer,
  Import,
};
