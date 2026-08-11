const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const { Order, Product, Batch, Store, Customer } = require('../models');

const router = express.Router();

// ==================================================
//  GET /api/dashboard/stats — Thống kê tổng hợp
// ==================================================
router.get('/stats', async (req, res) => {
  try {
    const store_id = req.store_id;

    // --- Thông tin cửa hàng ---
    const store = await Store.findByPk(store_id, {
      attributes: ['id', 'store_name', 'email', 'created_at'],
    });

    // --- Tổng doanh thu ---
    const totalRevenue = await Order.sum('total_price', { where: { store_id } }) || 0;

    // --- Tổng giá vốn ---
    const totalCost = await Order.sum('total_cost', { where: { store_id } }) || 0;

    // --- Tổng lợi nhuận ---
    const totalProfit = totalRevenue - totalCost;

    // --- Tổng số đơn ---
    const totalOrders = await Order.count({ where: { store_id } });

    // --- Tổng sản phẩm ---
    const totalProducts = await Product.count({ where: { store_id } });

    // --- Tổng lô hàng ---
    const totalBatches = await Batch.count({ where: { store_id } });

    // --- Tổng khách hàng ---
    const totalCustomers = await Customer.count({ where: { store_id } });

    // --- Tổng nợ ---
    const totalDebt = await Customer.sum('total_debt', { where: { store_id } }) || 0;

    // --- Lô sắp hết hạn (7 ngày) ---
    const today = new Date().toISOString().split('T')[0];
    const in7days = new Date();
    in7days.setDate(in7days.getDate() + 7);
    const warn7 = in7days.toISOString().split('T')[0];

    const expiringCount = await Batch.count({
      where: {
        store_id,
        expiry_date: { [Op.gte]: today, [Op.lte]: warn7 },
      },
    });

    const expiredCount = await Batch.count({
      where: { store_id, expiry_date: { [Op.lt]: today } },
    });

    // --- Tồn kho thấp ---
    const lowStockCount = await Product.count({
      where: { store_id, stock: { [Op.lte]: 5 } },
    });

    // --- Doanh thu & lợi nhuận theo tháng (12 tháng gần nhất) ---
    const allOrders = await Order.findAll({
      where: { store_id },
      attributes: ['total_price', 'total_cost', 'created_at'],
      order: [['created_at', 'ASC']],
      raw: true,
    });

    // Nhóm theo tháng
    const monthlyMap = {};
    allOrders.forEach((order) => {
      const d = new Date(order.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, revenue: 0, cost: 0, profit: 0, orders: 0 };
      }
      monthlyMap[key].revenue += Number(order.total_price);
      monthlyMap[key].cost += Number(order.total_cost) || 0;
      monthlyMap[key].profit += Number(order.total_price) - (Number(order.total_cost) || 0);
      monthlyMap[key].orders += 1;
    });

    // Tạo 12 tháng gần nhất (đảm bảo có đủ tháng dù không có đơn)
    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.push(monthlyMap[key] || { month: key, revenue: 0, cost: 0, profit: 0, orders: 0 });
    }

    // --- Trung bình doanh thu tháng ---
    const monthsWithRevenue = monthlyData.filter((m) => m.revenue > 0);
    const avgMonthlyRevenue = monthsWithRevenue.length > 0
      ? monthsWithRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthsWithRevenue.length
      : 0;

    const avgMonthlyProfit = monthsWithRevenue.length > 0
      ? monthsWithRevenue.reduce((sum, m) => sum + m.profit, 0) / monthsWithRevenue.length
      : 0;

    // --- Tháng hiện tại ---
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonth = monthlyMap[currentMonthKey] || { month: currentMonthKey, revenue: 0, cost: 0, profit: 0, orders: 0 };

    // --- Lô hàng gần hết hạn nhất ---
    const upcomingBatches = await Batch.findAll({
      where: { store_id, expiry_date: { [Op.gte]: today } },
      include: [{ model: Product, as: 'product', attributes: ['product_name'] }],
      order: [['expiry_date', 'ASC']],
      limit: 5,
    });

    // --- Hóa đơn gần nhất ---
    const recentOrders = await Order.findAll({
      where: { store_id },
      include: [{ model: Customer, as: 'customer', attributes: ['id', 'customer_name'] }],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    return res.json({
      success: true,
      data: {
        store,
        summary: {
          totalRevenue,
          totalCost,
          totalProfit,
          totalOrders,
          totalProducts,
          totalBatches,
          totalCustomers,
          totalDebt,
          expiringCount,
          expiredCount,
          lowStockCount,
          avgMonthlyRevenue: Math.round(avgMonthlyRevenue),
          avgMonthlyProfit: Math.round(avgMonthlyProfit),
          currentMonth,
        },
        monthlyData,
        upcomingBatches,
        recentOrders,
      },
    });

  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
  }
});

module.exports = router;
