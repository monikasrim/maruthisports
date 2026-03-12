const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const updates = [
    { id: "699f2b9de50c55cb48a67228", name: "Basketball Hoop", image: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67229", name: "Kettlebell", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a6722c", name: "Tennis Balls", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67227", name: "Basketball", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a6722f", name: "Running Spikes", image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a6722d", name: "Volleyball", image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67225", name: "Soccer Ball", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67223", name: "Cricket Bat", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67224", name: "Cricket Ball", image: "https://images.unsplash.com/photo-1543326727-cf6c39f8f416?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a6722e", name: "Badminton Racket", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67226", name: "Football Boots", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a6722a", name: "Dumbbell Set", image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a67230", name: "Swimming Goggles", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop" },
    { id: "699f2b9de50c55cb48a6722b", name: "Tennis Racket", image: "https://images.unsplash.com/photo-1617152060867-a026c44919bc?q=80&w=800&auto=format&fit=crop" }
];

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let count = 0;
        for (const update of updates) {
            await Product.findByIdAndUpdate(update.id, {
                name: update.name,
                image: update.image
            });
            console.log(`Updated ${update.name}`);
            count++;
        }

        console.log(`Successfully updated ${count} products.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
