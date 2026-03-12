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
  origin: ['https://maruthisports-admin-dcu0ujc1r-monikasrims-projects.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
