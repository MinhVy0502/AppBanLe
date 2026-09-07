const express = require('express');
const batchController = require('../controllers/batchController');

const router = express.Router();

// GET /api/batches/alerts — Cảnh báo hàng tồn, sắp hết hạn (trước /:id)
router.get('/alerts', batchController.getAlerts);

// GET /api/batches — Danh sách lô hàng (query ?product_id=)
router.get('/', batchController.getAll);

// POST /api/batches — Thêm lô hàng mới
router.post('/', batchController.createBatch);

// DELETE /api/batches/:id — Xóa lô hàng
router.delete('/:id', batchController.deleteBatch);

module.exports = router;
