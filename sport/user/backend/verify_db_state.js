const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log(`Total Products: ${products.length}`);

        const categories = [...new Set(products.map(p => p.category))];
        console.log(`Categories found: ${categories.join(', ')}`);

        products.slice(0, 5).forEach(p => {
            console.log(`- ${p.name} (${p.category})`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
