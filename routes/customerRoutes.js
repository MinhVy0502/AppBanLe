const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

// GET /api/customers — Danh sách khách hàng
router.get('/', customerController.getAll);

// POST /api/customers — Tạo khách hàng mới
router.post('/', customerController.createCustomer);

// POST /api/customers/:id/pay-debt — Thanh toán nợ (body: { amount })
router.post('/:id/pay-debt', customerController.payDebt);

// GET /api/customers/:id/history — Lịch sử mua hàng
router.get('/:id/history', customerController.getHistory);

// PUT /api/customers/:id — Cập nhật khách hàng
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id — Xóa khách hàng
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
