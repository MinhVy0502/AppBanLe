require('dotenv').config();
const express = require('express');
const path = require('path');
const initDatabase = require('./config/initDatabase');

// Import routes
const authRoutes = require('./routes/authRoutes');
const shelfRoutes = require('./routes/shelfRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const batchRoutes = require('./routes/batchRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const importRoutes = require('./routes/importRoutes');

// Import controllers & middleware
const authController = require('./controllers/authController');
const authenticateToken = require('./middlewares/authenticateToken');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
//  Middleware chung
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
//  API Routes
// ===========================

// Route công khai (không cần token)
app.use('/api/auth', authRoutes);

// Route bảo mật (cần JWT token) — authenticateToken kiểm tra JWT và gắn req.store_id
app.use('/api/shelves', authenticateToken, shelfRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/batches', authenticateToken, batchRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/imports', authenticateToken, importRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Route profile (cần token)
app.get('/api/profile', authenticateToken, authController.getProfile);

// 404 cho các API route không hợp lệ
app.all('/api/{*path}', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint không tồn tại.' });
});

// ===========================
//  Global Error Handler
// ===========================
app.use(errorHandler);

// ===========================
//  Serve Frontend (Production)
// ===========================
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// SPA fallback — mọi route không phải API → trả về index.html
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// ===========================
//  Khởi chạy server
// ===========================
async function startServer() {
  try {
    // Kết nối database & chạy auto-migrations
    await initDatabase();

    // Khởi chạy Express server (0.0.0.0 = cho phép truy cập mạng LAN)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi chạy server:', error.message);
    process.exit(1);
  }
}

startServer();
