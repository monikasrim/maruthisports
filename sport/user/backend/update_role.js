const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://monikasrim05_db_user:WDe85o72I2c6p5LV@sportshop.6bmxgmq.mongodb.net/maruthi_sport?appName=sportshop';

const updateRole = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'ishu@gmail.com';

        // Use standard mongoose methods to update
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount === 0) {
            console.log(`User with email ${email} NOT found.`);
        } else {
            console.log(`Successfully updated role for ${email} to admin.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateRole();
