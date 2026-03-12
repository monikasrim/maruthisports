const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            appliedCoupon: req.body.appliedCoupon,
            isPaid: req.body.isPaid || false,
            paidAt: req.body.paidAt,
            paymentResult: req.body.paymentResult
        });

        const createdOrder = await order.save();
        const populatedOrder = await createdOrder.populate('user', 'name email');

        // DECREMENT STOCK & CREATE NOTIFICATION
        const lowStockItems = [];
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock -= item.qty;
                await product.save();

                if (product.countInStock <= 5) {
                    lowStockItems.push(product);
                }
            }
        }

        // Send Order Confirmation Email
        try {
            const sendEmail = require('../utils/sendEmail');
            await sendEmail({
                email: populatedOrder.user.email,
                subject: 'Mission Confirmed: Your Maruthi Sports Gear is Processing',
                html: `
                    <div style="font-family: sans-serif; color: #0f172a; padding: 40px; background: #f8fafc;">
                        <h1 style="font-style: italic; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; font-size: 32px;">MARUTHI <span style="color: #2563eb;">SPORTS</span></h1>
                        <p style="font-size: 18px; font-weight: 500;">Hello ${populatedOrder.user.name}, pro athlete in the making!</p>
                        <p>Your order <strong>#${createdOrder._id.toString().toUpperCase()}</strong> has been successfully placed. Our team is prepping your equipment for deployment.</p>
                        <div style="background: white; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; margin: 30px 0;">
                            <h2 style="font-weight: 900; text-transform: uppercase; font-size: 14px; margin-bottom: 20px;">Equipment Summary</h2>
                            ${orderItems.map(item => `<p style="font-size: 12px; font-weight: 700;">${item.name} x ${item.qty} - ₹${item.price.toLocaleString()}</p>`).join('')}
                            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;">
                            <p style="font-size: 16px; font-weight: 900;">Total Investment: ₹${totalPrice.toLocaleString()}</p>
                        </div>
                        <p style="font-size: 12px; color: #64748b;">Get ready to outperform. The field is waiting.</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Error sending order confirmation:', emailErr);
        }

        // Send Low Stock Alert to Admin
        if (lowStockItems.length > 0) {
            try {
                const sendEmail = require('../utils/sendEmail');
                await sendEmail({
                    email: process.env.ADMIN_EMAIL || 'admin@maruthisports.com',
                    subject: '🚨 CRITICAL: Low Stock Alert',
                    html: `
                        <div style="font-family: sans-serif; color: #ef4444; border: 2px solid #fee2e2; padding: 30px; border-radius: 20px;">
                            <h2 style="font-weight: 900; text-transform: uppercase;">Stock Depletion Warning</h2>
                            <p>The following pro equipment is running dangerously low after order #${createdOrder._id}:</p>
                            <ul>
                                ${lowStockItems.map(p => `<li><strong>${p.name}</strong> - Remaining: ${p.countInStock} units</li>`).join('')}
                            </ul>
                            <p style="color: #64748b;">Immediate restock recommended to maintain elite service levels.</p>
                        </div>
                    `
                });
            } catch (alertErr) {
                console.error('Error sending low stock alert:', alertErr);
            }
        }

        await Notification.create({
            user: req.user._id,
            title: 'Deployment Initiated',
            message: `Order #${createdOrder._id.toString().toUpperCase()} has been successfully processed. Your gear is prepping for dispatch.`,
            type: 'order'
        });

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to cancel this order');
        }

        if (order.status !== 'Pending' && order.status !== 'Processing') {
            res.status(400);
            throw new Error('Order can only be cancelled while Pending or Processing');
        }

        order.status = 'Cancelled';
        order.statusHistory.push({
            status: 'Cancelled',
            comment: 'Cancelled by user',
            timestamp: Date.now()
        });

        // RESTORE STOCK
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock += item.qty;
                await product.save();
            }
        }

        await Notification.create({
            user: req.user._id,
            title: 'Mission Aborted',
            message: `Order #${order._id.toString().toUpperCase()} has been cancelled. Equipment returning to base.`,
            type: 'order'
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    cancelOrder,
};
