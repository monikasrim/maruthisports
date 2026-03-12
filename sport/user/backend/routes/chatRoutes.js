const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Optional auth: we want to know if user is logged in for order data, but bot should work for guests too
// We'll create a custom middleware or just check in controller if req.user exists
// For now, let's use a modified protect or just a helper

const optionalProtect = async (req, res, next) => {
    let token;
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            next(); // Proceed without user
        }
    } else {
        next(); // Proceed without user
    }
};

router.post('/', optionalProtect, handleChat);

module.exports = router;
