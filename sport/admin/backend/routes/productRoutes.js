const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProductStock,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct);
router.route('/:id/stock').put(protect, admin, updateProductStock);

module.exports = router;
