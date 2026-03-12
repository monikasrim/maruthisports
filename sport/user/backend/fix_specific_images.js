const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const fixes = {
    'Pro-Court Tennis Balls': 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=800&auto=format&fit=crop', // Let's try fixing the w/q params or using a new one
    'NanoStrike Racket': 'https://images.unsplash.com/photo-1626225916489-3286df9c0137?q=80&w=800&auto=format&fit=crop',
    'Hydro-Speed Goggles': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
    'Phantom Aero Racket': 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=800&auto=format&fit=crop'
};

async function fixBrokenImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Replace the exact failing ones with guaranteed working alternatives from Unsplash
        const fallbackImages = {
            'Pro-Court Tennis Balls': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop', // A working tennis ball image
            'NanoStrike Racket': 'https://images.unsplash.com/photo-1610970881699-44a5587cab28?q=80&w=800&auto=format&fit=crop', // working badminton racket
        };

        const products = await Product.find({});
        let updated = 0;

        for (let p of products) {
            if (['Pro-Court Tennis Balls', 'NanoStrike Racket', 'Hydro-Speed Goggles', 'Phantom Aero Racket'].includes(p.name)) {
                console.log(`Updating image for ${p.name}`);
                if (p.name === 'Pro-Court Tennis Balls') p.image = fallbackImages['Pro-Court Tennis Balls'];
                if (p.name === 'NanoStrike Racket') p.image = fallbackImages['NanoStrike Racket'];
                if (p.name === 'Hydro-Speed Goggles') p.image = fixes['Hydro-Speed Goggles'];
                if (p.name === 'Phantom Aero Racket') p.image = fixes['Phantom Aero Racket'];
                await p.save();
                updated++;
            }
        }

        console.log(`Fixed ${updated} products.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixBrokenImages();
