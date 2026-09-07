const express = require('express');
const shelfController = require('../controllers/shelfController');

const router = express.Router();

// GET /api/shelves — Lấy danh sách kệ hàng
router.get('/', shelfController.getAll);

// POST /api/shelves — Thêm kệ hàng mới
router.post('/', shelfController.createShelf);

// GET /api/shelves/:id/products — Danh sách sản phẩm trên kệ
router.get('/:id/products', shelfController.getShelfProducts);

// DELETE /api/shelves/:id — Xóa kệ hàng
router.delete('/:id', shelfController.deleteShelf);

module.exports = router;
