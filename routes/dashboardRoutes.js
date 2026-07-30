const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const { Order, Product, Batch, Store } = require('../models');

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

    // --- Tổng số đơn ---
    const totalOrders = await Order.count({ where: { store_id } });

    // --- Tổng sản phẩm ---
    const totalProducts = await Product.count({ where: { store_id } });

    // --- Tổng lô hàng ---
    const totalBatches = await Batch.count({ where: { store_id } });

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

    // --- Doanh thu & đơn hàng theo tháng (12 tháng gần nhất) ---
    const allOrders = await Order.findAll({
      where: { store_id },
      attributes: ['total_price', 'created_at'],
      order: [['created_at', 'ASC']],
      raw: true,
    });

    // Nhóm theo tháng
    const monthlyMap = {};
    allOrders.forEach((order) => {
      const d = new Date(order.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, revenue: 0, orders: 0 };
      }
      monthlyMap[key].revenue += Number(order.total_price);
      monthlyMap[key].orders += 1;
    });

    // Tạo 12 tháng gần nhất (đảm bảo có đủ tháng dù không có đơn)
    const monthlyData = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.push(monthlyMap[key] || { month: key, revenue: 0, orders: 0 });
    }

    // --- Trung bình doanh thu tháng ---
    const monthsWithRevenue = monthlyData.filter((m) => m.revenue > 0);
    const avgMonthlyRevenue = monthsWithRevenue.length > 0
      ? monthsWithRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthsWithRevenue.length
      : 0;

    // --- Tháng hiện tại ---
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonth = monthlyMap[currentMonthKey] || { month: currentMonthKey, revenue: 0, orders: 0 };

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
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    return res.json({
      success: true,
      data: {
        store,
        summary: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalBatches,
          expiringCount,
          expiredCount,
          lowStockCount,
          avgMonthlyRevenue: Math.round(avgMonthlyRevenue),
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
