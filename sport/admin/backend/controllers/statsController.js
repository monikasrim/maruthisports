const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments({});

    // Calculate total sales
    const orders = await Order.find({ isPaid: true });
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get products with low stock (e.g., less than 10)
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } });

    // Fetch latest 5 orders
    const latestOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name');

    // Aggregate category distribution
    const categories = await Product.aggregate([
        { $group: { _id: '$category', value: { $sum: 1 } } },
        { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    // Fetch top 4 products (by rating/stock as a proxy for 'popular')
    const topProducts = await Product.find({})
        .sort({ rating: -1, numReviews: -1 })
        .limit(4);

    // Dynamic Alerts
    const alerts = [];
    if (lowStockProducts.length > 0) {
        alerts.push({
            type: 'warning',
            message: `${lowStockProducts.length} items are running low on stock.`,
            link: '/inventory'
        });
    }
    const pendingOrders = await Order.countDocuments({ isPaid: true, isDelivered: false });
    if (pendingOrders > 0) {
        alerts.push({
            type: 'info',
            message: `You have ${pendingOrders} orders waiting to be delivered.`,
            link: '/orders'
        });
    }

    // Real data for sales chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                paidAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                sales: { $sum: "$totalPrice" }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                name: "$_id",
                sales: 1,
                _id: 0
            }
        }
    ]);

    // Fill in missing days with 0 sales
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesChartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];
        const dayData = salesTrend.find(s => s.name === dateStr);
        salesChartData.push({
            name: dayName,
            sales: dayData ? dayData.sales : 0,
            date: dateStr
        });
    }

    res.json({
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales,
        lowStockProducts: lowStockProducts.length,
        salesChartData,
        latestOrders,
        categoryDistribution: categories,
        topProducts,
        alerts
    });
});

module.exports = {
    getDashboardStats,
};
