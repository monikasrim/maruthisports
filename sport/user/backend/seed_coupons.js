const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedCoupons = async () => {
    try {
        await Coupon.deleteMany();

        const coupons = [
            {
                code: 'MARUTHI10',
                discount: 10,
                discountType: 'percentage',
                expiryDate: new Date('2026-12-31'),
                isActive: true,
                usageLimit: 100
            },
            {
                code: 'PRO25',
                discount: 25,
                discountType: 'percentage',
                expiryDate: new Date('2026-12-31'),
                isActive: true,
                usageLimit: 50
            },
            {
                code: 'WELCOME500',
                discount: 500,
                discountType: 'fixed',
                expiryDate: new Date('2026-12-31'),
                isActive: true,
                usageLimit: null
            }
        ];

        await Coupon.insertMany(coupons);
        console.log('Coupons Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding coupons:', error);
        process.exit(1);
    }
};

seedCoupons();
