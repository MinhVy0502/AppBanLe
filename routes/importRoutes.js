const express = require('express');
const importController = require('../controllers/importController');

const router = express.Router();

// GET /api/imports/stats — Thống kê nhập hàng
router.get('/stats', importController.getStats);

// GET /api/imports — Danh sách phiếu nhập (filter ?product_id=&from=&to=&page=&limit=)
router.get('/', importController.getAll);

// POST /api/imports — Tạo phiếu nhập hàng mới
router.post('/', importController.createImport);

// DELETE /api/imports/:id — Xóa phiếu nhập + trừ lại stock
router.delete('/:id', importController.deleteImport);

module.exports = router;
