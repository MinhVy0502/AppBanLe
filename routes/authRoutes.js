const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register — Đăng ký tài khoản mới
router.post('/register', authController.register);

// POST /api/auth/login — Đăng nhập
router.post('/login', authController.login);

module.exports = router;
