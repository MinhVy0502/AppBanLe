const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// GET /api/orders — Lấy danh sách hóa đơn (filter ?from=&to=&page=&limit=)
router.get('/', orderController.getAll);

// POST /api/orders — Tạo hóa đơn mới + trừ tồn kho
router.post('/', orderController.createOrder);

// GET /api/orders/:id — Chi tiết hóa đơn
router.get('/:id', orderController.getById);

// DELETE /api/orders/:id — Hủy hóa đơn + hoàn kho
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
