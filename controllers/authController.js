const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Store } = require('../models');

const SALT_ROUNDS = 10;

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, store_name } = req.body;

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

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.',
      });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newStore = await Store.create({
      email,
      password_hash,
      store_name,
    });

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
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu.',
      });
    }

    const store = await Store.findOne({ where: { email } });
    if (!store) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, store.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.',
      });
    }

    const tokenPayload = {
      store_id: store.id,
      email: store.email,
      store_name: store.store_name,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

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
    next(error);
  }
};

// GET /api/profile
exports.getProfile = async (req, res, next) => {
  try {
    const store = await Store.findByPk(req.store_id, {
      attributes: ['id', 'email', 'store_name', 'created_at'],
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Cửa hàng không tồn tại.' });
    }

    return res.json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};
