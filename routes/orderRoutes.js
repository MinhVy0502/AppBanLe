const express = require('express');
const { Op } = require('sequelize');
const { Order, Product, Customer, sequelize } = require('../models');

const router = express.Router();

// ==================================================
//  POST /api/orders — Tạo hóa đơn mới + trừ tồn kho
// ==================================================
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const { total_price, items, customer_id, is_debt } = req.body;

    if (!total_price || Number(total_price) <= 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Tổng tiền không hợp lệ.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Danh sách sản phẩm trống.' });
    }

    // Kiểm tra tồn kho, trừ stock, tính cost
    let totalCost = 0;
    const orderItems = [];

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

      const costPrice = Number(product.cost_price) || 0;
      totalCost += costPrice * item.quantity;

      orderItems.push({
        product_id: product.id,
        product_name: product.product_name,
        price: Number(product.price),
        cost_price: costPrice,
        quantity: item.quantity,
        unit_type: product.unit_type,
        units_per_pack: product.units_per_pack,
      });
    }

    // Nếu có customer_id, kiểm tra khách hàng
    if (customer_id) {
      const customer = await Customer.findOne({
        where: { id: customer_id, store_id },
        transaction: t,
      });
      if (!customer) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Khách hàng không tồn tại.' });
      }

      // Nếu mua chịu → cộng nợ
      if (is_debt) {
        customer.total_debt = Number(customer.total_debt) + Number(total_price);
        await customer.save({ transaction: t });
      }
    }

    // Tạo hóa đơn
    const newOrder = await Order.create({
      store_id,
      customer_id: customer_id || null,
      total_price: Number(total_price),
      total_cost: totalCost,
      items: orderItems,
      is_debt: !!is_debt,
      debt_paid: false,
    }, { transaction: t });

    await t.commit();

    // Fetch lại với customer info
    const orderWithCustomer = await Order.findByPk(newOrder.id, {
      include: [{ model: Customer, as: 'customer', attributes: ['id', 'customer_name', 'phone'] }],
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo hóa đơn thành công!',
      data: orderWithCustomer,
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
//  GET /api/orders — Lấy danh sách hóa đơn (có filter)
//  Query: ?from=2025-01-01&to=2025-12-31&page=1&limit=50
// ==================================================
router.get('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const { from, to, page, limit: queryLimit } = req.query;

    const where = { store_id };

    // Filter by date range
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at[Op.gte] = new Date(from + 'T00:00:00');
      if (to) where.created_at[Op.lte] = new Date(to + 'T23:59:59');
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(queryLimit) || 50));
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{ model: Customer, as: 'customer', attributes: ['id', 'customer_name', 'phone'] }],
      order: [['created_at', 'DESC']],
      limit: limitNum,
      offset,
    });

    return res.json({
      success: true,
      data: orders,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách hóa đơn:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  GET /api/orders/:id — Chi tiết hóa đơn
// ==================================================
router.get('/:id', async (req, res) => {
  try {
    const store_id = req.store_id;
    const order = await Order.findOne({
      where: { id: req.params.id, store_id },
      include: [{ model: Customer, as: 'customer', attributes: ['id', 'customer_name', 'phone'] }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn.' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi lấy chi tiết hóa đơn:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

// ==================================================
//  DELETE /api/orders/:id — Hủy hóa đơn + hoàn kho
// ==================================================
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const order = await Order.findOne({
      where: { id: req.params.id, store_id },
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn.' });
    }

    // Hoàn kho
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const product = await Product.findOne({
          where: { id: item.product_id, store_id },
          transaction: t,
        });
        if (product) {
          product.stock += item.quantity;
          await product.save({ transaction: t });
        }
      }
    }

    // Nếu là đơn nợ → giảm nợ khách hàng
    if (order.is_debt && order.customer_id && !order.debt_paid) {
      const customer = await Customer.findOne({
        where: { id: order.customer_id, store_id },
        transaction: t,
      });
      if (customer) {
        customer.total_debt = Math.max(0, Number(customer.total_debt) - Number(order.total_price));
        await customer.save({ transaction: t });
      }
    }

    await order.destroy({ transaction: t });
    await t.commit();

    return res.json({ success: true, message: 'Đã hủy hóa đơn và hoàn kho thành công!' });
  } catch (error) {
    await t.rollback();
    console.error('Lỗi hủy hóa đơn:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

module.exports = router;
