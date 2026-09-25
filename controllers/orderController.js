const { Op } = require('sequelize');
const { Order, Product, Customer, sequelize } = require('../models');

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const { total_price, items, customer_id, is_debt, payment_method, cash_received, change_amount, note } = req.body;

    if (!total_price || Number(total_price) <= 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Tổng tiền không hợp lệ.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Danh sách sản phẩm trống.' });
    }

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

      const rate = Number(item.conversion_rate) > 0 ? Number(item.conversion_rate) : 1;
      const baseQty = Number(item.quantity) * rate;

      if (product.stock < baseQty) {
        await t.rollback();
        const unitDisplay = item.unit_name ? ` để bán ${item.quantity} ${item.unit_name}` : '';
        return res.status(400).json({
          success: false,
          message: `"${product.product_name}" chỉ còn ${product.stock} ${product.unit_type || 'đơn vị'} trong kho, không đủ ${baseQty} đơn vị lẻ${unitDisplay}.`,
        });
      }

      product.stock -= baseQty;
      await product.save({ transaction: t });

      const costPerBase = Number(product.cost_price) || 0;
      const itemCostPrice = costPerBase * rate;
      totalCost += costPerBase * baseQty;

      orderItems.push({
        product_id: product.id,
        product_name: product.product_name,
        price: Number(item.price !== undefined ? item.price : product.price),
        cost_price: itemCostPrice,
        quantity: Number(item.quantity),
        unit_name: item.unit_name || product.unit_type || 'cái',
        conversion_rate: rate,
        base_quantity: baseQty,
        unit_type: product.unit_type,
        units_per_pack: product.units_per_pack,
      });
    }

    const effectiveIsDebt = !!(is_debt || payment_method === 'debt');
    const effectiveMethod = payment_method || (effectiveIsDebt ? 'debt' : 'cash');

    if (customer_id) {
      const customer = await Customer.findOne({
        where: { id: customer_id, store_id },
        transaction: t,
      });
      if (!customer) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Khách hàng không tồn tại.' });
      }

      if (effectiveIsDebt) {
        customer.total_debt = Number(customer.total_debt) + Number(total_price);
        await customer.save({ transaction: t });
      }
    }

    const newOrder = await Order.create({
      store_id,
      customer_id: customer_id || null,
      total_price: Number(total_price),
      total_cost: totalCost,
      items: orderItems,
      is_debt: effectiveIsDebt,
      debt_paid: false,
      payment_method: effectiveMethod,
      cash_received: cash_received !== undefined ? Number(cash_received) : Number(total_price),
      change_amount: change_amount !== undefined ? Number(change_amount) : 0,
      note: note || null,
    }, { transaction: t });

    await t.commit();

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
    next(error);
  }
};

// GET /api/orders
exports.getAll = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const { from, to, page, limit: queryLimit } = req.query;

    const where = { store_id };

    if (from || to) {
      where.created_at = {};
      if (from) where.created_at[Op.gte] = new Date(from + 'T00:00:00');
      if (to) where.created_at[Op.lte] = new Date(to + 'T23:59:59');
    }

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
    next(error);
  }
};

// GET /api/orders/:id
exports.getById = async (req, res, next) => {
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
    next(error);
  }
};

// DELETE /api/orders/:id
exports.deleteOrder = async (req, res, next) => {
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

    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const product = await Product.findOne({
          where: { id: item.product_id, store_id },
          transaction: t,
        });
        if (product) {
          const returnQty = item.base_quantity || (item.quantity * (item.conversion_rate || 1));
          product.stock += returnQty;
          await product.save({ transaction: t });
        }
      }
    }

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
    next(error);
  }
};
