const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (wishlist) {
        res.json(wishlist);
    } else {
        res.json({ products: [] });
    }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        if (wishlist.products.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }
        wishlist.products.push(productId);
        await wishlist.save();
    } else {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId],
        });
    }

    res.status(201).json(wishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );
        await wishlist.save();
        res.json(wishlist);
    } else {
        res.status(404);
        throw new Error('Wishlist not found');
    }
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
