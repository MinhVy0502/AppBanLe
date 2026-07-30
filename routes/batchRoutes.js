const express = require('express');
const { Op } = require('sequelize');
const { Batch, Product } = require('../models');

const router = express.Router();

// ==================================================
//  POST /api/batches — Thêm lô hàng mới cho sản phẩm
// ==================================================
router.post('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const { product_id, batch_code, manufacturing_date, expiry_date, quantity } = req.body;

    if (!product_id || !expiry_date) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: product_id và expiry_date là bắt buộc.',
      });
    }

    // Kiểm tra sản phẩm thuộc cửa hàng
    const product = await Product.findOne({ where: { id: product_id, store_id } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm này trong cửa hàng của bạn.',
      });
    }

    const newBatch = await Batch.create({
      store_id,
      product_id,
      batch_code: batch_code || null,
      manufacturing_date: manufacturing_date || null,
      expiry_date,
      quantity: quantity || 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm lô hàng thành công!',
      data: newBatch,
    });

  } catch (error) {
    console.error('Lỗi thêm lô hàng:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

// ==================================================
//  GET /api/batches — Lấy danh sách lô hàng
//  Query: ?product_id=X  (lọc theo sản phẩm, tùy chọn)
// ==================================================
router.get('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const where = { store_id };

    if (req.query.product_id) {
      where.product_id = req.query.product_id;
    }

    const batches = await Batch.findAll({
      where,
      include: [{ model: Product, as: 'product', attributes: ['id', 'product_name', 'price', 'stock'] }],
      order: [['expiry_date', 'ASC']],
    });

    return res.json({ success: true, data: batches });

  } catch (error) {
    console.error('Lỗi lấy lô hàng:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

// ==================================================
//  GET /api/batches/alerts — Cảnh báo hàng tồn
//  ⚠️ PHẢI đặt TRƯỚC /:id để Express không match "alerts" thành id
// ==================================================
router.get('/alerts', async (req, res) => {
  try {
    const store_id = req.store_id;
    const today = new Date().toISOString().split('T')[0];

    // Ngày cảnh báo: 7 ngày và 30 ngày tới
    const in7days = new Date();
    in7days.setDate(in7days.getDate() + 7);
    const in30days = new Date();
    in30days.setDate(in30days.getDate() + 30);

    const warn7 = in7days.toISOString().split('T')[0];
    const warn30 = in30days.toISOString().split('T')[0];

    // Lô đã hết hạn
    const expired = await Batch.findAll({
      where: { store_id, expiry_date: { [Op.lt]: today } },
      include: [{ model: Product, as: 'product', attributes: ['id', 'product_name', 'price'] }],
      order: [['expiry_date', 'ASC']],
    });

    // Lô sắp hết hạn (trong 7 ngày)
    const expiringSoon = await Batch.findAll({
      where: {
        store_id,
        expiry_date: { [Op.gte]: today, [Op.lte]: warn7 },
      },
      include: [{ model: Product, as: 'product', attributes: ['id', 'product_name', 'price'] }],
      order: [['expiry_date', 'ASC']],
    });

    // Lô sắp hết hạn (trong 30 ngày, trừ 7 ngày trên)
    const expiringMonth = await Batch.findAll({
      where: {
        store_id,
        expiry_date: { [Op.gt]: warn7, [Op.lte]: warn30 },
      },
      include: [{ model: Product, as: 'product', attributes: ['id', 'product_name', 'price'] }],
      order: [['expiry_date', 'ASC']],
    });

    // Sản phẩm tồn kho thấp (≤ 5)
    const lowStock = await Product.findAll({
      where: { store_id, stock: { [Op.lte]: 5 } },
      order: [['stock', 'ASC']],
    });

    return res.json({
      success: true,
      data: {
        expired,
        expiringSoon,
        expiringMonth,
        lowStock,
      },
    });

  } catch (error) {
    console.error('Lỗi lấy cảnh báo:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

// ==================================================
//  DELETE /api/batches/:id — Xóa lô hàng
// ==================================================
router.delete('/:id', async (req, res) => {
  try {
    const store_id = req.store_id;
    const batch = await Batch.findOne({ where: { id: req.params.id, store_id } });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lô hàng này.',
      });
    }

    await batch.destroy();
    return res.json({ success: true, message: 'Đã xóa lô hàng.' });

  } catch (error) {
    console.error('Lỗi xóa lô hàng:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

module.exports = router;

