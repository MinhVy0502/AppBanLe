const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Store } = require('../models');

const router = express.Router();

// Số vòng lặp để tạo salt cho bcrypt (càng cao càng an toàn nhưng chậm hơn)
const SALT_ROUNDS = 10;

// ==================================================
//  POST /api/auth/register — Đăng ký tài khoản mới
// ==================================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, store_name } = req.body;

    // --- Validate đầu vào ---
    if (!email || !password || !store_name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email, mật khẩu và tên cửa hàng.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
      });
    }

    // --- Kiểm tra email đã tồn tại chưa ---
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.',
      });
    }

    // --- Hash mật khẩu bằng bcrypt ---
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // --- Tạo tài khoản cửa hàng mới ---
    const newStore = await Store.create({
      email,
      password_hash,
      store_name,
    });

    // --- Trả về kết quả (không trả password_hash) ---
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        id: newStore.id,
        email: newStore.email,
        store_name: newStore.store_name,
        created_at: newStore.created_at,
      },
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

// ==================================================
//  POST /api/auth/login — Đăng nhập
// ==================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validate đầu vào ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu.',
      });
    }

    // --- Tìm cửa hàng theo email ---
    const store = await Store.findOne({ where: { email } });
    if (!store) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.',
      });
    }

    // --- So sánh mật khẩu với hash đã lưu ---
    const isPasswordValid = await bcrypt.compare(password, store.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.',
      });
    }

    // --- Tạo JWT token chứa store_id ---
    const tokenPayload = {
      store_id: store.id,
      email: store.email,
      store_name: store.store_name,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // --- Trả về token cho Frontend ---
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
        store: {
          id: store.id,
          email: store.email,
          store_name: store.store_name,
        },
      },
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
    });
  }
});

module.exports = router;
