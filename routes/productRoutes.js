const express = require('express');
const { Product, Shelf } = require('../models');

const router = express.Router();

// ==================================================
//  GET /api/products — Lấy danh sách sản phẩm
//  Query: ?shelf=none → chỉ lấy sản phẩm chưa xếp kệ
// ==================================================
router.get('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const where = { store_id };

    if (req.query.shelf === 'none') {
      where.shelf_id = null;
    }

    const products = await Product.findAll({
      where,
      order: [['id', 'ASC']],
      include: [{ model: Shelf, as: 'shelf', attributes: ['id', 'shelf_name'] }],
    });

    return res.json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  POST /api/products — Thêm sản phẩm mới
// ==================================================
router.post('/', async (req, res) => {
  try {
    const store_id = req.store_id;
    const { product_name, price, cost_price, stock, shelf_id, unit_type, units_per_pack } = req.body;

    // --- Validate đầu vào ---
    if (!product_name || !product_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên sản phẩm.',
      });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm không hợp lệ.',
      });
    }

    // --- Validate unit_type ---
    const validUnitTypes = ['le', 'loc', 'thung', 'hop'];
    const finalUnitType = unit_type && validUnitTypes.includes(unit_type) ? unit_type : 'le';
    const finalUnitsPer = units_per_pack && Number(units_per_pack) > 0 ? Number(units_per_pack) : 1;

    // --- Nếu có shelf_id, kiểm tra kệ có thuộc cửa hàng này không ---
    if (shelf_id) {
      const shelf = await Shelf.findOne({
        where: { id: shelf_id, store_id },
      });

      if (!shelf) {
        return res.status(404).json({
          success: false,
          message: 'Kệ hàng không tồn tại hoặc không thuộc cửa hàng của bạn.',
        });
      }
    }

    const newProduct = await Product.create({
      store_id,
      shelf_id: shelf_id || null,
      product_name: product_name.trim(),
      price: Number(price),
      cost_price: cost_price !== undefined ? Number(cost_price) : 0,
      stock: stock !== undefined ? Number(stock) : 0,
      unit_type: finalUnitType,
      units_per_pack: finalUnitType === 'le' ? 1 : finalUnitsPer,
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      data: newProduct,
    });

  } catch (error) {
    console.error('Lỗi thêm sản phẩm:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  PUT /api/products/:id — Chỉnh sửa sản phẩm
// ==================================================
router.put('/:id', async (req, res) => {
  try {
    const store_id = req.store_id;
    const productId = req.params.id;

    const product = await Product.findOne({
      where: { id: productId, store_id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm này trong cửa hàng của bạn.',
      });
    }

    const { product_name, price, cost_price, stock, unit_type, units_per_pack } = req.body;

    if (product_name !== undefined) {
      if (!product_name.trim()) {
        return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống.' });
      }
      product.product_name = product_name.trim();
    }
    if (price !== undefined) product.price = Number(price);
    if (cost_price !== undefined) product.cost_price = Number(cost_price);
    if (stock !== undefined) product.stock = Number(stock);

    if (unit_type !== undefined) {
      const validUnitTypes = ['le', 'loc', 'thung', 'hop'];
      product.unit_type = validUnitTypes.includes(unit_type) ? unit_type : 'le';
    }
    if (units_per_pack !== undefined) {
      product.units_per_pack = product.unit_type === 'le' ? 1 : (Number(units_per_pack) > 0 ? Number(units_per_pack) : 1);
    }

    await product.save();

    return res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: product,
    });

  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  DELETE /api/products/:id — Xóa sản phẩm
// ==================================================
router.delete('/:id', async (req, res) => {
  try {
    const store_id = req.store_id;
    const productId = req.params.id;

    // Tìm sản phẩm thuộc cửa hàng hiện tại
    const product = await Product.findOne({
      where: { id: productId, store_id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm này trong cửa hàng của bạn.',
      });
    }

    await product.destroy();

    return res.json({
      success: true,
      message: 'Xóa sản phẩm thành công!',
    });

  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  PUT /api/products/:id/assign-shelf — Gán sản phẩm lên kệ
// ==================================================
router.put('/:id/assign-shelf', async (req, res) => {
  try {
    const store_id = req.store_id;
    const productId = req.params.id;
    const { shelf_id } = req.body;

    // --- Tìm sản phẩm thuộc cửa hàng hiện tại ---
    const product = await Product.findOne({
      where: { id: productId, store_id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm này trong cửa hàng của bạn.',
      });
    }

    // --- Nếu shelf_id = null → gỡ sản phẩm khỏi kệ ---
    if (shelf_id === null || shelf_id === undefined) {
      product.shelf_id = null;
      await product.save();

      return res.json({
        success: true,
        message: 'Đã gỡ sản phẩm khỏi kệ.',
        data: product,
      });
    }

    // --- Kiểm tra kệ có thuộc cửa hàng này không ---
    const shelf = await Shelf.findOne({
      where: { id: shelf_id, store_id },
    });

    if (!shelf) {
      return res.status(404).json({
        success: false,
        message: 'Kệ hàng không tồn tại hoặc không thuộc cửa hàng của bạn.',
      });
    }

    // --- Gán shelf_id cho sản phẩm ---
    product.shelf_id = shelf_id;
    await product.save();

    return res.json({
      success: true,
      message: `Đã gán sản phẩm "${product.product_name}" lên kệ "${shelf.shelf_name}".`,
      data: product,
    });

  } catch (error) {
    console.error('Lỗi gán sản phẩm lên kệ:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

module.exports = router;
