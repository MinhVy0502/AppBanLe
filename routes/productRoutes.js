const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// GET /api/products — Lấy danh sách sản phẩm (query ?shelf=none)
router.get('/', productController.getAll);

// POST /api/products — Thêm sản phẩm mới
router.post('/', productController.createProduct);

// PUT /api/products/:id/assign-shelf — Gán sản phẩm lên kệ
router.put('/:id/assign-shelf', productController.assignShelf);

// PUT /api/products/:id — Chỉnh sửa sản phẩm
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id — Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;
