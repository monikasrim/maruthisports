const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb+srv://monikasrim05_db_user:WDe85o72I2c6p5LV@sportshop.6bmxgmq.mongodb.net/maruthi_sport?appName=sportshop';

const debugUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'ishu@gmail.com';
        const passwordToTest = '12345678';

        // Define a simple User schema for debugging
        const UserSchema = new mongoose.Schema({
            email: String,
            password: String,
            role: String,
            name: String
        });
        const User = mongoose.model('UserDebug', UserSchema, 'users');

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`User with email ${email} NOT found.`);
            const allUsers = await User.find({}, 'email role');
            console.log('Available users:', allUsers);
        } else {
            console.log('User found:', {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                passwordHash: user.password
            });

            const isMatch = await bcrypt.compare(passwordToTest, user.password);
            console.log(`Password match for ${passwordToTest}: ${isMatch}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugUser();
