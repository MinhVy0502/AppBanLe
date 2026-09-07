const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// GET /api/dashboard/stats — Thống kê tổng hợp báo cáo kinh doanh
router.get('/stats', dashboardController.getStats);

module.exports = router;
