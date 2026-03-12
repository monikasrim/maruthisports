const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const fixes = {
    'Cricket Ball': 'https://plus.unsplash.com/premium_photo-1679933610996-cf3f5a285d82?q=80&w=800&auto=format&fit=crop',
    'Tennis Racket': 'https://images.unsplash.com/photo-1617152060867-a026c44919bc?w=800&q=80'
};

async function fixSpecificBrokenImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let updated = 0;

        for (const [name, imageUrl] of Object.entries(fixes)) {
            const product = await Product.findOne({ name });
            if (product) {
                product.image = imageUrl;
                await product.save();
                console.log(`Updated ${name}`);
                updated++;
            } else {
                console.log(`Product ${name} not found`);
            }
        }

        console.log(`Fixed ${updated} products.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixSpecificBrokenImages();
