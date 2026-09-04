const express = require('express');
const { Product, Shelf, ProductUnit, sequelize } = require('../models');

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
      include: [
        { model: Shelf, as: 'shelf', attributes: ['id', 'shelf_name'] },
        { model: ProductUnit, as: 'units' },
      ],
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
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const { product_name, price, cost_price, stock, shelf_id, unit_type, units_per_pack, units, allow_retail } = req.body;

    // --- Validate đầu vào ---
    if (!product_name || !product_name.trim()) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên sản phẩm.',
      });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm không hợp lệ.',
      });
    }

    // --- Validate unit_type & packaging ---
    const finalUnitType = unit_type && String(unit_type).trim() ? String(unit_type).trim().toLowerCase() : 'lon';
    const finalUnitsPer = units_per_pack && Number(units_per_pack) > 0 ? Number(units_per_pack) : 1;
    const finalAllowRetail = allow_retail !== undefined ? !!allow_retail : true;

    // --- Nếu có shelf_id, kiểm tra kệ có thuộc cửa hàng này không ---
    if (shelf_id) {
      const shelf = await Shelf.findOne({
        where: { id: shelf_id, store_id },
        transaction: t,
      });

      if (!shelf) {
        await t.rollback();
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
      units_per_pack: finalUnitsPer,
      allow_retail: finalAllowRetail,
    }, { transaction: t });

    // --- Thêm các quy cách đóng gói (ProductUnit) nếu có ---
    if (Array.isArray(units) && units.length > 0) {
      for (const u of units) {
        if (u.unit_name && u.unit_name.trim() && Number(u.conversion_rate) > 1) {
          await ProductUnit.create({
            store_id,
            product_id: newProduct.id,
            unit_name: u.unit_name.trim(),
            conversion_rate: Number(u.conversion_rate),
            price: Number(u.price) || 0,
            cost_price: u.cost_price !== undefined && u.cost_price !== null ? Number(u.cost_price) : 0,
            barcode: u.barcode ? String(u.barcode).trim() : null,
            is_default_import: !!u.is_default_import,
          }, { transaction: t });
        }
      }
    }

    await t.commit();

    const createdProduct = await Product.findByPk(newProduct.id, {
      include: [
        { model: Shelf, as: 'shelf', attributes: ['id', 'shelf_name'] },
        { model: ProductUnit, as: 'units' },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      data: createdProduct,
    });

  } catch (error) {
    await t.rollback();
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
  const t = await sequelize.transaction();
  try {
    const store_id = req.store_id;
    const productId = req.params.id;

    const product = await Product.findOne({
      where: { id: productId, store_id },
      transaction: t,
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm này trong cửa hàng của bạn.',
      });
    }

    const { product_name, price, cost_price, stock, unit_type, units_per_pack, units, shelf_id, allow_retail } = req.body;

    if (product_name !== undefined) {
      if (!product_name.trim()) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống.' });
      }
      product.product_name = product_name.trim();
    }
    if (price !== undefined) product.price = Number(price);
    if (cost_price !== undefined) product.cost_price = Number(cost_price);
    if (stock !== undefined) product.stock = Number(stock);
    if (shelf_id !== undefined) product.shelf_id = shelf_id || null;
    if (allow_retail !== undefined) product.allow_retail = !!allow_retail;

    if (unit_type !== undefined && String(unit_type).trim()) {
      product.unit_type = String(unit_type).trim().toLowerCase();
    }
    if (units_per_pack !== undefined) {
      product.units_per_pack = Number(units_per_pack) > 0 ? Number(units_per_pack) : 1;
    }

    await product.save({ transaction: t });

    // --- Cập nhật danh sách ProductUnit nếu có truyền units ---
    if (Array.isArray(units)) {
      // Xóa các unit cũ
      await ProductUnit.destroy({
        where: { product_id: product.id, store_id },
        transaction: t,
      });

      // Tạo lại các unit mới
      for (const u of units) {
        if (u.unit_name && u.unit_name.trim() && Number(u.conversion_rate) > 1) {
          await ProductUnit.create({
            store_id,
            product_id: product.id,
            unit_name: u.unit_name.trim(),
            conversion_rate: Number(u.conversion_rate),
            price: Number(u.price) || 0,
            cost_price: u.cost_price !== undefined && u.cost_price !== null ? Number(u.cost_price) : 0,
            barcode: u.barcode ? String(u.barcode).trim() : null,
            is_default_import: !!u.is_default_import,
          }, { transaction: t });
        }
      }
    }

    await t.commit();

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        { model: Shelf, as: 'shelf', attributes: ['id', 'shelf_name'] },
        { model: ProductUnit, as: 'units' },
      ],
    });

    return res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: updatedProduct,
    });

  } catch (error) {
    await t.rollback();
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
