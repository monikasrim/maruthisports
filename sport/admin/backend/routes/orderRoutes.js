const express = require('express');
const router = express.Router();
const {
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getOrders);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
