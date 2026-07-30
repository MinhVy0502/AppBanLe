const express = require('express');
const { Order, Product, sequelize } = require('../models');

const router = express.Router();

// ==================================================
//  POST /api/orders — Tạo hóa đơn mới + trừ tồn kho
// ==================================================
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const { total_price, items } = req.body;

    if (!total_price || Number(total_price) <= 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Tổng tiền không hợp lệ.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Danh sách sản phẩm trống.' });
    }

    // Kiểm tra tồn kho và trừ stock
    for (const item of items) {
      const product = await Product.findOne({
        where: { id: item.product_id, store_id },
        transaction: t,
      });

      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Sản phẩm "${item.product_name}" không tồn tại.`,
        });
      }

      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `"${product.product_name}" chỉ còn ${product.stock} trong kho, không đủ ${item.quantity}.`,
        });
      }

      // Trừ tồn kho
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    // Tạo hóa đơn
    const newOrder = await Order.create({
      store_id,
      total_price: Number(total_price),
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Tạo hóa đơn thành công!',
      data: newOrder,
    });

  } catch (error) {
    await t.rollback();
    console.error('Lỗi tạo hóa đơn:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  GET /api/orders — Lấy danh sách hóa đơn
// ==================================================
router.get('/', async (req, res) => {
  try {
    const store_id = req.store_id;

    const orders = await Order.findAll({
      where: { store_id },
      order: [['created_at', 'DESC']],
    });

    return res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách hóa đơn:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

module.exports = router;
