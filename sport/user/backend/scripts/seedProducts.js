const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

const adminId = '698063333340a4e2fc9ca5bd';

const products = [
    // --- CRICKET ---
    {
        user: adminId,
        name: 'Willow Master Pro Bat',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070&auto=format&fit=crop',
        brand: 'Maruthi Elite',
        category: 'Cricket',
        description: 'Elite Grade 1 English Willow for professional power hitting.',
        price: 18500,
        countInStock: 5,
        rating: 4.9,
        numReviews: 68
    },
    {
        user: adminId,
        name: 'Test Grade Leather Ball',
        image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=2074&auto=format&fit=crop',
        brand: 'Speedster',
        category: 'Cricket',
        description: 'Premium alum tanned leather for test match conditions.',
        price: 1200,
        countInStock: 100,
        rating: 4.8,
        numReviews: 45
    },
    // --- FOOTBALL ---
    {
        user: adminId,
        name: 'Vortex Elite Match Ball',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
        brand: 'Titan',
        category: 'Football',
        description: 'FIFA Quality Pro match ball with thermal bonding.',
        price: 4500,
        countInStock: 20,
        rating: 4.9,
        numReviews: 128
    },
    {
        user: adminId,
        name: 'Phantom Strike Boots',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        brand: 'AeroStream',
        category: 'Football',
        description: 'Lightweight agility boots with high-traction studs.',
        price: 8900,
        countInStock: 15,
        rating: 4.7,
        numReviews: 56
    },
    // --- BASKETBALL ---
    {
        user: adminId,
        name: 'Zenith Grip Basketball',
        image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2142&auto=format&fit=crop',
        brand: 'Vortex',
        category: 'Basketball',
        description: 'Advanced moisture-wicking technology for ultimate indoor/outdoor control.',
        price: 4200,
        countInStock: 25,
        rating: 4.8,
        numReviews: 92
    },
    {
        user: adminId,
        name: 'Sky-High Pro Hoop',
        image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=2070&auto=format&fit=crop',
        brand: 'Iron Grip',
        category: 'Basketball',
        description: 'Professional grade rim and backboard for ultimate performance.',
        price: 24500,
        countInStock: 3,
        rating: 4.9,
        numReviews: 14
    },
    // --- GYM & FITNESS ---
    {
        user: adminId,
        name: 'Cast Iron Kettlebell',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop',
        brand: 'Iron Grip',
        category: 'Gym',
        description: 'Single-piece solid cast iron for extreme durability and heavy lifting.',
        price: 3800,
        countInStock: 40,
        rating: 4.7,
        numReviews: 76
    },
    {
        user: adminId,
        name: 'Adjustable Dumbbell Set',
        image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=2070&auto=format&fit=crop',
        brand: 'Titan',
        category: 'Gym',
        description: 'Space-saving adjustable weights for full-body conditioning.',
        price: 15600,
        countInStock: 12,
        rating: 4.8,
        numReviews: 31
    },
    // --- TENNIS ---
    {
        user: adminId,
        name: 'Phantom Aero Racket',
        image: 'https://images.unsplash.com/photo-1595435066311-64e0edb2605b?q=80&w=2072&auto=format&fit=crop',
        brand: 'AeroStream',
        category: 'Tennis',
        description: 'Graphite frame designed for maximum topspin and power.',
        price: 14500,
        countInStock: 8,
        rating: 4.9,
        numReviews: 42
    },
    {
        user: adminId,
        name: 'Pro-Court Tennis Balls',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=2072&auto=format&fit=crop',
        brand: 'Vortex',
        category: 'Tennis',
        description: 'Pressurized professional balls for consistent bounce and durability.',
        price: 850,
        countInStock: 200,
        rating: 4.6,
        numReviews: 110
    },
    // --- VOLLEYBALL ---
    {
        user: adminId,
        name: 'Quantum Spike Ball',
        image: 'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=2070&auto=format&fit=crop',
        brand: 'Lumina Sports',
        category: 'Volleyball',
        description: 'Micro-fiber composite cover for elite professional play.',
        price: 2800,
        countInStock: 30,
        rating: 4.8,
        numReviews: 24
    },
    // --- BADMINTON ---
    {
        user: adminId,
        name: 'NanoStrike Racket',
        image: 'https://images.unsplash.com/photo-1626225916489-3286df9c0137?q=80&w=2070&auto=format&fit=crop',
        brand: 'NanoTech',
        category: 'Badminton',
        description: 'Hyper-balanced frame for speed and sharp smashes.',
        price: 4900,
        countInStock: 15,
        rating: 4.7,
        numReviews: 53
    },
    // --- ATHLETICS ---
    {
        user: adminId,
        name: 'Titan Track Spikes',
        image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1974&auto=format&fit=crop',
        brand: 'Titan',
        category: 'Athletics',
        description: 'Minimalist sprinting shoes with high-performance traction plate.',
        price: 6500,
        countInStock: 20,
        rating: 4.8,
        numReviews: 19
    },
    // --- SWIMMING ---
    {
        user: adminId,
        name: 'Hydro-Speed Goggles',
        image: 'https://images.unsplash.com/photo-1600881333168-2ed334442bd2?q=80&w=2070&auto=format&fit=crop',
        brand: 'HydroFit',
        category: 'Swimming',
        description: 'Low-profile racing goggles with peripheral vision lenses.',
        price: 1800,
        countInStock: 60,
        rating: 4.7,
        numReviews: 41
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // CLEAR ALL PRODUCTS TO PREVENT DUPLICATES
        await Product.deleteMany({});
        console.log('Old products cleared.');

        await Product.insertMany(products);
        console.log('New curated products seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
