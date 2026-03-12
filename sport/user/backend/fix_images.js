const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const https = require('https');

const fallbacks = {
    'Tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    'Swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    'Badminton': 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80',
    'Default': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
};

async function checkAndUpdateImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        for (let p of products) {
            if (p.image && p.image.startsWith('https://images.unsplash.com')) {
                const isOk = await new Promise((resolve) => {
                    https.get(p.image, (res) => resolve(res.statusCode === 200 || res.statusCode === 302))
                        .on('error', () => resolve(false));
                });

                if (!isOk) {
                    console.log(`Fixing 404 image for: ${p.name} (${p.category})`);
                    const newImage = fallbacks[p.category] || fallbacks['Default'];
                    p.image = newImage;
                    await p.save();
                }
            } else if (!p.image || p.image.includes('placehold.co')) {
                console.log(`Fixing placeholder/empty image for: ${p.name} (${p.category})`);
                const newImage = fallbacks[p.category] || fallbacks['Default'];
                p.image = newImage;
                await p.save();
            }
        }
        console.log('Done updating images.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAndUpdateImages();
