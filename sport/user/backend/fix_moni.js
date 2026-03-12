const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const fixUser = async () => {
    try {
        const user = await User.findOne({ email: 'moni@gmail.com' });

        if (!user) {
            console.log('User not found.');
            process.exit(1);
        }

        user.role = 'user';
        user.password = '12345678'; // Schema pre-save hook will hash this
        await user.save();

        console.log(`User moni@gmail.com updated:`);
        console.log(`- Role: ${user.role}`);
        console.log(`- Password: Reset to 12345678`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixUser();
