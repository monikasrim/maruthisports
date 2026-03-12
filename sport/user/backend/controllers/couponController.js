const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid or inactive coupon code');
    }

    if (coupon.expiryDate < new Date()) {
        res.status(400);
        throw new Error('Coupon has expired');
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        res.status(400);
        throw new Error('Coupon usage limit reached');
    }

    res.json({
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType
    });
});

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, discountType, expiryDate, usageLimit } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discount,
        discountType,
        expiryDate,
        usageLimit
    });

    res.status(201).json(coupon);
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
});

module.exports = {
    validateCoupon,
    createCoupon,
    getCoupons
};
