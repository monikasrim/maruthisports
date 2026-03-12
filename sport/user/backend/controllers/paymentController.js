const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret_123',
});

// @desc    Create Razorpay order
// @route   POST /api/payment/order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: Number(amount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    // DEBUG: Mock Mode for Demo Stability
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('mock')) {
        console.log('--- MARUTHI SPORTS PAYMENT SIMULATION ACTIVE ---');
        return res.json({
            id: `order_mock_${Date.now()}`,
            amount: options.amount,
            currency: options.currency,
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_MOCK_READY_123',
            mock: true
        });
    }

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            ...order,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500);
        throw new Error('Order creation failed: ' + error.message);
    }
});

// @desc    Verify payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'mock_secret_123')
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid signature');
    }
});

module.exports = {
    createRazorpayOrder,
    verifyPayment,
};
