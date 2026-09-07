const { Customer, Order, sequelize } = require('../models');

// GET /api/customers
exports.getAll = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const customers = await Customer.findAll({
      where: { store_id },
      order: [['customer_name', 'ASC']],
    });
    return res.json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers
exports.createCustomer = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const { customer_name, phone, notes } = req.body;

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên khách hàng.' });
    }

    const customer = await Customer.create({
      store_id,
      customer_name: customer_name.trim(),
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      total_debt: 0,
    });

    return res.status(201).json({ success: true, message: 'Thêm khách hàng thành công!', data: customer });
  } catch (error) {
    next(error);
  }
};

// PUT /api/customers/:id
exports.updateCustomer = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const customer = await Customer.findOne({ where: { id: req.params.id, store_id } });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }

    const { customer_name, phone, notes } = req.body;
    if (customer_name !== undefined) {
      if (!customer_name.trim()) {
        return res.status(400).json({ success: false, message: 'Tên khách hàng không được để trống.' });
      }
      customer.customer_name = customer_name.trim();
    }
    if (phone !== undefined) customer.phone = phone?.trim() || null;
    if (notes !== undefined) customer.notes = notes?.trim() || null;

    await customer.save();
    return res.json({ success: true, message: 'Cập nhật thành công!', data: customer });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customers/:id
exports.deleteCustomer = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const customer = await Customer.findOne({ where: { id: req.params.id, store_id } });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }

    if (Number(customer.total_debt) > 0) {
      return res.status(400).json({
        success: false,
        message: `Khách "${customer.customer_name}" vẫn còn nợ ${Number(customer.total_debt).toLocaleString('vi-VN')} ₫. Vui lòng thanh toán nợ trước khi xóa.`,
      });
    }

    await customer.destroy();
    return res.json({ success: true, message: 'Xóa khách hàng thành công!' });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers/:id/pay-debt
exports.payDebt = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const customer = await Customer.findOne({
      where: { id: req.params.id, store_id },
      transaction: t,
    });

    if (!customer) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }

    const { amount } = req.body;
    const payAmount = Number(amount);
    const currentDebt = Number(customer.total_debt);

    if (!payAmount || payAmount <= 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Số tiền thanh toán không hợp lệ.' });
    }

    if (payAmount > currentDebt) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Số tiền thanh toán (${payAmount.toLocaleString('vi-VN')} ₫) lớn hơn tổng nợ (${currentDebt.toLocaleString('vi-VN')} ₫).`,
      });
    }

    customer.total_debt = currentDebt - payAmount;
    await customer.save({ transaction: t });

    if (Number(customer.total_debt) === 0) {
      await Order.update(
        { debt_paid: true },
        {
          where: { customer_id: customer.id, store_id, is_debt: true, debt_paid: false },
          transaction: t,
        }
      );
    }

    await t.commit();

    return res.json({
      success: true,
      message: payAmount === currentDebt
        ? `Đã thanh toán hết nợ cho "${customer.customer_name}"!`
        : `Đã thanh toán ${payAmount.toLocaleString('vi-VN')} ₫. Còn nợ: ${Number(customer.total_debt).toLocaleString('vi-VN')} ₫.`,
      data: customer,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// GET /api/customers/:id/history
exports.getHistory = async (req, res, next) => {
  try {
    const store_id = req.store_id;
    const customer = await Customer.findOne({
      where: { id: req.params.id, store_id },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng.' });
    }

    const orders = await Order.findAll({
      where: { customer_id: customer.id, store_id },
      order: [['created_at', 'DESC']],
      limit: 100,
    });

    return res.json({
      success: true,
      data: { customer, orders },
    });
  } catch (error) {
    next(error);
  }
};
