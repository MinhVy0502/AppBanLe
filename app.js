require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const shelfRoutes = require('./routes/shelfRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const batchRoutes = require('./routes/batchRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const importRoutes = require('./routes/importRoutes');

// Import middleware
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
//  Middleware chung
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
//  Routes
// ===========================

// Route công khai (không cần token)
app.use('/api/auth', authRoutes);

// Route bảo mật (cần token) — authenticateToken kiểm tra JWT và gắn req.store_id
app.use('/api/shelves', authenticateToken, shelfRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/batches', authenticateToken, batchRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/imports', authenticateToken, importRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Route profile mẫu (cần token)
app.get('/api/profile', authenticateToken, async (req, res) => {
  const { Store } = require('./models');

  const store = await Store.findByPk(req.store_id, {
    attributes: ['id', 'email', 'store_name', 'created_at'],
  });

  if (!store) {
    return res.status(404).json({ success: false, message: 'Cửa hàng không tồn tại.' });
  }

  return res.json({ success: true, data: store });
});

// ===========================
//  Serve Frontend (Production)
// ===========================
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// SPA fallback — mọi route không phải API → trả về index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// ===========================
//  Khởi chạy server
// ===========================
async function startServer() {
  try {
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    console.log('✅ Kết nối PostgreSQL thành công!');

    // Đồng bộ bảng (alter: true chỉ dùng trong development)
    const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
    await sequelize.sync(syncOptions);
    console.log('✅ Đồng bộ các bảng thành công!');

    // Khởi chạy Express server (0.0.0.0 = cho phép truy cập từ mạng LAN)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Không thể khởi chạy server:', error.message);
    process.exit(1);
  }
}

startServer();
