const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Handle AI Chat queries
// @route   POST /api/chat
// @access  Public (Optional Auth)
const handleChat = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const user = req.user; // From protect middleware if present

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    const query = message.toLowerCase();
    let response = "";
    let systemAction = null;
    let data = null;

    // 1. Intent: Order Tracking
    if (query.includes('order') || query.includes('track') || query.includes('status')) {
        if (!user) {
            response = "I can definitely help you with that! Please log in to your Elite Account so I can securely access your deployment data and track your gear.";
        } else {
            const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(3);
            if (orders.length > 0) {
                const latest = orders[0];
                const status = latest.status === 'Pending' ? 'Order Placed' : latest.status;
                response = `I've found your recent deployments. Your latest order #${latest._id.toString().slice(-6).toUpperCase()} is currently in the [${status}] stage. You can view full details in your Dashboard.`;
                data = { orders: orders.map(o => ({ id: o._id, status: o.status, total: o.totalPrice })) };
            } else {
                response = "I searched our archives but couldn't find any active gear deployments for your account yet. Ready to start your first setup?";
            }
        }
    }
    // 2. Intent: Product Search / Recommendations
    else if (query.includes('find') || query.includes('search') || query.includes('show') || query.includes('buy') ||
        query.includes('cricket') || query.includes('football') || query.includes('bat') || query.includes('ball') ||
        query.includes('shoe') || query.includes('jersey') || query.includes('gear') || query.includes('equipment')) {

        // Extract potential keywords
        const keywords = query.split(' ').filter(word => word.length > 3);
        const searchCriteria = {
            $or: [
                { name: { $regex: keywords.join('|') || query, $options: 'i' } },
                { category: { $regex: keywords.join('|') || query, $options: 'i' } },
                { brand: { $regex: keywords.join('|') || query, $options: 'i' } }
            ]
        };

        const products = await Product.find(searchCriteria).limit(3);

        if (products.length > 0) {
            response = `Our Pro-Analytics suggest these top-tier options for you: ${products.map(p => p.name).join(', ')}. These are currently deployment-ready in our shop!`;
            data = { products: products.map(p => ({ id: p._id, name: p.name, price: p.price, image: p.image })) };
        } else {
            response = "I couldn't find a precise match in our current elite inventory. However, we are constantly sourcing new high-performance gear. Try searching by category like 'Cricket' or 'Football'.";
        }
    }
    // 3. Intent: General Help / About
    else if (query.includes('who') || query.includes('help') || query.includes('what') || query.includes('support')) {
        response = "I am the Maruthi AI-Core, your dedicated sports equipment strategist. I can help you find professional gear, track your orders, and optimize your athletic setup. How can I assist your mission today?";
    }
    // 4. Default / Fallback
    else {
        response = "That's an interesting query. As an AI specialized in elite sports performance, I'm best at helping you find gear or track existing deployments. Could you tell me more about the sport you're focusing on?";
    }

    res.json({
        message: response,
        data,
        timestamp: new Date()
    });
});

module.exports = { handleChat };
