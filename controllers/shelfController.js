const { Shelf } = require('../models');

// GET /api/shelves
exports.getAll = async (req, res, next) => {
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
    next(error);
  }
};

// POST /api/shelves
exports.createShelf = async (req, res, next) => {
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
    next(error);
  }
};

// GET /api/shelves/:id/products
exports.getShelfProducts = async (req, res, next) => {
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
    next(error);
  }
};

// DELETE /api/shelves/:id
exports.deleteShelf = async (req, res, next) => {
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
    next(error);
  }
};
