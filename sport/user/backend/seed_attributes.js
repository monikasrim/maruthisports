const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://monikasrim05_db_user:WDe85o72I2c6p5LV@sportshop.6bmxgmq.mongodb.net/maruthi_sport?appName=sportshop';

const seedAttributes = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');

        const products = await productsCollection.find({}).toArray();

        for (const product of products) {
            let sizes = [];
            let colors = [];

            if (product.category.toLowerCase().includes('shoe') || product.category.toLowerCase().includes('footwear')) {
                sizes = ['UK 7', 'UK 8', 'UK 9', 'UK 10'];
                colors = ['Black', 'White', 'Blue'];
            } else if (product.category.toLowerCase().includes('clothing') || product.category.toLowerCase().includes('jersey')) {
                sizes = ['S', 'M', 'L', 'XL'];
                colors = ['Red', 'Blue', 'White', 'Yellow'];
            } else {
                // Equipment
                sizes = ['Standard', 'Pro'];
                colors = ['Default'];
            }

            await productsCollection.updateOne(
                { _id: product._id },
                { $set: { sizes, colors } }
            );
            console.log(`Updated product: ${product.name}`);
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedAttributes();
