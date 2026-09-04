const express = require('express');
const { Op } = require('sequelize');
const { Import, Product, sequelize } = require('../models');

const router = express.Router();

// ==================================================
//  POST /api/imports — Tao phieu nhap hang moi
//  Tu dong quy doi sang don vi co so va cong stock cho Product
// ==================================================
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const { product_id, supplier_name, quantity, unit_cost, note, import_date, unit_name, conversion_rate } = req.body;

    // Validate
    if (!product_id || !quantity || quantity <= 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Thieu thong tin: product_id va quantity (> 0) la bat buoc.',
      });
    }

    if (!unit_cost || unit_cost < 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Gia nhap (unit_cost) khong hop le.',
      });
    }

    // Kiem tra san pham thuoc cua hang
    const product = await Product.findOne({
      where: { id: product_id, store_id },
      transaction: t,
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay san pham nay trong cua hang cua ban.',
      });
    }

    const rate = Number(conversion_rate) > 0 ? Number(conversion_rate) : 1;
    const baseQuantity = Number(quantity) * rate;
    const totalCost = Number(quantity) * Number(unit_cost);

    // Tao phieu nhap
    const newImport = await Import.create({
      store_id,
      product_id,
      supplier_name: supplier_name || null,
      quantity: Number(quantity),
      unit_name: unit_name && String(unit_name).trim() ? String(unit_name).trim() : null,
      conversion_rate: rate,
      base_quantity: baseQuantity,
      unit_cost: Number(unit_cost),
      total_cost: totalCost,
      note: note || null,
      import_date: import_date || new Date().toISOString().split('T')[0],
    }, { transaction: t });

    // Cong stock cho san pham (theo don vi co so le)
    product.stock += baseQuantity;
    // Cap nhat gia von le co so (gia nhap moi don vi dong goi / ty le quy doi)
    product.cost_price = Number((Number(unit_cost) / rate).toFixed(2));
    await product.save({ transaction: t });

    await t.commit();

    // Fetch lai voi product info
    const importWithProduct = await Import.findByPk(newImport.id, {
      include: [{ model: Product, as: 'product', attributes: ['id', 'product_name', 'price', 'cost_price', 'stock', 'unit_type'] }],
    });

    return res.status(201).json({
      success: true,
      message: `Nhap hang thanh cong! Ton kho "${product.product_name}" tang len ${product.stock} ${product.unit_type || 'don vi'}.`,
      data: importWithProduct,
    });

  } catch (error) {
    await t.rollback();
    console.error('Loi tao phieu nhap:', error);
    return res.status(500).json({ success: false, message: 'Loi he thong.' });
  }
});

// ==================================================
//  GET /api/imports — Danh sach phieu nhap
//  Query: ?product_id=X&from=2025-01-01&to=2025-12-31&page=1&limit=50
// ==================================================
router.get('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const { product_id, from, to, page, limit: queryLimit } = req.query;

    const where = { store_id };

    if (product_id) {
      where.product_id = product_id;
    }

    if (from || to) {
      where.import_date = {};
      if (from) where.import_date[Op.gte] = from;
      if (to) where.import_date[Op.lte] = to;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(queryLimit) || 50));
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: imports } = await Import.findAndCountAll({
      where,
      include: [{ model: Product, as: 'product', attributes: ['id', 'product_name', 'price', 'cost_price', 'stock', 'unit_type'] }],
      order: [['import_date', 'DESC'], ['created_at', 'DESC']],
      limit: limitNum,
      offset,
    });

    return res.json({
      success: true,
      data: imports,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });

  } catch (error) {
    console.error('Loi lay danh sach nhap hang:', error);
    return res.status(500).json({ success: false, message: 'Loi he thong.' });
  }
});

// ==================================================
//  GET /api/imports/stats — Thong ke nhap hang
// ==================================================
router.get('/stats', async (req, res) => {
  try {
    const store_id = req.store_id;

    // Tong chi nhap hang
    const totalImportCost = await Import.sum('total_cost', { where: { store_id } }) || 0;

    // Tong so phieu nhap
    const totalImports = await Import.count({ where: { store_id } });

    // Tong so luong da nhap
    const totalQuantityImported = await Import.sum('quantity', { where: { store_id } }) || 0;

    // Thong ke theo thang (12 thang gan nhat)
    const allImports = await Import.findAll({
      where: { store_id },
      attributes: ['total_cost', 'quantity', 'import_date'],
      order: [['import_date', 'ASC']],
      raw: true,
    });

    const monthlyMap = {};
    allImports.forEach((imp) => {
      const d = new Date(imp.import_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, cost: 0, quantity: 0, count: 0 };
      }
      monthlyMap[key].cost += Number(imp.total_cost);
      monthlyMap[key].quantity += Number(imp.quantity);
      monthlyMap[key].count += 1;
    });

    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.push(monthlyMap[key] || { month: key, cost: 0, quantity: 0, count: 0 });
    }

    return res.json({
      success: true,
      data: {
        totalImportCost,
        totalImports,
        totalQuantityImported,
        monthlyData,
      },
    });

  } catch (error) {
    console.error('Loi thong ke nhap hang:', error);
    return res.status(500).json({ success: false, message: 'Loi he thong.' });
  }
});

// ==================================================
//  DELETE /api/imports/:id — Xoa phieu nhap + tru lai stock
// ==================================================
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const importRecord = await Import.findOne({
      where: { id: req.params.id, store_id },
      transaction: t,
    });

    if (!importRecord) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay phieu nhap nay.',
      });
    }

    // Tru lai stock
    const product = await Product.findOne({
      where: { id: importRecord.product_id, store_id },
      transaction: t,
    });

    if (product) {
      const deductQty = importRecord.base_quantity || (importRecord.quantity * (importRecord.conversion_rate || 1));
      product.stock = Math.max(0, product.stock - deductQty);
      await product.save({ transaction: t });
    }

    await importRecord.destroy({ transaction: t });
    await t.commit();

    return res.json({
      success: true,
      message: 'Da xoa phieu nhap va cap nhat ton kho.',
    });

  } catch (error) {
    await t.rollback();
    console.error('Loi xoa phieu nhap:', error);
    return res.status(500).json({ success: false, message: 'Loi he thong.' });
  }
});

module.exports = router;
