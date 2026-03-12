const express = require('express');
const router = express.Router();
const {
    validateCoupon,
    createCoupon,
    getCoupons
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.post('/validate', protect, validateCoupon);

module.exports = router;
