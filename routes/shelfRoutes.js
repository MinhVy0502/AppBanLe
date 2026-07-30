const express = require('express');
const { Shelf } = require('../models');

const router = express.Router();

// ==================================================
//  POST /api/shelves — Thêm kệ hàng mới
// ==================================================
router.post('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const { shelf_name } = req.body;

    if (!shelf_name || !shelf_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên kệ hàng.',
      });
    }

    const newShelf = await Shelf.create({
      store_id,
      shelf_name: shelf_name.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm kệ hàng thành công!',
      data: newShelf,
    });

  } catch (error) {
    console.error('Lỗi thêm kệ hàng:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  GET /api/shelves — Lấy danh sách kệ hàng
// ==================================================
router.get('/', async (req, res) => {
  try {
    const store_id = req.store_id;

    const shelves = await Shelf.findAll({
      where: { store_id },
      order: [['id', 'ASC']],
    });

    return res.json({
      success: true,
      data: shelves,
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách kệ hàng:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  GET /api/shelves/:id/products — Sản phẩm trên kệ
// ==================================================
router.get('/:id/products', async (req, res) => {
  try {
    const store_id = req.store_id;
    const shelfId = req.params.id;

    // Kiểm tra kệ có thuộc về cửa hàng hiện tại không
    const shelf = await Shelf.findOne({
      where: { id: shelfId, store_id },
    });

    if (!shelf) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kệ hàng này trong cửa hàng của bạn.',
      });
    }

    // Lấy sản phẩm trên kệ (dùng association đã định nghĩa)
    const products = await shelf.getProducts({
      order: [['id', 'ASC']],
    });

    return res.json({
      success: true,
      data: {
        shelf,
        products,
      },
    });

  } catch (error) {
    console.error('Lỗi lấy sản phẩm trên kệ:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  DELETE /api/shelves/:id — Xóa kệ hàng
// ==================================================
router.delete('/:id', async (req, res) => {
  try {
    const store_id = req.store_id;
    const shelfId = req.params.id;

    const shelf = await Shelf.findOne({
      where: { id: shelfId, store_id },
    });

    if (!shelf) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kệ hàng này trong cửa hàng của bạn.',
      });
    }

    await shelf.destroy();

    return res.json({
      success: true,
      message: `Đã xóa kệ "${shelf.shelf_name}". Sản phẩm trên kệ sẽ chuyển về trạng thái chưa xếp kệ.`,
    });

  } catch (error) {
    console.error('Lỗi xóa kệ hàng:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

module.exports = router;
