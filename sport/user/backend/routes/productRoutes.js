const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getTopProducts,
    createProductReview,
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
