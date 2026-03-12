const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        order.statusHistory.push({ status, comment });

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        // Create notification for user
        await Notification.create({
            user: order.user,
            title: 'Order Status Updated',
            message: `Your order #${order._id} status has been updated to ${status}.`,
            type: 'order'
        });

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
        order.statusHistory.push({ status: 'Delivered', comment: 'Marked as delivered by admin' });

        const updatedOrder = await order.save();

        // Create notification for user
        await Notification.create({
            user: order.user,
            title: 'Order Delivered',
            message: `Victory! Your order #${order._id} has been marked as delivered.`,
            type: 'order'
        });

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus,
};
