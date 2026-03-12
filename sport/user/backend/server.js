const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://maruthisports-user.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Fallback/Main source from Admin for product images
app.use('/uploads', express.static('d:/MCA_FINAL PROJECT/sport/admin/backend/uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
