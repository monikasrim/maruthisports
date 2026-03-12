const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discount: {
            type: Number,
            required: true,
            default: 0
        },
        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed'],
            default: 'percentage'
        },
        expiryDate: {
            type: Date,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        usageLimit: {
            type: Number,
            default: null // null means no limit
        },
        usedCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Coupon', couponSchema);
